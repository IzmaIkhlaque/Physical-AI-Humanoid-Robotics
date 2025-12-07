---
sidebar_position: 5
title: Tactile and Force Sensing
description: Enabling robots to feel and respond to physical contact
---

# Tactile and Force Sensing

## Learning Objectives

- Understand different types of tactile and force sensors
- Learn to process tactile sensor data
- Implement force-controlled manipulation
- Apply tactile sensing to grasp planning and slip detection

## Introduction to Tactile Sensing

While vision tells a robot what objects look like, tactile sensing tells it what objects feel like. Tactile sensing is essential for:

- Safe human-robot interaction
- Delicate object manipulation
- Texture recognition
- Slip detection during grasping

### Tactile Sensing Modalities

| Sensor Type | What It Measures | Use Case | Examples |
|-------------|------------------|----------|----------|
| Force/Torque | 6-DOF forces | Arm end-effector | ATI, OnRobot |
| Pressure Arrays | Contact distribution | Gripper fingers | BioTac, GelSight |
| Strain Gauges | Deformation | Joint torques | Built into actuators |
| Capacitive | Proximity + contact | Skin sensors | Robot skin arrays |
| Piezoelectric | Dynamic contact | Slip detection | PVDF films |

## Force/Torque Sensors

6-axis F/T sensors measure forces and torques at the wrist:

```python
import numpy as np

class ForceTorqueSensor:
    """Interface for 6-axis force/torque sensor"""

    def __init__(self, serial_port='/dev/ttyUSB0', calibration_file=None):
        self.serial_port = serial_port
        self.calibration_matrix = np.eye(6)
        self.bias = np.zeros(6)

        if calibration_file:
            self.load_calibration(calibration_file)

    def read_raw(self):
        """Read raw sensor values"""
        # Implementation depends on specific sensor
        # Returns [fx, fy, fz, tx, ty, tz]
        raw = self._read_from_sensor()
        return np.array(raw)

    def read(self):
        """Read calibrated force/torque"""
        raw = self.read_raw()
        calibrated = self.calibration_matrix @ raw - self.bias
        return {
            'force': calibrated[:3],   # [fx, fy, fz] in Newtons
            'torque': calibrated[3:]   # [tx, ty, tz] in Nm
        }

    def calibrate_bias(self, num_samples=100):
        """Remove gravity/mounting bias"""
        samples = []
        for _ in range(num_samples):
            samples.append(self.read_raw())

        self.bias = self.calibration_matrix @ np.mean(samples, axis=0)

    def get_contact_force_magnitude(self):
        """Get total contact force magnitude"""
        reading = self.read()
        return np.linalg.norm(reading['force'])

    def detect_contact(self, threshold=2.0):
        """Detect if robot is in contact"""
        force_mag = self.get_contact_force_magnitude()
        return force_mag > threshold


class ForceController:
    """Force control for robot manipulation"""

    def __init__(self, ft_sensor, kp=0.001, ki=0.0001, kd=0.00005):
        self.sensor = ft_sensor
        self.kp = kp
        self.ki = ki
        self.kd = kd

        self.integral = np.zeros(3)
        self.last_error = np.zeros(3)

    def compute_velocity(self, target_force):
        """Compute velocity to achieve target force"""
        current = self.sensor.read()['force']
        error = target_force - current

        self.integral += error
        derivative = error - self.last_error
        self.last_error = error

        velocity = (self.kp * error +
                   self.ki * self.integral +
                   self.kd * derivative)

        return velocity

    def push_with_force(self, target_force_z=5.0, max_velocity=0.01):
        """Push down with specified force"""
        target = np.array([0, 0, -target_force_z])
        velocity = self.compute_velocity(target)

        # Limit velocity
        velocity = np.clip(velocity, -max_velocity, max_velocity)

        return velocity
```

## Tactile Sensor Arrays

High-resolution tactile sensors for gripper fingers:

```python
class TactileArray:
    """Process data from tactile sensor array"""

    def __init__(self, rows=16, cols=16):
        self.rows = rows
        self.cols = cols
        self.baseline = None

    def read_pressure_map(self):
        """Read pressure distribution from sensor"""
        # Returns 2D array of pressure values
        pressure = self._read_from_sensor()
        return pressure.reshape(self.rows, self.cols)

    def calibrate_baseline(self, num_samples=50):
        """Calibrate baseline (no contact)"""
        samples = []
        for _ in range(num_samples):
            samples.append(self.read_pressure_map())

        self.baseline = np.mean(samples, axis=0)

    def get_contact_pressure(self):
        """Get contact pressure map (baseline subtracted)"""
        current = self.read_pressure_map()
        if self.baseline is not None:
            return np.maximum(current - self.baseline, 0)
        return current

    def get_contact_center(self):
        """Get center of pressure (contact centroid)"""
        pressure = self.get_contact_pressure()
        total = pressure.sum()

        if total < 1e-6:
            return None

        rows, cols = np.indices(pressure.shape)
        center_row = (rows * pressure).sum() / total
        center_col = (cols * pressure).sum() / total

        return np.array([center_row, center_col])

    def get_contact_area(self, threshold=0.1):
        """Get contact area in taxels"""
        pressure = self.get_contact_pressure()
        contact_mask = pressure > threshold
        return np.sum(contact_mask)

    def detect_slip(self, previous_pressure, current_pressure, threshold=0.3):
        """Detect slip by pressure pattern change"""
        if previous_pressure is None:
            return False

        diff = np.abs(current_pressure - previous_pressure)
        change_ratio = diff.sum() / (previous_pressure.sum() + 1e-6)

        return change_ratio > threshold
```

## GelSight-Style Sensors

Vision-based tactile sensors using deformable gel:

```python
class GelSightSensor:
    """Vision-based tactile sensor processing"""

    def __init__(self, camera_id=0):
        import cv2
        self.cap = cv2.VideoCapture(camera_id)
        self.baseline_image = None

    def capture_image(self):
        """Capture tactile image"""
        ret, frame = self.cap.read()
        if ret:
            return frame
        return None

    def calibrate(self):
        """Capture baseline (no contact)"""
        self.baseline_image = self.capture_image()

    def get_contact_image(self):
        """Get difference image showing contact"""
        current = self.capture_image()
        if self.baseline_image is not None and current is not None:
            diff = cv2.absdiff(current, self.baseline_image)
            return diff
        return current

    def estimate_depth_map(self, contact_image):
        """Estimate depth from photometric stereo"""
        # Simplified: use intensity as proxy for depth
        gray = cv2.cvtColor(contact_image, cv2.COLOR_BGR2GRAY)
        depth = gray.astype(float) / 255.0

        return depth

    def detect_edges(self, contact_image):
        """Detect contact edges (object boundaries)"""
        gray = cv2.cvtColor(contact_image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        return edges

    def estimate_surface_normal(self, depth_map):
        """Estimate surface normals from depth"""
        # Compute gradients
        gx = cv2.Sobel(depth_map, cv2.CV_64F, 1, 0, ksize=3)
        gy = cv2.Sobel(depth_map, cv2.CV_64F, 0, 1, ksize=3)

        # Compute normals
        normal = np.dstack([-gx, -gy, np.ones_like(gx)])
        norm = np.linalg.norm(normal, axis=2, keepdims=True)
        normal = normal / (norm + 1e-6)

        return normal
```

## Slip Detection

Preventing objects from slipping during grasping:

```python
class SlipDetector:
    """Detect and prevent slip during grasping"""

    def __init__(self, tactile_sensor, ft_sensor=None):
        self.tactile = tactile_sensor
        self.ft_sensor = ft_sensor

        self.previous_pressure = None
        self.previous_center = None
        self.slip_threshold = 0.2

    def update(self):
        """Update slip detection state"""
        current_pressure = self.tactile.get_contact_pressure()
        current_center = self.tactile.get_contact_center()

        slip_detected = False
        slip_direction = None

        # Method 1: Pressure pattern change
        if self.previous_pressure is not None:
            pattern_change = np.abs(current_pressure - self.previous_pressure).sum()
            pattern_change /= (self.previous_pressure.sum() + 1e-6)

            if pattern_change > self.slip_threshold:
                slip_detected = True

        # Method 2: Center of pressure movement
        if self.previous_center is not None and current_center is not None:
            center_movement = np.linalg.norm(current_center - self.previous_center)

            if center_movement > 1.0:  # More than 1 taxel
                slip_detected = True
                slip_direction = current_center - self.previous_center

        # Method 3: Tangential force (if F/T sensor available)
        if self.ft_sensor is not None:
            reading = self.ft_sensor.read()
            tangential = np.linalg.norm(reading['force'][:2])
            normal = abs(reading['force'][2])

            friction_ratio = tangential / (normal + 1e-6)
            if friction_ratio > 0.5:  # Approaching friction cone limit
                slip_detected = True

        self.previous_pressure = current_pressure
        self.previous_center = current_center

        return {
            'slip_detected': slip_detected,
            'slip_direction': slip_direction,
            'current_pressure': current_pressure.sum()
        }


class GraspController:
    """Adaptive grasp control with slip prevention"""

    def __init__(self, gripper, slip_detector):
        self.gripper = gripper
        self.slip_detector = slip_detector

        self.min_force = 1.0
        self.max_force = 20.0
        self.current_force = 5.0

    def grasp_object(self):
        """Grasp with adaptive force control"""
        # Initial grasp
        self.gripper.close(force=self.current_force)

        # Wait for stable contact
        import time
        time.sleep(0.2)

        # Monitor and adjust
        while True:
            result = self.slip_detector.update()

            if result['slip_detected']:
                # Increase grip force
                self.current_force = min(
                    self.current_force * 1.2,
                    self.max_force
                )
                self.gripper.set_force(self.current_force)
                print(f"Slip detected, increasing force to {self.current_force:.1f}N")

            elif result['current_pressure'] > 0:
                # Stable grasp
                break

            time.sleep(0.05)

        return self.current_force

    def lift_object(self, height=0.1):
        """Lift object while monitoring slip"""
        lift_speed = 0.05  # m/s

        while self.gripper.position[2] < height:
            result = self.slip_detector.update()

            if result['slip_detected']:
                # Stop and increase force
                self.gripper.stop_motion()
                self.current_force = min(self.current_force * 1.2, self.max_force)
                self.gripper.set_force(self.current_force)
            else:
                # Continue lifting
                self.gripper.move_up(lift_speed)

            import time
            time.sleep(0.02)
```

## Texture Recognition

Recognize object textures through touch:

```python
class TextureClassifier:
    """Classify object textures using tactile data"""

    def __init__(self):
        import torch.nn as nn

        self.model = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Linear(128, 10)  # 10 texture classes
        )

        self.texture_names = [
            'smooth', 'rough', 'soft', 'hard',
            'bumpy', 'ridged', 'fuzzy', 'sticky',
            'slippery', 'metallic'
        ]

    def preprocess(self, pressure_map):
        """Preprocess tactile data for classification"""
        import torch

        # Normalize
        normalized = (pressure_map - pressure_map.min()) / (pressure_map.max() - pressure_map.min() + 1e-6)

        # Convert to tensor
        tensor = torch.FloatTensor(normalized).unsqueeze(0).unsqueeze(0)

        return tensor

    def classify(self, pressure_map):
        """Classify texture from pressure map"""
        import torch

        input_tensor = self.preprocess(pressure_map)

        with torch.no_grad():
            output = self.model(input_tensor)
            predicted = torch.argmax(output, dim=1).item()

        return {
            'texture': self.texture_names[predicted],
            'confidence': torch.softmax(output, dim=1)[0, predicted].item()
        }

    def explore_texture(self, tactile_sensor, num_samples=5):
        """Actively explore surface to classify texture"""
        samples = []

        for _ in range(num_samples):
            pressure = tactile_sensor.get_contact_pressure()
            samples.append(pressure)

            # Move slightly for different contact
            import time
            time.sleep(0.1)

        # Combine samples
        combined = np.mean(samples, axis=0)

        return self.classify(combined)
```

## Key Takeaways

:::tip Summary
- **Force/torque sensors** measure 6-DOF contact forces at the wrist
- **Tactile arrays** provide high-resolution pressure distribution
- **GelSight sensors** use vision for detailed tactile imaging
- **Slip detection** prevents objects from falling during manipulation
- **Force control** enables delicate, adaptive manipulation
- **Texture recognition** classifies materials through touch
:::

## Practice Exercises

1. **Force Control**: Implement force-controlled surface following.

2. **Slip Detection**: Build a slip detector using tactile or F/T data.

3. **Texture Classification**: Collect tactile data and train a texture classifier.

4. **Grasp Stability**: Implement adaptive grasping with slip prevention.

## Further Reading

- Dahiya et al. "Tactile Sensing: From Humans to Humanoids"
- Yuan et al. "GelSight: High-Resolution Robot Tactile Sensors"
- Johansson & Flanagan "Coding and use of tactile signals"
- DIGIT Tactile Sensor Documentation

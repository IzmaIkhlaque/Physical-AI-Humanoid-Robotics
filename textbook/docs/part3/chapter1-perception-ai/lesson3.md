---
sidebar_position: 3
title: Multi-Modal Sensor Fusion
description: Combining multiple sensors for robust robot perception
---

# Multi-Modal Sensor Fusion

## Learning Objectives

- Understand why sensor fusion is essential for robust perception
- Learn different fusion architectures and algorithms
- Implement Kalman filtering for state estimation
- Apply fusion techniques to robot localization and object tracking

## Why Sensor Fusion?

No single sensor is perfect. Each has strengths and weaknesses:

| Sensor | Strengths | Weaknesses |
|--------|-----------|------------|
| Camera | Rich appearance, cheap | No depth, lighting sensitive |
| LiDAR | Accurate depth, works in dark | No color, expensive |
| IMU | High frequency, works anywhere | Drifts over time |
| GPS | Global position | Poor indoors, low accuracy |
| Wheel Encoders | Simple, reliable | Slip causes errors |

**Sensor fusion** combines multiple sensors to overcome individual limitations and provide more robust, accurate perception.

## Fusion Architectures

### Early Fusion (Data Level)

Combine raw sensor data before processing:

```python
class EarlyFusionProcessor:
    """Fuse sensor data at the raw level"""

    def project_lidar_to_image(self, points_3d, camera_matrix, transform):
        """Project 3D LiDAR points onto 2D camera image"""
        # Transform points to camera frame
        points_cam = (transform @ np.hstack([
            points_3d, np.ones((len(points_3d), 1))
        ]).T).T[:, :3]

        # Filter points behind camera
        valid = points_cam[:, 2] > 0
        points_cam = points_cam[valid]

        # Project to image plane
        fx, fy = camera_matrix[0, 0], camera_matrix[1, 1]
        cx, cy = camera_matrix[0, 2], camera_matrix[1, 2]

        u = (fx * points_cam[:, 0] / points_cam[:, 2] + cx).astype(int)
        v = (fy * points_cam[:, 1] / points_cam[:, 2] + cy).astype(int)

        return u, v, points_cam[:, 2]

    def create_depth_image(self, points_3d, image_shape, camera_matrix, transform):
        """Create dense depth image from sparse LiDAR"""
        u, v, depths = self.project_lidar_to_image(
            points_3d, camera_matrix, transform
        )

        depth_image = np.zeros(image_shape[:2])
        h, w = image_shape[:2]
        valid = (u >= 0) & (u < w) & (v >= 0) & (v < h)
        depth_image[v[valid], u[valid]] = depths[valid]

        return depth_image
```

### Late Fusion (Decision Level)

Combine high-level outputs from independent pipelines:

```python
class LateFusionDetector:
    """Fuse detections from multiple sensors"""

    def __init__(self, iou_threshold=0.5):
        self.iou_threshold = iou_threshold

    def compute_iou_3d(self, box1, box2):
        """Compute 3D IoU between two bounding boxes"""
        x1, y1, z1, l1, w1, h1 = box1
        x2, y2, z2, l2, w2, h2 = box2

        x_overlap = max(0, min(x1 + l1/2, x2 + l2/2) - max(x1 - l1/2, x2 - l2/2))
        y_overlap = max(0, min(y1 + w1/2, y2 + w2/2) - max(y1 - w1/2, y2 - w2/2))
        z_overlap = max(0, min(z1 + h1/2, z2 + h2/2) - max(z1 - h1/2, z2 - h2/2))

        intersection = x_overlap * y_overlap * z_overlap
        vol1 = l1 * w1 * h1
        vol2 = l2 * w2 * h2
        union = vol1 + vol2 - intersection

        return intersection / union if union > 0 else 0

    def fuse_detections(self, camera_detections, lidar_detections):
        """Fuse detections from camera and LiDAR"""
        fused = []
        used_lidar = set()

        for cam_det in camera_detections:
            best_match = None
            best_iou = self.iou_threshold

            for i, lidar_det in enumerate(lidar_detections):
                if i in used_lidar:
                    continue

                iou = self.compute_iou_3d(cam_det['box_3d'], lidar_det['box_3d'])
                if iou > best_iou:
                    best_iou = iou
                    best_match = i

            if best_match is not None:
                lidar_det = lidar_detections[best_match]
                used_lidar.add(best_match)

                fused.append({
                    'class': cam_det['class'],
                    'confidence': (cam_det['confidence'] + lidar_det['confidence']) / 2,
                    'box_3d': lidar_det['box_3d'],
                    'source': 'fused'
                })
            else:
                fused.append({**cam_det, 'source': 'camera_only'})

        return fused
```

## Kalman Filter for State Estimation

The Kalman filter is the foundational algorithm for sensor fusion:

```python
class KalmanFilter:
    """Standard Kalman filter implementation"""

    def __init__(self, dim_x, dim_z):
        self.dim_x = dim_x
        self.dim_z = dim_z

        self.x = np.zeros((dim_x, 1))  # State estimate
        self.P = np.eye(dim_x)          # State covariance
        self.F = np.eye(dim_x)          # State transition
        self.H = np.zeros((dim_z, dim_x))  # Measurement matrix
        self.Q = np.eye(dim_x)          # Process noise
        self.R = np.eye(dim_z)          # Measurement noise

    def predict(self, u=None):
        """Predict step"""
        self.x = self.F @ self.x
        if u is not None:
            self.x += u
        self.P = self.F @ self.P @ self.F.T + self.Q
        return self.x.copy()

    def update(self, z):
        """Update step with measurement"""
        z = np.array(z).reshape(-1, 1)

        # Kalman gain
        S = self.H @ self.P @ self.H.T + self.R
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # State update
        y = z - self.H @ self.x
        self.x = self.x + K @ y

        # Covariance update
        I = np.eye(self.dim_x)
        self.P = (I - K @ self.H) @ self.P

        return self.x.copy()


class ObjectTracker:
    """Track objects using Kalman filter"""

    def __init__(self, dt=0.1):
        # State: [x, y, z, vx, vy, vz]
        self.kf = KalmanFilter(dim_x=6, dim_z=3)

        # Constant velocity model
        self.kf.F = np.array([
            [1, 0, 0, dt, 0, 0],
            [0, 1, 0, 0, dt, 0],
            [0, 0, 1, 0, 0, dt],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 1]
        ])

        # Observe position only
        self.kf.H = np.array([
            [1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0]
        ])

        self.kf.Q *= 0.01
        self.kf.R *= 0.1

    def initialize(self, position):
        self.kf.x[:3] = np.array(position).reshape(3, 1)

    def predict(self):
        return self.kf.predict()[:3].flatten()

    def update(self, measurement):
        return self.kf.update(measurement)[:3].flatten()
```

## Extended Kalman Filter

For non-linear systems:

```python
class ExtendedKalmanFilter:
    """EKF for non-linear state estimation"""

    def __init__(self, dim_x, dim_z, f, h, F_jacobian, H_jacobian):
        self.dim_x = dim_x
        self.dim_z = dim_z
        self.f = f  # State transition function
        self.h = h  # Measurement function
        self.F_jacobian = F_jacobian
        self.H_jacobian = H_jacobian

        self.x = np.zeros((dim_x, 1))
        self.P = np.eye(dim_x)
        self.Q = np.eye(dim_x) * 0.01
        self.R = np.eye(dim_z) * 0.1

    def predict(self, u=None):
        self.x = self.f(self.x, u)
        F = self.F_jacobian(self.x, u)
        self.P = F @ self.P @ F.T + self.Q
        return self.x.copy()

    def update(self, z):
        z = np.array(z).reshape(-1, 1)
        H = self.H_jacobian(self.x)

        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)

        y = z - self.h(self.x)
        self.x = self.x + K @ y

        I = np.eye(self.dim_x)
        self.P = (I - K @ H) @ self.P
        return self.x.copy()
```

## Robot Localization Example

```python
class RobotLocalization:
    """EKF-based robot localization"""

    def __init__(self, dt=0.1):
        self.dt = dt

        def f(x, u):
            if u is None:
                return x
            v, omega = u[0, 0], u[1, 0]
            theta = x[2, 0]

            if abs(omega) < 1e-6:
                dx = v * np.cos(theta) * dt
                dy = v * np.sin(theta) * dt
                dtheta = 0
            else:
                dx = -v/omega * np.sin(theta) + v/omega * np.sin(theta + omega*dt)
                dy = v/omega * np.cos(theta) - v/omega * np.cos(theta + omega*dt)
                dtheta = omega * dt

            return x + np.array([[dx], [dy], [dtheta]])

        def h(x):
            return x[:2]

        def F_jacobian(x, u):
            if u is None:
                return np.eye(3)
            v, omega = u[0, 0], u[1, 0]
            theta = x[2, 0]

            if abs(omega) < 1e-6:
                return np.array([
                    [1, 0, -v * np.sin(theta) * dt],
                    [0, 1, v * np.cos(theta) * dt],
                    [0, 0, 1]
                ])
            else:
                return np.array([
                    [1, 0, -v/omega * np.cos(theta) + v/omega * np.cos(theta + omega*dt)],
                    [0, 1, -v/omega * np.sin(theta) + v/omega * np.sin(theta + omega*dt)],
                    [0, 0, 1]
                ])

        def H_jacobian(x):
            return np.array([[1, 0, 0], [0, 1, 0]])

        self.ekf = ExtendedKalmanFilter(3, 2, f, h, F_jacobian, H_jacobian)

    def motion_update(self, v, omega):
        u = np.array([[v], [omega]])
        return self.ekf.predict(u)

    def measurement_update(self, observed_position):
        return self.ekf.update(observed_position)

    def get_pose(self):
        return self.ekf.x.flatten()
```

## Visual-Inertial Odometry

```python
class VisualInertialOdometry:
    """Fuse camera and IMU for odometry"""

    def __init__(self):
        self.state = np.zeros(9)  # [x, y, z, vx, vy, vz, roll, pitch, yaw]
        self.gravity = np.array([0, 0, -9.81])
        self.last_time = None

    def integrate_imu(self, accel, gyro, timestamp):
        if self.last_time is None:
            self.last_time = timestamp
            return

        dt = timestamp - self.last_time
        self.last_time = timestamp

        R = self._rotation_matrix(*self.state[6:9])
        accel_world = R @ accel + self.gravity

        self.state[3:6] += accel_world * dt
        self.state[0:3] += self.state[3:6] * dt
        self.state[6:9] += gyro * dt

    def update_visual(self, visual_position, visual_orientation):
        alpha = 0.95
        self.state[0:3] = alpha * self.state[0:3] + (1 - alpha) * visual_position
        self.state[6:9] = alpha * self.state[6:9] + (1 - alpha) * visual_orientation

    def _rotation_matrix(self, roll, pitch, yaw):
        cr, sr = np.cos(roll), np.sin(roll)
        cp, sp = np.cos(pitch), np.sin(pitch)
        cy, sy = np.cos(yaw), np.sin(yaw)

        return np.array([
            [cy*cp, cy*sp*sr - sy*cr, cy*sp*cr + sy*sr],
            [sy*cp, sy*sp*sr + cy*cr, sy*sp*cr - cy*sr],
            [-sp, cp*sr, cp*cr]
        ])
```

## Key Takeaways

:::tip Summary
- **Sensor fusion** combines multiple sensors to overcome individual limitations
- **Early fusion** combines raw data; **late fusion** combines decisions
- **Kalman filters** are the foundation of probabilistic sensor fusion
- **Extended Kalman Filter (EKF)** handles non-linear systems
- **Visual-inertial odometry** fuses cameras and IMUs for robust localization
- Proper **noise modeling** is critical for fusion quality
:::

## Practice Exercises

1. **Camera-LiDAR Calibration**: Calibrate camera and LiDAR for accurate projection.

2. **Object Tracking**: Implement multi-object tracking using Kalman filters.

3. **Robot Localization**: Build EKF-based localization with wheel encoders and landmarks.

4. **Fusion Comparison**: Compare early vs late fusion and measure accuracy improvements.

## Further Reading

- Thrun, S. "Probabilistic Robotics"
- Hartley & Zisserman "Multiple View Geometry"
- Qin et al. "VINS-Mono: Visual-Inertial State Estimator"
- NVIDIA Isaac SDK Sensor Fusion Documentation

---
sidebar_position: 1
title: Visual Perception Systems
description: Understanding how robots see and interpret the visual world
---

# Visual Perception Systems

## Learning Objectives

- Understand how cameras and vision sensors work in robotics
- Learn about image processing pipelines for robot vision
- Explore object detection and recognition techniques
- Implement basic computer vision algorithms for robots

## Introduction to Robot Vision

Vision is the most information-rich sense available to robots. A single camera can capture millions of pixels per frame, providing detailed information about the environment. Modern robots use sophisticated visual perception systems that combine multiple cameras, depth sensors, and AI algorithms.

### The Visual Perception Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Capture    │───▶│  Processing  │───▶│  Detection   │───▶│ Recognition  │
│   (Camera)   │    │  (Filters)   │    │  (Features)  │    │   (AI/ML)    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

## Camera Types for Robotics

Different applications require different camera types:

| Camera Type | Resolution | Use Case | Pros | Cons |
|-------------|------------|----------|------|------|
| RGB Camera | 1080p-4K | General vision | Color info, cheap | No depth |
| Depth Camera | 640x480 | 3D mapping | Direct depth | Limited range |
| Stereo Camera | Dual 720p | Outdoor robots | Passive sensing | Compute heavy |
| Event Camera | 1M events/s | High-speed motion | Low latency | Complex processing |
| Thermal Camera | 320x240 | Night vision | Works in dark | Expensive |

### RGB-D Cameras

RGB-D cameras combine color imaging with depth sensing. Popular options include:

- **Intel RealSense D435**: Stereo depth + RGB, great for indoor robotics
- **Microsoft Azure Kinect**: High-quality depth, used in research
- **Orbbec Astra**: Cost-effective option for consumer robotics

```python
import pyrealsense2 as rs
import numpy as np
import cv2

class RGBDCamera:
    """Interface for Intel RealSense depth camera"""

    def __init__(self):
        self.pipeline = rs.pipeline()
        self.config = rs.config()

        # Configure streams
        self.config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
        self.config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)

        # Start streaming
        self.pipeline.start(self.config)

        # Get camera intrinsics
        profile = self.pipeline.get_active_profile()
        depth_profile = rs.video_stream_profile(profile.get_stream(rs.stream.depth))
        self.intrinsics = depth_profile.get_intrinsics()

    def capture(self):
        """Capture RGB and depth frames"""
        frames = self.pipeline.wait_for_frames()

        depth_frame = frames.get_depth_frame()
        color_frame = frames.get_color_frame()

        depth_image = np.asanyarray(depth_frame.get_data())
        color_image = np.asanyarray(color_frame.get_data())

        return color_image, depth_image

    def pixel_to_3d(self, u, v, depth):
        """Convert pixel coordinates to 3D point"""
        point = rs.rs2_deproject_pixel_to_point(
            self.intrinsics, [u, v], depth
        )
        return np.array(point)
```

## Image Processing Fundamentals

Before AI can interpret images, they often need preprocessing:

### Color Space Conversion

```python
import cv2

def preprocess_image(image):
    """Standard preprocessing pipeline"""
    # Convert to different color spaces
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection
    edges = cv2.Canny(blurred, 50, 150)

    return {
        'gray': gray,
        'hsv': hsv,
        'edges': edges
    }
```

### Feature Detection

Traditional computer vision uses handcrafted features:

```python
def extract_features(image):
    """Extract SIFT features from image"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # SIFT detector
    sift = cv2.SIFT_create()
    keypoints, descriptors = sift.detectAndCompute(gray, None)

    # ORB is faster alternative
    orb = cv2.ORB_create()
    kp_orb, desc_orb = orb.detectAndCompute(gray, None)

    return {
        'sift': (keypoints, descriptors),
        'orb': (kp_orb, desc_orb)
    }
```

## Deep Learning for Robot Vision

Modern robots use deep neural networks for perception:

### Convolutional Neural Networks (CNNs)

CNNs are the backbone of visual AI:

```python
import torch
import torch.nn as nn
import torchvision.models as models

class RobotVisionCNN(nn.Module):
    """CNN for robot visual perception"""

    def __init__(self, num_classes=10):
        super().__init__()

        # Use pretrained ResNet as backbone
        self.backbone = models.resnet50(pretrained=True)

        # Replace classifier for our task
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.backbone(x)

    def extract_features(self, x):
        """Get intermediate features for other tasks"""
        # Remove final classification layer
        modules = list(self.backbone.children())[:-1]
        feature_extractor = nn.Sequential(*modules)
        return feature_extractor(x)
```

### Object Detection with YOLO

YOLO (You Only Look Once) is popular for real-time object detection:

```python
from ultralytics import YOLO

class ObjectDetector:
    """Real-time object detection for robots"""

    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)
        self.confidence_threshold = 0.5

    def detect(self, image):
        """Detect objects in image"""
        results = self.model(image)

        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                if box.conf > self.confidence_threshold:
                    detections.append({
                        'class': result.names[int(box.cls)],
                        'confidence': float(box.conf),
                        'bbox': box.xyxy[0].tolist(),  # [x1, y1, x2, y2]
                        'center': box.xywh[0].tolist()[:2]  # [cx, cy]
                    })

        return detections

    def detect_for_grasping(self, image, target_class):
        """Find specific objects for robot manipulation"""
        detections = self.detect(image)
        targets = [d for d in detections if d['class'] == target_class]

        # Return the most confident detection
        if targets:
            return max(targets, key=lambda x: x['confidence'])
        return None
```

## Semantic Segmentation

Segmentation assigns a class to every pixel:

```python
class SemanticSegmenter:
    """Pixel-wise scene understanding"""

    def __init__(self):
        from transformers import SegformerForSemanticSegmentation
        from transformers import SegformerImageProcessor

        self.processor = SegformerImageProcessor.from_pretrained(
            "nvidia/segformer-b0-finetuned-ade-512-512"
        )
        self.model = SegformerForSemanticSegmentation.from_pretrained(
            "nvidia/segformer-b0-finetuned-ade-512-512"
        )

    def segment(self, image):
        """Get semantic segmentation mask"""
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)

        # Get class predictions for each pixel
        logits = outputs.logits
        segmentation = logits.argmax(dim=1)[0]

        return segmentation.numpy()

    def find_navigable_area(self, image):
        """Find floor/ground for navigation"""
        segmentation = self.segment(image)

        # Common floor class IDs (dataset-dependent)
        floor_classes = [3, 4, 28]  # floor, ground, carpet

        navigable_mask = np.isin(segmentation, floor_classes)
        return navigable_mask
```

## Practical Application: Visual Servoing

Visual servoing uses vision to control robot motion:

```python
class VisualServoController:
    """Control robot based on visual feedback"""

    def __init__(self, camera, detector):
        self.camera = camera
        self.detector = detector

        # PID gains for visual servoing
        self.kp = 0.001  # Proportional
        self.ki = 0.0001  # Integral
        self.kd = 0.0005  # Derivative

        self.error_integral = np.zeros(2)
        self.last_error = np.zeros(2)

    def compute_velocity(self, target_class, image_center):
        """Compute velocity to center object in view"""
        image, _ = self.camera.capture()
        detection = self.detector.detect_for_grasping(image, target_class)

        if detection is None:
            return np.zeros(2), False  # No target found

        # Error is distance from object center to image center
        object_center = np.array(detection['center'])
        error = object_center - image_center

        # PID control
        self.error_integral += error
        error_derivative = error - self.last_error
        self.last_error = error

        velocity = (
            self.kp * error +
            self.ki * self.error_integral +
            self.kd * error_derivative
        )

        return velocity, True
```

## Key Takeaways

:::tip Summary
- **Vision sensors** range from simple RGB cameras to complex RGB-D and event cameras
- **Image preprocessing** (filtering, edge detection) prepares images for AI
- **CNNs** are the foundation of modern visual perception in robots
- **Object detection** (YOLO) enables robots to find and locate objects
- **Semantic segmentation** provides pixel-level scene understanding
- **Visual servoing** closes the loop between vision and robot control
:::

## Practice Exercises

1. **Camera Calibration**: Set up an RGB-D camera and calibrate it. Measure the accuracy of depth readings at different distances.

2. **Object Detection**: Train a YOLO model on a custom dataset of objects you want your robot to manipulate.

3. **Visual Servoing**: Implement a simple visual servo controller that moves a robot arm to center an object in the camera view.

4. **Performance Analysis**: Compare the inference speed of different object detection models (YOLO, SSD, Faster R-CNN) on your target hardware.

## Further Reading

- Szeliski, R. "Computer Vision: Algorithms and Applications"
- Corke, P. "Robotics, Vision and Control"
- NVIDIA Isaac ROS Documentation
- OpenCV Tutorials for Python

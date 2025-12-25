---
sidebar_position: 1
title: بصری ادراک کے نظام
description: سمجھنا کہ روبوٹس کیسے دیکھتے اور بصری دنیا کی تشریح کرتے ہیں
---

# بصری ادراک کے نظام

## سیکھنے کے مقاصد

- سمجھنا کہ روبوٹکس میں کیمرے اور وژن سینسرز کیسے کام کرتے ہیں
- روبوٹ وژن کے لیے امیج پروسیسنگ پائپ لائنز کے بارے میں سیکھنا
- آبجیکٹ کا پتہ لگانے اور شناخت کی تکنیکوں کو تلاش کرنا
- روبوٹس کے لیے بنیادی کمپیوٹر ویژن الگورتھم نافذ کرنا

## روبوٹ وژن کا تعارف

وژن روبوٹس کے لیے دستیاب سب سے زیادہ معلومات سے بھرپور حس ہے۔ ایک کیمرہ فی فریم لاکھوں پکسلز کو کیپچر کر سکتا ہے، ماحول کے بارے میں تفصیلی معلومات فراہم کرتا ہے۔ جدید روبوٹس نفیس بصری ادراک کے نظام استعمال کرتے ہیں جو متعدد کیمروں، ڈیپتھ سینسرز، اور AI الگورتھمز کو جوڑتے ہیں۔

### بصری ادراک پائپ لائن

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Capture    │───▶│  Processing  │───▶│  Detection   │───▶│ Recognition  │
│   (Camera)   │    │  (Filters)   │    │  (Features)  │    │   (AI/ML)    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

## روبوٹکس کے لیے کیمرہ کی اقسام

مختلف ایپلی کیشنز مختلف قسم کے کیمروں کی ضرورت ہوتی ہیں:

| Camera Type | Resolution | Use Case | Pros | Cons |
|-------------|------------|----------|------|------|
| RGB Camera | 1080p-4K | General vision | Color info, cheap | No depth |
| Depth Camera | 640x480 | 3D mapping | Direct depth | Limited range |
| Stereo Camera | Dual 720p | Outdoor robots | Passive sensing | Compute heavy |
| Event Camera | 1M events/s | High-speed motion | Low latency | Complex processing |
| Thermal Camera | 320x240 | Night vision | Works in dark | Expensive |

### RGB-D کیمرے

RGB-D کیمرے رنگین امیجنگ کو ڈیپتھ سینسنگ کے ساتھ جوڑتے ہیں۔ مقبول اختیارات میں شامل ہیں:

- **Intel RealSense D435**: Stereo depth + RGB، اندرونی روبوٹکس کے لیے بہترین
- **Microsoft Azure Kinect**: اعلیٰ معیار کی depth، تحقیق میں استعمال ہوتا ہے
- **Orbbec Astra**: صارفین کے روبوٹکس کے لیے سرمایہ کاری مؤثر اختیار

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

## امیج پروسیسنگ کی بنیادیں

AI تصاویر کی تشریح کر سکے اس سے پہلے، انہیں اکثر پری پروسیسنگ کی ضرورت ہوتی ہے:

### کلر سپیس تبدیلی

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

### فیچر کا پتہ لگانا

روایتی کمپیوٹر ویژن ہاتھ سے بنائے گئے فیچرز استعمال کرتا ہے:

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

## روبوٹ وژن کے لیے ڈیپ لرننگ

جدید روبوٹس ادراک کے لیے ڈیپ نیورل نیٹ ورکس استعمال کرتے ہیں:

### Convolutional Neural Networks (CNNs)

CNNs بصری AI کی ریڑھ کی ہڈی ہیں:

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

### YOLO کے ساتھ آبجیکٹ کا پتہ لگانا

YOLO (You Only Look Once) حقیقی وقت میں آبجیکٹ کا پتہ لگانے کے لیے مقبول ہے:

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

تقسیم ہر پکسل کو ایک کلاس تفویض کرتی ہے:

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

## عملی ایپلیکیشن: Visual Servoing

Visual servoing روبوٹ کی حرکت کو کنٹرول کرنے کے لیے وژن استعمال کرتا ہے:

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

## اہم نکات

:::tip خلاصہ
- **وژن سینسرز** سادہ RGB کیمروں سے لے کر پیچیدہ RGB-D اور ایونٹ کیمروں تک ہوتے ہیں
- **امیج پری پروسیسنگ** (فلٹرنگ، ایج ڈیٹیکشن) AI کے لیے تصاویر تیار کرتی ہے
- **CNNs** روبوٹس میں جدید بصری ادراک کی بنیاد ہیں
- **آبجیکٹ ڈیٹیکشن** (YOLO) روبوٹس کو اشیاء تلاش کرنے اور ان کا محل وقوع معلوم کرنے کے قابل بناتا ہے
- **Semantic segmentation** پکسل کی سطح پر منظر کی سمجھ فراہم کرتا ہے
- **Visual servoing** وژن اور روبوٹ کنٹرول کے درمیان لوپ بند کرتا ہے
:::

## مشق کی مشقیں

1. **کیمرہ کیلیبریشن**: ایک RGB-D کیمرہ سیٹ اپ کریں اور اسے کیلیبریٹ کریں۔ مختلف فاصلوں پر ڈیپتھ ریڈنگز کی درستگی کی پیمائش کریں۔

2. **آبجیکٹ ڈیٹیکشن**: ان اشیاء کے کسٹم ڈیٹاسیٹ پر YOLO ماڈل کو تربیت دیں جنہیں آپ اپنے روبوٹ سے ہیرا پھیری کرنا چاہتے ہیں۔

3. **Visual Servoing**: ایک سادہ visual servo کنٹرولر نافذ کریں جو کیمرہ کے نظارے میں آبجیکٹ کو مرکز میں لانے کے لیے روبوٹ آرم کو منتقل کرے۔

4. **کارکردگی کا تجزیہ**: اپنے ہدف ہارڈ ویئر پر مختلف آبجیکٹ ڈیٹیکشن ماڈلز (YOLO, SSD, Faster R-CNN) کی inference کی رفتار کا موازنہ کریں۔

## مزید مطالعہ

- Szeliski, R. "Computer Vision: Algorithms and Applications"
- Corke, P. "Robotics, Vision and Control"
- NVIDIA Isaac ROS Documentation
- OpenCV Tutorials for Python

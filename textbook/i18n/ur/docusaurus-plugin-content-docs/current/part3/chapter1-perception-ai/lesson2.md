---
sidebar_position: 2
title: 3D ادراک اور Point Clouds
description: LiDAR اور ڈیپتھ سینسرز کے ذریعے مقامی ادراک کو سمجھنا
---

# 3D ادراک اور Point Clouds

## سیکھنے کے مقاصد

- LiDAR ٹیکنالوجی کو سمجھنا اور یہ کیسے 3D نقشے بناتی ہے
- Point cloud ڈیٹا کو پروسیس اور فلٹر کرنا سیکھنا
- Point cloud سیگمنٹیشن اور آبجیکٹ ڈیٹیکشن نافذ کرنا
- روبوٹ نیویگیشن اور ہیرا پھیری میں 3D ادراک کا اطلاق کرنا

## 3D سینسنگ کا تعارف

جبکہ 2D تصاویر رنگ اور بناوٹ میں بھرپور ہوتی ہیں، ان میں براہ راست ڈیپتھ کی معلومات کی کمی ہوتی ہے۔ 3D سینسرز جیسے LiDAR، structured light، اور time-of-flight کیمرے 3D دنیا کی واضح پیمائش فراہم کرتے ہیں۔

### 3D سینسر کا موازنہ

| سینسر کی قسم | رینج | درستگی | رفتار | لاگت | بہترین استعمال |
|-------------|-------|----------|-------|------|----------|
| LiDAR | 100+ m | 2-3 cm | 10-20 Hz | $$$ | بیرونی نیویگیشن |
| Structured Light | 0.5-5 m | 1-2 mm | 30 Hz | $$ | اندرونی ہیرا پھیری |
| Time-of-Flight | 0.5-10 m | 1-2 cm | 30+ Hz | $$ | عمومی مقصد |
| Stereo Vision | 0.5-50 m | متغیر | 30+ Hz | $ | Passive سینسنگ |

## Point Cloud کی بنیادیں

Point cloud 3D نقاط کا ایک مجموعہ ہے، ہر ایک میں coordinates (x, y, z) اور اختیاری طور پر رنگ (r, g, b) یا شدت ہوتی ہے۔

```python
import numpy as np
import open3d as o3d

class PointCloudProcessor:
    """Basic point cloud processing operations"""

    def __init__(self):
        self.cloud = None

    def load_from_array(self, points, colors=None):
        """Create point cloud from numpy arrays"""
        self.cloud = o3d.geometry.PointCloud()
        self.cloud.points = o3d.utility.Vector3dVector(points)

        if colors is not None:
            self.cloud.colors = o3d.utility.Vector3dVector(colors)

        return self.cloud

    def load_from_file(self, filepath):
        """Load point cloud from PCD or PLY file"""
        self.cloud = o3d.io.read_point_cloud(filepath)
        return self.cloud

    def get_statistics(self):
        """Get basic statistics about the point cloud"""
        points = np.asarray(self.cloud.points)

        return {
            'num_points': len(points),
            'centroid': points.mean(axis=0),
            'min_bound': points.min(axis=0),
            'max_bound': points.max(axis=0),
            'std': points.std(axis=0)
        }
```

### ڈیپتھ امیج سے Point Cloud

```python
def depth_to_pointcloud(depth_image, intrinsics, color_image=None):
    """Convert depth image to point cloud"""
    height, width = depth_image.shape

    # Create meshgrid of pixel coordinates
    u = np.arange(width)
    v = np.arange(height)
    u, v = np.meshgrid(u, v)

    # Unproject to 3D
    fx, fy = intrinsics['fx'], intrinsics['fy']
    cx, cy = intrinsics['cx'], intrinsics['cy']

    z = depth_image / 1000.0  # Convert mm to meters
    x = (u - cx) * z / fx
    y = (v - cy) * z / fy

    # Stack into Nx3 array
    points = np.stack([x, y, z], axis=-1).reshape(-1, 3)

    # Remove invalid points (zero depth)
    valid = points[:, 2] > 0
    points = points[valid]

    # Add colors if available
    colors = None
    if color_image is not None:
        colors = color_image.reshape(-1, 3)[valid] / 255.0

    return points, colors
```

## Point Cloud فلٹرنگ

خام point clouds میں اکثر شور ہوتا ہے جسے فلٹر کرنا ضروری ہے:

### شماریاتی Outlier ہٹانا

```python
def remove_outliers(cloud, nb_neighbors=20, std_ratio=2.0):
    """Remove statistical outliers from point cloud"""
    cl, ind = cloud.remove_statistical_outlier(
        nb_neighbors=nb_neighbors,
        std_ratio=std_ratio
    )
    return cl

def remove_radius_outliers(cloud, nb_points=16, radius=0.05):
    """Remove points with few neighbors"""
    cl, ind = cloud.remove_radius_outlier(
        nb_points=nb_points,
        radius=radius
    )
    return cl
```

### Downsampling (کثافت کم کرنا)

```python
def downsample_voxel(cloud, voxel_size=0.01):
    """Reduce point cloud density using voxel grid"""
    downsampled = cloud.voxel_down_sample(voxel_size=voxel_size)
    return downsampled

def downsample_uniform(cloud, every_k_points=5):
    """Keep every k-th point"""
    downsampled = cloud.uniform_down_sample(every_k_points)
    return downsampled
```

## سطح کے Normal کا تخمینہ

Normals سطح کی سمت کو سمجھنے کے لیے ضروری ہیں:

```python
def estimate_normals(cloud, radius=0.1, max_nn=30):
    """Estimate surface normals for each point"""
    cloud.estimate_normals(
        search_param=o3d.geometry.KDTreeSearchParamHybrid(
            radius=radius,
            max_nn=max_nn
        )
    )

    # Orient normals consistently
    cloud.orient_normals_consistent_tangent_plane(k=15)

    return cloud
```

## Plane Segmentation (RANSAC)

فرش، دیواروں، اور میزوں کو سمجھنے کے لیے planes تلاش کرنا اہم ہے:

```python
class PlaneSegmenter:
    """Segment planes from point clouds using RANSAC"""

    def __init__(self, distance_threshold=0.01, ransac_n=3, num_iterations=1000):
        self.distance_threshold = distance_threshold
        self.ransac_n = ransac_n
        self.num_iterations = num_iterations

    def segment_plane(self, cloud):
        """Find the dominant plane in the point cloud"""
        plane_model, inliers = cloud.segment_plane(
            distance_threshold=self.distance_threshold,
            ransac_n=self.ransac_n,
            num_iterations=self.num_iterations
        )

        # plane_model: [a, b, c, d] for ax + by + cz + d = 0
        a, b, c, d = plane_model

        # Separate plane and non-plane points
        plane_cloud = cloud.select_by_index(inliers)
        remaining_cloud = cloud.select_by_index(inliers, invert=True)

        return {
            'plane_model': plane_model,
            'normal': np.array([a, b, c]),
            'plane_cloud': plane_cloud,
            'remaining_cloud': remaining_cloud,
            'num_inliers': len(inliers)
        }

    def find_ground_plane(self, cloud, up_vector=np.array([0, 0, 1])):
        """Find the ground plane (horizontal plane at lowest height)"""
        planes = self.segment_multiple_planes(cloud, max_planes=3)

        ground_candidates = []
        for plane in planes:
            normal = plane['normal']
            angle = np.arccos(np.abs(np.dot(normal, up_vector)))

            if angle < np.radians(15):  # Within 15 degrees of horizontal
                points = np.asarray(plane['plane_cloud'].points)
                height = points[:, 2].mean()
                ground_candidates.append((height, plane))

        if ground_candidates:
            ground_candidates.sort(key=lambda x: x[0])
            return ground_candidates[0][1]

        return None
```

## Point Cloud کلسٹرنگ

نقاط کو انفرادی اشیاء میں cluster کریں:

```python
class PointCloudClusterer:
    """Cluster point clouds into objects"""

    def cluster_dbscan(self, cloud, eps=0.02, min_points=10):
        """DBSCAN clustering for point clouds"""
        labels = np.array(cloud.cluster_dbscan(
            eps=eps,
            min_points=min_points,
            print_progress=False
        ))

        unique_labels = set(labels)
        unique_labels.discard(-1)

        clusters = []
        for label in unique_labels:
            cluster_indices = np.where(labels == label)[0]
            cluster_cloud = cloud.select_by_index(cluster_indices)

            clusters.append({
                'label': label,
                'cloud': cluster_cloud,
                'num_points': len(cluster_indices),
                'centroid': np.asarray(cluster_cloud.points).mean(axis=0)
            })

        return clusters

    def segment_objects_on_table(self, cloud, table_height_threshold=0.02):
        """Segment objects above a table surface"""
        segmenter = PlaneSegmenter()
        ground_result = segmenter.find_ground_plane(cloud)

        if ground_result is None:
            return []

        table_plane = ground_result['plane_model']
        remaining = ground_result['remaining_cloud']

        points = np.asarray(remaining.points)
        a, b, c, d = table_plane

        distances = (a * points[:, 0] + b * points[:, 1] +
                    c * points[:, 2] + d) / np.sqrt(a**2 + b**2 + c**2)

        above_table = distances > table_height_threshold
        above_indices = np.where(above_table)[0]
        objects_cloud = remaining.select_by_index(above_indices.tolist())

        clusters = self.cluster_dbscan(objects_cloud)

        return clusters
```

## PointNet کے ساتھ 3D آبجیکٹ ڈیٹیکشن

```python
import torch
import torch.nn as nn

class PointNet(nn.Module):
    """PointNet architecture for 3D object classification"""

    def __init__(self, num_classes=10):
        super().__init__()

        # Shared MLP layers
        self.conv1 = nn.Conv1d(3, 64, 1)
        self.conv2 = nn.Conv1d(64, 128, 1)
        self.conv3 = nn.Conv1d(128, 1024, 1)

        # Classification head
        self.fc1 = nn.Linear(1024, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, num_classes)

        self.bn1 = nn.BatchNorm1d(64)
        self.bn2 = nn.BatchNorm1d(128)
        self.bn3 = nn.BatchNorm1d(1024)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        # x: (B, N, 3) -> (B, 3, N)
        x = x.transpose(1, 2)

        # Point features
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.relu(self.bn2(self.conv2(x)))
        x = self.relu(self.bn3(self.conv3(x)))

        # Global feature via max pooling
        x = torch.max(x, 2)[0]

        # Classification
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)

        return x
```

## نیویگیشن کے لیے LiDAR

```python
class LiDARNavigator:
    """Use LiDAR for robot navigation"""

    def __init__(self, safety_distance=0.5):
        self.safety_distance = safety_distance
        self.segmenter = PlaneSegmenter()
        self.clusterer = PointCloudClusterer()

    def detect_obstacles(self, cloud, robot_position=np.zeros(3)):
        """Detect obstacles around the robot"""
        ground = self.segmenter.find_ground_plane(cloud)
        if ground:
            cloud = ground['remaining_cloud']

        clusters = self.clusterer.cluster_dbscan(cloud, eps=0.3, min_points=20)

        obstacles = []
        for cluster in clusters:
            centroid = cluster['centroid']
            distance = np.linalg.norm(centroid - robot_position)

            points = np.asarray(cluster['cloud'].points)
            min_bound = points.min(axis=0)
            max_bound = points.max(axis=0)

            obstacles.append({
                'centroid': centroid,
                'distance': distance,
                'bounds': (min_bound, max_bound),
                'dangerous': distance < self.safety_distance
            })

        return sorted(obstacles, key=lambda x: x['distance'])
```

## اہم نکات

:::tip خلاصہ
- **LiDAR اور ڈیپتھ کیمرے** ماحول کی براہ راست 3D پیمائش فراہم کرتے ہیں
- **Point cloud پروسیسنگ** میں فلٹرنگ، downsampling، اور normal کا تخمینہ شامل ہے
- **RANSAC plane segmentation** فرش، دیواریں، اور میزیں تلاش کرتا ہے
- **کلسٹرنگ الگورتھم** (DBSCAN) انفرادی اشیاء کو الگ کرتے ہیں
- **PointNet** point cloud ڈیٹا پر براہ راست ڈیپ لرننگ کو ممکن بناتا ہے
- **3D ادراک** نیویگیشن اور ہیرا پھیری کے لیے ضروری ہے
:::

## مشق کی مشقیں

1. **ڈیپتھ سے Point Cloud**: ڈیپتھ امیجز کیپچر کریں اور انہیں رنگین point clouds میں تبدیل کریں۔

2. **ٹیبل ٹاپ سیگمنٹیشن**: میز پر موجود اشیاء کو segment کریں اور ان کے bounding boxes کا حساب لگائیں۔

3. **رکاوٹوں کا پتہ لگانا**: LiDAR ڈیٹا استعمال کرتے ہوئے ایک حقیقی وقت کا رکاوٹ detector بنائیں۔

4. **3D آبجیکٹ کی شناخت**: آبجیکٹ کی شناخت کے لیے ModelNet40 ڈیٹاسیٹ پر PointNet کو تربیت دیں۔

## مزید مطالعہ

- Open3D Documentation and Tutorials
- Qi et al. "PointNet: Deep Learning on Point Sets"
- Rusu & Cousins "3D is here: Point Cloud Library (PCL)"
- KITTI Vision Benchmark Suite

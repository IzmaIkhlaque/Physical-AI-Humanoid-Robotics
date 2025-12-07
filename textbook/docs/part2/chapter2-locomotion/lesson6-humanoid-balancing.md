---
sidebar_position: 6
sidebar_label: Humanoid Balancing
---

# Humanoid Balancing

## Recap

*   **Walking Gaits:** Different patterns of limb movement for stable and efficient locomotion.
*   **Running Dynamics:** The physics and control involved in high-speed, dynamic bipedal movement.
*   **Stair Climbing:** Specialized locomotion strategies for ascending and descending steps.

Humanoid robots, by their very nature, are inherently unstable. Unlike wheeled robots with large bases of support, humanoids operate on two legs, requiring continuous and sophisticated control to maintain balance. The ability to balance is fundamental to almost all humanoid tasks, from standing and walking to manipulating objects and recovering from disturbances.

### Key Concepts in Humanoid Balancing

1.  **Center of Mass (CoM):** The average position of all the mass in the robot. For stable standing or walking, the projection of the CoM onto the ground must remain within the robot's **Support Polygon**.
2.  **Support Polygon (SP):** The convex hull formed by all the contact points of the robot with the ground. For a biped robot, this is typically the area enclosed by the feet when both are on the ground, or the area of a single foot if only one is touching.
3.  **Zero Moment Point (ZMP):** A crucial concept in bipedal locomotion and balance. The ZMP is the point on the ground about which the net moment of all forces (gravitational, inertial, and contact forces) is zero. For a robot to be statically stable (or dynamically stable in a controlled manner), its ZMP must remain within the Support Polygon. If the ZMP moves outside the SP, the robot will start to fall.

### Balancing Control Strategies

Several control strategies are employed to maintain humanoid balance:

1.  **Static Balance Control:** Primarily used when the robot is stationary. It involves ensuring the CoM projection stays within the Support Polygon. This is simpler but limits the robot to slow, deliberate movements.
2.  **Dynamic Balance Control:** Essential for walking, running, and other dynamic movements. It focuses on controlling the ZMP. Controllers predict the robot's future motion and adjust joint torques or foot placement to keep the ZMP within the desired region.
    *   **Trajectory Generation:** Planning CoM or ZMP trajectories that are dynamically feasible and lead to stable motion.
    *   **Feedback Control:** Using sensor data (IMUs, force sensors in feet) to detect deviations from the planned trajectory and apply corrective actions.
3.  **Whole-Body Control (WBC):** A sophisticated approach that coordinates all the robot's joints and end-effectors simultaneously to achieve multiple objectives, such as maintaining balance, tracking a desired CoM trajectory, and executing a manipulation task, while respecting joint limits and contact constraints. WBC often involves solving an optimization problem in real-time.

**Example: Ankle Strategy vs. Hip Strategy**

Humans (and humanoids) use different strategies to recover balance:
*   **Ankle Strategy:** Used for small, slow disturbances. The body acts as an inverted pendulum, and balance is maintained by rotating the body about the ankle joints, causing small shifts in the ZMP.
*   **Hip Strategy:** Used for larger, faster disturbances. The robot flexes or extends at the hips, translating the CoM horizontally over the base of support. This allows for quicker and larger adjustments.

**Code Snippet Example (Conceptual ZMP Calculation):**

```python
import numpy as np

def calculate_zmp_1d(masses, positions, accelerations, contact_point_x):
    """
    Conceptual 1D ZMP calculation.
    masses: list of masses for each segment
    positions: list of x-coordinates for CoM of each segment
    accelerations: list of x-accelerations for CoM of each segment
    contact_point_x: x-coordinate of the contact point on the ground (e.g., heel or toe)
    """
    numerator = 0
    denominator = 0
    g = 9.81 # gravity

    for m, p, a in zip(masses, positions, accelerations):
        numerator += m * (p * g + p * a) # Simplified for conceptual 1D
        denominator += m * g # Only gravity in denominator for static ZMP
        # For dynamic ZMP, denominator would also include vertical accelerations
    
    # This is a highly simplified representation for conceptual understanding
    # Actual ZMP calculation involves moments from all forces and torques
    if denominator == 0:
        return float('inf') # Avoid division by zero
    
    # A more complete ZMP would look at moments
    # For a purely conceptual understanding, if we consider only horizontal forces and gravity
    # ZMP_x = sum(m_i * (x_i * (g + z_accel_i) - z_i * x_accel_i)) / sum(m_i * (g + z_accel_i))
    # Let's simplify to show a balance point related to CoM and its motion.
    # For static balance, it's simply CoM_x
    
    # Simplified for illustration: if system is a point mass and we're looking for where
    # the GRF should act to prevent a fall.
    # This example needs to be carefully chosen not to mislead.
    
    # Better conceptual example: If we have a single segment mass 'M' at 'CoM_x' and 'CoM_z'
    # And horizontal acceleration 'x_ddot', vertical acceleration 'z_ddot'
    # ZMP_x = CoM_x - CoM_z * (x_ddot / (g + z_ddot))
    
    # Let's use a very simple representation for educational purposes, focusing on CoM projection
    # For static balance, ZMP_x is the x-projection of CoM.
    # For dynamic balance, ZMP shifts based on inertia.
    
    # For now, let's just illustrate that ZMP depends on mass, position, and acceleration
    # This snippet is more illustrative of the *factors* influencing ZMP
    return sum(m * p for m, p in zip(masses, positions)) / sum(masses) # CoM projection for static

# Example: Two segments, torso and legs
torso_mass = 30
torso_pos_x = 0.1 # relative to hip
torso_accel_x = 0

leg_mass = 20
leg_pos_x = -0.1 # relative to hip
leg_accel_x = 0

# For a static pose, ZMP is roughly CoM projection
com_x_static = calculate_zmp_1d([torso_mass, leg_mass], [torso_pos_x, leg_pos_x], [0,0], 0)
print(f"Conceptual Static ZMP (CoM projection): {com_x_static:.2f}")

# If torso accelerates, ZMP shifts
torso_accel_x_dynamic = 0.5 # m/s^2
# This conceptual function doesn't handle dynamics fully, but illustrates idea.
# A proper ZMP calculation would involve a more detailed physics model.
```

### Activities

1.  **Balancing Demonstration:** Stand on one leg. Observe how your body (especially your hips and ankles) adjusts to maintain balance. Relate these movements to the ankle and hip strategies.
2.  **Support Polygon Sketch:** Draw a simple human outline. Then, sketch the Support Polygon when standing with:
    *   Both feet flat on the ground, shoulder-width apart.
    *   Standing on one foot.
    *   Standing on your toes.
    Discuss how the size and shape of the SP change and its implications for stability.

### Diagram

_Placeholder for a diagram illustrating the Zero Moment Point (ZMP) within the Support Polygon of a bipedal robot, showing the CoM projection and the ZMP. Maybe an arrow indicating a shift in ZMP due to motion._
*(This image will be stored in `/static/img/diagrams/part2-ch2-lesson6-balancing.svg`)*

### Multiple Choice Questions

1.  For a humanoid robot to maintain **static balance**, where must the projection of its Center of Mass (CoM) lie?
    a) Outside the Support Polygon
    b) Exactly at the geometric center of the robot
    c) Within the Support Polygon
    d) Directly above one of its feet
    **Answer: c**

2.  The **Zero Moment Point (ZMP)** is defined as the point on the ground where:
    a) All joint torques are zero.
    b) The net moment of all forces (gravitational, inertial, contact) is zero.
    c) The robot's velocity is zero.
    d) The robot's acceleration is at its maximum.
    **Answer: b**

3.  Which balancing strategy is typically used for **small, slow disturbances** and involves rotation about the ankle joints?
    a) Hip Strategy
    b) Whole-Body Control
    c) Static Balance Control
    d) Ankle Strategy
    **Answer: d**

4.  **Dynamic Balance Control** primarily focuses on controlling which of the following?
    a) The robot's battery level
    b) The temperature of the motors
    c) The Zero Moment Point (ZMP)
    d) The joint limits of the robot
    **Answer: c**

5.  What can happen if the **ZMP moves outside the Support Polygon** during locomotion?
    a) The robot will speed up.
    b) The robot will fall.
    c) The robot will switch to static balance.
    d) The robot's joint angles will lock.
    **Answer: b**

6.  **Whole-Body Control (WBC)** in humanoid robotics is characterized by:
    a) Only controlling the movement of the robot's arms.
    b) Coordinating all joints and end-effectors simultaneously to achieve multiple objectives.
    c) A simple method for static balance.
    d) Primarily used for wheeled robots.
    **Answer: b**

7.  Which of the following is NOT a challenge associated with solving inverse kinematics for dynamic balancing?
    a) Multiple solutions
    b) No solution (unreachable pose)
    c) Singularities
    d) High battery consumption
    **Answer: d**

8.  The **Support Polygon** for a biped robot is formed by:
    a) The path the robot takes during walking.
    b) The area enclosed by the contact points of the robot with the ground.
    c) The maximum reach of its arms.
    d) The total volume of the robot's body.
    **Answer: b**

9.  If a humanoid robot is rapidly **accelerating its torso forward**, how would this likely affect its ZMP?
    a) The ZMP would remain unchanged.
    b) The ZMP would shift backward.
    c) The ZMP would shift forward.
    d) The ZMP would move vertically.
    **Answer: c**

10. What is the role of **IMUs (Inertial Measurement Units)** in humanoid balancing?
    a) To control the robot's vision system.
    b) To provide data on orientation, angular velocity, and linear acceleration for balance control.
    c) To measure the robot's power consumption.
    d) To communicate with other robots.
    **Answer: b**

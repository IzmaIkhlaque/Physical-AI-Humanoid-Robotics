---
sidebar_position: 6
sidebar_label: Humanoid Kinematics
---

# Humanoid Kinematics

## Recap

*   **Biped Mechanics:** Understanding how humanoids achieve stable walking and running with two legs.
*   **Joint Configurations:** The various ways joints are arranged in a humanoid body to enable movement.
*   **Degrees of Freedom:** The number of independent parameters that define the configuration of a robotic system.

Kinematics is a fundamental field in robotics that describes the motion of bodies without considering the forces that cause this motion. For humanoids, kinematics is crucial for understanding how the robot's joints and links move in space to achieve desired poses and trajectories. It's the mathematical backbone that allows us to control a robot's end-effectors (like hands or feet) to reach specific points or follow complex paths.

There are two main types of kinematics:

### 1. Forward Kinematics

Forward kinematics is the process of calculating the position and orientation of the robot's end-effector given the values of its joint angles. Imagine you have a humanoid arm, and you know the angles of its shoulder, elbow, and wrist joints. Forward kinematics allows you to determine exactly where the hand is located in 3D space relative to the robot's base.

This typically involves a series of transformations, often represented by homogeneous transformation matrices. Each matrix describes the translation and rotation from one joint's coordinate frame to the next. By multiplying these matrices sequentially along the robot's kinematic chain, you can find the final transformation matrix that maps the base frame to the end-effector frame.

**Mathematical Representation:**

For a simple N-link robot, the transformation from the base (frame 0) to the end-effector (frame N) can be expressed as:

$$T_{\text{N}}^0 = T_1^0 (q_1) \cdot T_2^1 (q_2) \cdot \dots \cdot T_{\text{N}}^{\text{N}-1} (q_{\text{N}})$$

Where $T_i^{i-1}$ is the homogeneous transformation matrix from frame $i-1$ to frame $i$, which is a function of the joint variable $q_i$.

### 2. Inverse Kinematics

Inverse kinematics (IK) is the more challenging, but often more useful, problem. It involves determining the required joint angles to achieve a desired position and orientation of the end-effector. For instance, if you want your humanoid robot to pick up a specific object, you know the object's location (desired end-effector position). Inverse kinematics then calculates the precise angles each joint in the arm needs to adopt to reach that object.

Solving inverse kinematics can be complex because:
*   **Multiple Solutions:** There might be several possible joint configurations that lead to the same end-effector pose (redundancy).
*   **No Solution:** The desired pose might be outside the robot's reachable workspace.
*   **Singularities:** Certain joint configurations can cause mathematical issues, leading to infinite solutions or loss of degrees of freedom.

Common methods for solving inverse kinematics include:
*   **Analytical Solutions:** Possible for simpler robots with few degrees of freedom.
*   **Numerical Solutions:** Iterative methods (e.g., Jacobian-based methods) are used for complex robots, repeatedly adjusting joint angles to minimize the error between the current and desired end-effector pose.

**Code Snippet Example (Conceptual Python for a 2-DOF arm):**

```python
import numpy as np

def forward_kinematics_2dof(l1, l2, theta1, theta2):
    """
    Calculates the end-effector position for a 2-DOF planar arm.
    l1, l2: link lengths
    theta1, theta2: joint angles in radians
    """
    x = l1 * np.cos(theta1) + l2 * np.cos(theta1 + theta2)
    y = l1 * np.sin(theta1) + l2 * np.sin(theta1 + theta2)
    return x, y

# Example usage
link1 = 1.0 # meter
link2 = 1.0 # meter
angle1 = np.pi / 4 # 45 degrees
angle2 = np.pi / 2 # 90 degrees

end_effector_x, end_effector_y = forward_kinematics_2dof(link1, link2, angle1, angle2)
print(f"End-effector position: ({end_effector_x:.2f}, {end_effector_y:.2f})")

# Inverse Kinematics (Conceptual - numerical solutions are more complex)
def inverse_kinematics_2dof(l1, l2, target_x, target_y):
    # This is a simplified analytical approach for a specific case
    # More generally, iterative methods are used.
    r_sq = target_x**2 + target_y**2
    cos_theta2 = (r_sq - l1**2 - l2**2) / (2 * l1 * l2)
    if cos_theta2 > 1 or cos_theta2 < -1:
        print("Target unreachable")
        return None, None

    theta2_sol1 = np.arctan2(np.sqrt(1 - cos_theta2**2), cos_theta2)
    theta2_sol2 = np.arctan2(-np.sqrt(1 - cos_theta2**2), cos_theta2)

    alpha = np.arctan2(target_y, target_x)
    beta1 = np.arctan2(l2 * np.sin(theta2_sol1), l1 + l2 * np.cos(theta2_sol1))
    beta2 = np.arctan2(l2 * np.sin(theta2_sol2), l1 + l2 * np.cos(theta2_sol2))

    theta1_sol1 = alpha - beta1
    theta1_sol2 = alpha - beta2

    return [(theta1_sol1, theta2_sol1), (theta1_sol2, theta2_sol2)]

# Example usage for IK
target_pos_x = 0.5
target_pos_y = 1.5
ik_solutions = inverse_kinematics_2dof(link1, link2, target_pos_x, target_pos_y)
if ik_solutions:
    print(f"Inverse Kinematics Solutions: {ik_solutions}")
    for sol in ik_solutions:
        print(f"  Theta1: {np.degrees(sol[0]):.2f} deg, Theta2: {np.degrees(sol[1]):.2f} deg")

```

### Jacobian in Kinematics

For more complex robotic systems, especially those with many degrees of freedom, the **Jacobian matrix** becomes indispensable. The Jacobian relates the joint velocities to the end-effector's linear and angular velocities.

$$ \begin{bmatrix} v \\ \omega \end{bmatrix} = J(q) \dot{q} $$

Where $v$ is linear velocity, $\omega$ is angular velocity, $J(q)$ is the Jacobian matrix (which depends on the current joint configuration $q$), and $\dot{q}$ is the vector of joint velocities.

The Jacobian is used in:
*   **Singularity Analysis:** Identifying joint configurations where the robot loses its ability to move in certain directions.
*   **Force Control:** Relating joint torques to end-effector forces.
*   **Inverse Kinematics (Numerical):** The inverse of the Jacobian (or its pseudo-inverse) is used in iterative IK algorithms to calculate joint velocity commands that move the end-effector towards the target.

### Activities

1.  **Kinematic Chain Analysis:** Take a common object with articulated parts (e.g., a desk lamp, a toy robot arm, your own arm). Identify its joints and links. Try to conceptualize how you would apply forward kinematics to determine the position of its 'end-effector'.
2.  **Workspace Exploration:** Using the conceptual 2-DOF arm from the code snippet, sketch out the reachable workspace of the end-effector. Consider the limitations imposed by the link lengths.

### Diagram

_Placeholder for a diagram illustrating a simple 2-DOF robotic arm with labeled link lengths (L1, L2) and joint angles (theta1, theta2) for both forward and inverse kinematics explanation._
*(This image will be stored in `/static/img/diagrams/part2-ch1-lesson6-kinematics.svg`)*

### Multiple Choice Questions

1.  What is the primary goal of **forward kinematics**?
    a) To determine the forces acting on robot joints.
    b) To calculate the joint angles for a desired end-effector pose.
    c) To find the end-effector's position and orientation from joint angles.
    d) To analyze the power consumption of robot actuators.
    **Answer: c**

2.  Which of the following is typically **more challenging** to solve in robotics?
    a) Forward Kinematics
    b) Inverse Kinematics
    c) Both are equally challenging
    d) Neither, they are trivial
    **Answer: b**

3.  A situation where a robot might have **multiple joint configurations** for a single end-effector pose is known as:
    a) A singularity
    b) Redundancy
    c) A workspace limit
    d) A kinematic error
    **Answer: b**

4.  The **Jacobian matrix** in robotics primarily relates:
    a) Joint positions to end-effector forces.
    b) Joint velocities to end-effector velocities.
    c) Joint accelerations to end-effector accelerations.
    d) Joint torques to joint velocities.
    **Answer: b**

5.  If a desired end-effector position is **outside the robot's reachable space**, what is the likely outcome for an inverse kinematics solution?
    a) Infinite solutions
    b) A unique solution with high error
    c) No solution
    d) A singular solution
    **Answer: c**

6.  Homogeneous transformation matrices are commonly used in forward kinematics to represent:
    a) Joint stiffness and damping
    b) Translation and rotation between coordinate frames
    c) Electrical impedance of motors
    d) Material properties of robot links
    **Answer: b**

7.  Which method is often employed for solving inverse kinematics in **complex robotic systems** with many degrees of freedom?
    a) Analytical solutions
    b) Graphical solutions
    c) Numerical (iterative) solutions
    d) Look-up tables
    **Answer: c**

8.  A robot's **workspace** refers to:
    a) The area where the robot is manufactured.
    b) The set of all reachable end-effector positions and orientations.
    c) The internal memory used by the robot controller.
    d) The maximum payload the robot can carry.
    **Answer: b**

9.  What is a **singularity** in the context of robot kinematics?
    a) A point where the robot's motors overheat.
    b) A configuration where the robot gains extra degrees of freedom.
    c) A configuration where the robot loses degrees of freedom or the inverse Jacobian becomes undefined.
    d) A point where the robot perfectly balances.
    **Answer: c**

10. In the conceptual 2-DOF arm example, what would be the effect of increasing `l1` while keeping `l2` and angles constant?
    a) The end-effector would move closer to the base.
    b) The end-effector would move further from the base.
    c) The end-effector's orientation would change drastically.
    d) The end-effector's position would remain unchanged.
    **Answer: b**

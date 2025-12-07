---
sidebar_position: 6
sidebar_label: Force Control and Haptics
---

# Force Control and Haptics in Humanoid Manipulation

## Recap

*   **Arm Kinematics:** The study of motion of humanoid arms without considering forces.
*   **Hand Dexterity:** The ability of robotic hands to perform complex and precise movements.
*   **Grasping Strategies:** Methods humanoids use to securely hold objects.

While position control allows a robot to move its end-effector to a desired point in space, many manipulation tasks require the robot to interact with its environment through forces. This is where **force control** comes into play. Force control enables humanoids to perform delicate tasks, interact safely with humans, and adapt to uncertainties in the environment. **Haptics**, on the other hand, deals with the sense of touch, providing feedback to the robot (or its human operator) about these physical interactions.

### 1. Force Control

Force control aims to regulate the forces exerted by a robot on its environment. Unlike pure position control, where the robot tries to reach a position regardless of contact, force control ensures a specific force profile during interaction.

#### Types of Force Control:

*   **Active Stiffness Control (Impedance Control):** The robot acts like a spring and damper system. It controls its mechanical impedance (stiffness and damping) to react to external forces. If an external force pushes it, it will yield with a certain stiffness, making it compliant. This is often preferred for human-robot interaction.
*   **Active Damping Control (Admittance Control):** The robot controls its admittance (inverse of impedance). It interprets external forces as velocity commands. If an external force pushes it, it moves in the direction of the force.
*   **Hybrid Force/Position Control:** This approach divides the task space into directions where force is controlled and directions where position is controlled. For example, when wiping a surface, force is controlled perpendicular to the surface (to maintain contact pressure), while position is controlled parallel to the surface (to move across it).

**Applications in Humanoids:**
*   **Assembly Tasks:** Inserting pegs into holes with tight tolerances.
*   **Polishing/Sanding:** Maintaining constant contact force on a surface.
*   **Human-Robot Collaboration:** Safe physical interaction where the robot yields to human touch.
*   **Object Manipulation:** Handling fragile objects without crushing them.

### 2. Haptics and Tactile Sensing

Haptics in robotics refers to the technology that allows a robot to sense and apply forces, as well as perceive tactile information (touch, pressure, texture, slip). Tactile sensors are the robot's "skin."

#### Types of Tactile Sensors:

*   **Force/Torque Sensors:** Typically placed at the wrist or base of fingers, these measure the 6-axis forces and torques applied to the end-effector.
*   **Pressure Sensors:** Arrays of sensors that can map pressure distribution over a surface, providing information about contact area and object shape.
*   **Slip Sensors:** Detect minute vibrations or shear forces that indicate an object is slipping from the grasp.
*   **Proximity Sensors:** Detect the presence of objects without direct contact, useful for pre-grasping alignment.

#### Role of Haptics in Manipulation:

*   **Improved Grasp Stability:** Detecting early signs of slip to adjust grip force.
*   **Object Recognition:** Identifying object properties like stiffness, texture, and shape through touch.
*   **Dexterous Manipulation:** Performing fine movements that require precise force application and tactile feedback, such as typing or manipulating small tools.
*   **Safe Interaction:** Ensuring the robot does not exert excessive force on objects or humans.

**Code Snippet Example (Conceptual Force Control Loop):**

```python
# Conceptual Python for a simple impedance control loop
import time

class RobotArm:
    def __init__(self, target_position, target_force, stiffness=100.0, damping=10.0):
        self.current_position = 0.0 # simplified 1D position
        self.current_force = 0.0
        self.target_position = target_position
        self.target_force = target_force
        self.stiffness = stiffness # K
        self.damping = damping     # D

    def sense_environment_force(self):
        # Simulate sensing external force (e.g., contact with a surface)
        # In a real robot, this comes from a force sensor
        if abs(self.current_position - self.target_position) < 0.01:
            return 20.0 # Simulate contact force
        return 0.0

    def calculate_impedance_control_command(self, dt):
        # Calculate position error
        position_error = self.target_position - self.current_position
        
        # Sense external force
        external_force = self.sense_environment_force()
        self.current_force = external_force # Update sensed force

        # Impedance control law: F_command = K * (x_target - x_current) - D * v_current - F_external
        # Here, we want to achieve a desired force, so we regulate position based on force error
        
        # Let's consider a simple compliance control where position adjusts to maintain target force
        force_error = self.target_force - external_force
        
        # Adjust position based on force error (simplified admittance-like behavior)
        # Essentially, if sensed force is too low, move further; if too high, retract.
        # This is a high-level conceptualization.
        
        # A more common impedance control directly outputs a desired force/torque
        # based on position/velocity error, and a low-level torque controller
        # then executes it.
        
        # For simplicity, let's say we want to apply a constant force.
        # If sensed force < target_force, push more. If > target_force, retract.
        
        # Desired change in position for force regulation
        # This is an oversimplification but illustrates the concept of
        # adjusting motion based on force feedback.
        
        # In a true impedance control, the robot tries to behave like a mass-spring-damper
        # The desired force from the environment F_d = M * x_ddot + D * x_dot + K * (x - x_0)
        # The control law would then generate a torque to achieve this F_d.
        
        # For a practical example, let's conceptualize controlling position to achieve force:
        # If we need more force, push more. If less, retract.
        if force_error > 0.0: # Sensed force is less than target, need to push more
            self.current_position += 0.001 * dt # Small position increment
        elif force_error < 0.0: # Sensed force is more than target, need to retract
            self.current_position -= 0.001 * dt # Small position decrement
            
        # Limit movement
        self.current_position = max(0, min(1, self.current_position))

        return self.current_position # Output desired position for low-level controller

    def update(self, dt):
        desired_pos = self.calculate_impedance_control_command(dt)
        # Here, a low-level position controller would move the arm to 'desired_pos'
        # For this simulation, we just update position directly
        # In reality, there's a dynamic model and lower-level control
        
        # print(f"Time: {dt:.2f}, Current Pos: {self.current_position:.3f}, Sensed Force: {self.current_force:.2f}, Target Force: {self.target_force:.2f}")

# Simulation
arm = RobotArm(target_position=0.5, target_force=15.0) # Target position is nominal, target force is controlled
dt = 0.01 # time step
for i in range(1000):
    arm.update(dt)
    if i % 100 == 0:
        print(f"Step {i}, Current Pos: {arm.current_position:.3f}, Sensed Force: {arm.current_force:.2f}, Target Force: {arm.target_force:.2f}")
    time.sleep(0.001)

```

### Activities

1.  **Tactile Sensing Design:** Imagine you need a humanoid hand to be able to distinguish between a smooth glass, a rough sandpaper, and a squishy sponge. What kind of tactile sensors would you integrate into the fingertips, and how would you process their data to make these distinctions?
2.  **Force Control Scenario:** Consider a humanoid robot assisting an elderly person to stand up. How would force control be crucial in this interaction to ensure safety and effectiveness? Which type of force control (impedance, admittance, hybrid) would be most suitable and why?

### Diagram

_Placeholder for a diagram illustrating Hybrid Force/Position control. It could show a robot arm writing on a whiteboard, with force control perpendicular to the board and position control parallel to it._
*(This image will be stored in `/static/img/diagrams/part2-ch3-lesson6-force-haptics.svg`)*

### Multiple Choice Questions

1.  What is the primary goal of **force control** in robotics?
    a) To always maintain a fixed position regardless of external contact.
    b) To regulate the forces exerted by a robot on its environment.
    c) To increase the robot's speed during manipulation tasks.
    d) To make the robot's movements more visually appealing.
    **Answer: b**

2.  Which type of force control makes the robot behave like a spring and damper, yielding to external forces?
    a) Admittance Control
    b) Active Damping Control
    c) Active Stiffness (Impedance) Control
    d) Hybrid Force/Position Control
    **Answer: c**

3.  **Haptics** in robotics primarily deals with:
    a) The robot's auditory perception.
    b) The robot's sense of touch and ability to apply forces.
    c) The robot's visual recognition capabilities.
    d) The robot's internal navigation system.
    **Answer: b**

4.  A **force/torque sensor** is typically placed at which part of a robot arm for manipulation tasks?
    a) The base of the arm (shoulder).
    b) Mid-arm links.
    c) The wrist or base of fingers.
    d) Inside the robot's torso.
    **Answer: c**

5.  When a robot is performing a task like **wiping a surface**, which force control strategy is most likely to be employed?
    a) Pure Position Control
    b) Pure Force Control (controlling force in all directions)
    c) Hybrid Force/Position Control
    d) Gravity Compensation Control
    **Answer: c**

6.  Which tactile sensor is most useful for detecting if an object is about to slip from a robot's grasp?
    a) Pressure Sensors
    b) Proximity Sensors
    c) Slip Sensors
    d) Temperature Sensors
    **Answer: c**

7.  A robot designed for **human-robot collaboration** where safety is paramount would most likely utilize which control strategy for interaction?
    a) High-gain Position Control
    b) Impedance Control
    c) Open-loop Control
    d) Vision-based Control
    **Answer: b**

8.  What kind of information can **pressure sensor arrays** provide to a robotic hand?
    a) The exact weight of the object.
    b) The distribution of contact forces and object shape.
    c) The object's material composition.
    d) The object's temperature.
    **Answer: b**

9.  If a robot's end-effector is supposed to maintain a constant force perpendicular to a surface while moving along it, this is a classic application of:
    a) Forward Kinematics
    b) Inverse Kinematics
    c) Hybrid Force/Position Control
    d) Impedance Control (purely)
    **Answer: c**

10. What is a key benefit of using **tactile feedback** in dexterous manipulation?
    a) Reducing the need for complex vision systems.
    b) Enabling the robot to lift heavier objects.
    c) Performing fine movements that require precise force application and interaction understanding.
    d) Increasing the robot's overall speed.
    **Answer: c**

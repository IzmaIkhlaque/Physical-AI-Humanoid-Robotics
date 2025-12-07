---
sidebar_position: 4
sidebar_label: Motion Planning and Pathfinding
---

# Motion Planning and Pathfinding for Humanoids

## Recap

*   **Lesson 1 - Reactive Behaviors:** Immediate, hardcoded responses to stimuli.
*   **Lesson 2 - State-based Decision Making:** Decisions based on internal states and transitions.
*   **Lesson 3 - Reinforcement Learning:** Learning optimal policies through trial and error.

Once a humanoid robot decides *what* to do (e.g., "go to the kitchen" or "pick up the cup"), it needs to figure out *how* to execute that decision in the physical world. This is the domain of **motion planning** and **pathfinding**. These processes generate a sequence of valid robot configurations (a path) and a time-parameterized trajectory (a motion) that achieves a goal while avoiding obstacles and respecting the robot's physical constraints.

### 1. Pathfinding (Global Planning)

Pathfinding, often referred to as global planning, focuses on finding a collision-free route from a start location to a goal location in a static or known environment. The output is typically a sequence of waypoints or a geometric path.

#### Common Pathfinding Algorithms:

*   **A* (A-star) Algorithm:** A widely used, efficient search algorithm that finds the shortest path between two nodes in a graph. It uses a heuristic function to estimate the cost from the current node to the goal, making it more informed than Dijkstra's algorithm.
    *   **Heuristic Function ($h(n)$):** An estimate of the cost from node $n$ to the goal. Must be *admissible* (never overestimates the cost) for A* to guarantee optimality.
    *   **Cost Function ($g(n)$):** The actual cost from the start node to node $n$.
    *   **Evaluation Function ($f(n) = g(n) + h(n)$):** A* expands the node with the lowest $f(n)$.
*   **Dijkstra's Algorithm:** Finds the shortest paths from a single source node to all other nodes in a graph. It does not use a heuristic.
*   **Rapidly-exploring Random Tree (RRT/RRT*):** Probabilistic algorithms suitable for high-dimensional and complex spaces where traditional grid-based search is inefficient. They build a tree of reachable states by incrementally "growing" random samples. RRT* is an extension that guarantees asymptotic optimality.

**Representation of the Environment:**
*   **Occupancy Grids:** The environment is discretized into a grid, where each cell is marked as occupied (obstacle) or free.
*   **Visibility Graphs:** Nodes are obstacles' vertices, and edges connect visible vertices, useful for polygon obstacles.
*   **Probabilistic Roadmaps (PRM):** Constructs a roadmap (graph) in the robot's configuration space by connecting randomly sampled collision-free configurations.

### 2. Motion Planning (Local Planning and Trajectory Generation)

Once a path is found, motion planning transforms it into a smooth, dynamically feasible trajectory that the robot can actually execute. This involves considering the robot's kinematics (joint limits, velocity limits, acceleration limits) and dynamics.

#### Key Aspects:

*   **Configuration Space (C-space):** A multi-dimensional space where each point represents a unique configuration of the robot (e.g., a vector of all joint angles). Obstacles in the workspace map to "C-obstacles" in C-space.
*   **Collision Detection:** Crucial for both pathfinding and motion planning. Algorithms check if any part of the robot is intersecting with any obstacle.
*   **Trajectory Optimization:** Smoothing the path and adding timing information to ensure the robot moves safely and efficiently. This can involve minimizing time, energy, jerk, or other cost functions.
*   **Local Planners (Reactive Planning):** For dynamic or unknown environments, local planners generate short-term collision-free motions based on immediate sensor feedback, often working in conjunction with a global path. Examples include Dynamic Window Approach (DWA) or Artificial Potential Fields.

**Code Snippet Example (Conceptual A* Search):**

```python
import heapq

class Node:
    def __init__(self, position, g_cost, h_cost, parent=None):
        self.position = position
        self.g_cost = g_cost  # Cost from start to current node
        self.h_cost = h_cost  # Heuristic cost from current node to end
        self.f_cost = g_cost + h_cost # Total cost
        self.parent = parent

    def __lt__(self, other): # For min-heap functionality
        return self.f_cost < other.f_cost

def heuristic(a, b):
    # Manhattan distance heuristic for a grid
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def a_star_pathfinding(grid, start, end):
    open_list = []
    closed_list = set()
    
    start_node = Node(start, 0, heuristic(start, end))
    heapq.heappush(open_list, start_node)
    
    # Store g_cost for already visited nodes to check if a shorter path is found
    g_costs = {start: 0}
    
    path = {} # To reconstruct path

    while open_list:
        current_node = heapq.heappop(open_list)
        
        if current_node.position == end:
            # Path found, reconstruct it
            path_list = []
            while current_node:
                path_list.append(current_node.position)
                current_node = current_node.parent
            return path_list[::-1] # Reverse to get path from start to end
        
        closed_list.add(current_node.position)
        
        # Explore neighbors (up, down, left, right)
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            neighbor_pos = (current_node.position[0] + dx, current_node.position[1] + dy)
            
            # Check bounds and obstacles
            if not (0 <= neighbor_pos[0] < len(grid) and \
                    0 <= neighbor_pos[1] < len(grid[0]) and \
                    grid[neighbor_pos[0]][neighbor_pos[1]] == 0): # 0 means free space
                continue
            
            if neighbor_pos in closed_list:
                continue
            
            new_g_cost = current_node.g_cost + 1 # Assuming cost of 1 for each step
            
            if neighbor_pos not in g_costs or new_g_cost < g_costs[neighbor_pos]:
                g_costs[neighbor_pos] = new_g_cost
                neighbor_node = Node(neighbor_pos, new_g_cost, heuristic(neighbor_pos, end), current_node)
                heapq.heappush(open_list, neighbor_node)
                path[neighbor_pos] = current_node.position # Store parent for path reconstruction

    return None # No path found

# Example Usage:
# 0 = free, 1 = obstacle
grid_env = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

start_pos = (0, 0)
end_pos = (4, 4)

found_path = a_star_pathfinding(grid_env, start_pos, end_pos)
if found_path:
    print(f"Path found: {found_path}")
else:
    print("No path found.")

```

### Challenges in Motion Planning for Humanoids

*   **High Dimensionality:** Humanoids have many joints, leading to a very high-dimensional C-space, making search and collision detection computationally intensive.
*   **Dynamic Environments:** Real-world environments are rarely static. Robots need to adapt to moving obstacles and changes.
*   **Kinodynamic Constraints:** Humanoids are not just points; they have mass, inertia, and joint velocity/acceleration limits that must be respected, making simple geometric paths insufficient.
*   **Balance and Stability:** Unlike wheeled robots, humanoids must constantly maintain balance, adding a significant constraint to motion planning.
*   **Real-time Performance:** Planning needs to happen fast enough for the robot to react to its environment, especially in unstructured or human-populated settings.

### Activities

1.  **Grid Pathfinding:** Draw a simple 5x5 grid with a few "obstacle" cells. Choose a start and end point. Manually apply the A* algorithm (or another pathfinding algorithm) to find a path, listing the order in which cells would be visited.
2.  **C-Space Visualization:** Imagine a simple 2-link robotic arm. Try to sketch what its 2-dimensional C-space would look like, and how a rectangular obstacle in the workspace would appear as a "C-obstacle" in that space.

### Diagram

_Placeholder for a diagram illustrating a pathfinding algorithm (e.g., A* search) on an occupancy grid, showing the start, end, obstacles, and the calculated path._
*(This image will be stored in `/static/img/diagrams/part3-ch2-lesson4-motion-planning.svg`)*

### Multiple Choice Questions

1.  What is the primary goal of **motion planning** in robotics?
    a) To determine the robot's color.
    b) To generate a sequence of valid robot configurations to achieve a goal.
    c) To control the robot's emotional state.
    d) To identify objects in the environment.
    **Answer: b**

2.  Which algorithm is a **probabilistic motion planner** particularly suited for high-dimensional spaces?
    a) Dijkstra's Algorithm
    b) A* Algorithm
    c) Rapidly-exploring Random Tree (RRT)
    d) Breadth-First Search
    **Answer: c**

3.  The **Configuration Space (C-space)** of a robot represents:
    a) The volume occupied by the robot.
    b) All possible joint configurations of the robot.
    c) The physical space where the robot operates.
    d) The memory used by the robot's controller.
    **Answer: b**

4.  For A* algorithm to guarantee finding the **optimal path**, its heuristic function must be:
    a) Optimistic (overestimates cost).
    b) Pessimistic (underestimates cost).
    c) Admissible (never overestimates cost).
    d) Always zero.
    **Answer: c**

5.  What does an **occupancy grid** represent in the context of motion planning?
    a) The robot's battery level.
    b) A discretized environment showing free and occupied (obstacle) cells.
    c) The robot's current joint velocities.
    d) The communication protocol between robots.
    **Answer: b**

6.  Which of the following is a significant challenge in motion planning specifically for **humanoid robots**?
    a) Their low number of degrees of freedom.
    b) The need to constantly maintain balance.
    c) Their static nature.
    d) The simplicity of their sensor systems.
    **Answer: b**

7.  A **global planner** typically focuses on finding a path in:
    a) A dynamic and unknown environment.
    b) A static or known environment.
    c) The robot's joint velocity space.
    d) Only very short distances.
    **Answer: b**

8.  What is the purpose of **Collision Detection** in motion planning?
    a) To enhance the robot's visual appearance.
    b) To check if any part of the robot intersects with an obstacle.
    c) To identify the type of materials an obstacle is made of.
    d) To measure the robot's speed.
    **Answer: b**

9.  When a path is found, **trajectory optimization** is used to:
    a) Change the robot's color scheme.
    b) Make the path smooth, dynamically feasible, and add timing information.
    c) Generate random movements.
    d) Convert the path into a series of images.
    **Answer: b**

10. Which algorithm would be generally preferred for finding the shortest path on a **grid map** if computational resources are limited and a good heuristic is available?
    a) Dijkstra's Algorithm
    b) Breadth-First Search
    c) Depth-First Search
    d) A* Algorithm
    **Answer: d**
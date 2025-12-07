---
sidebar_position: 1
title: Task and Motion Planning
description: Planning robot actions from high-level goals to motor commands
---

# Task and Motion Planning

## Learning Objectives

- Understand the planning hierarchy in robotics
- Learn classical motion planning algorithms (RRT, A*)
- Implement task-level planning with PDDL
- Combine task and motion planning for complex behaviors

## The Planning Hierarchy

Robot planning operates at multiple levels:

```
┌─────────────────────────────────────────┐
│         Mission Planning                │  "Fetch coffee from kitchen"
│         (Hours/Days)                    │
├─────────────────────────────────────────┤
│         Task Planning                   │  Go to kitchen → Find cup → ...
│         (Minutes)                       │
├─────────────────────────────────────────┤
│         Motion Planning                 │  Collision-free path
│         (Seconds)                       │
├─────────────────────────────────────────┤
│         Trajectory Optimization         │  Smooth, time-optimal
│         (Milliseconds)                  │
├─────────────────────────────────────────┤
│         Control                         │  Motor commands
│         (Microseconds)                  │
└─────────────────────────────────────────┘
```

## Configuration Space

Motion planning operates in configuration space (C-space):

```python
import numpy as np

class ConfigurationSpace:
    """Configuration space for a robot"""

    def __init__(self, robot):
        self.robot = robot
        self.dim = robot.num_joints
        self.joint_limits = robot.get_joint_limits()

    def random_config(self):
        """Sample random configuration"""
        config = np.zeros(self.dim)
        for i in range(self.dim):
            low, high = self.joint_limits[i]
            config[i] = np.random.uniform(low, high)
        return config

    def is_valid(self, config):
        """Check if configuration is collision-free"""
        # Set robot to configuration
        self.robot.set_joint_positions(config)

        # Check self-collision
        if self.robot.check_self_collision():
            return False

        # Check environment collision
        if self.robot.check_environment_collision():
            return False

        return True

    def distance(self, config1, config2):
        """Distance between configurations"""
        return np.linalg.norm(config1 - config2)

    def interpolate(self, config1, config2, t):
        """Interpolate between configurations"""
        return config1 + t * (config2 - config1)
```

## Rapidly-exploring Random Trees (RRT)

RRT is a foundational sampling-based planner:

```python
class RRTPlanner:
    """RRT motion planner"""

    def __init__(self, cspace, step_size=0.1, max_iterations=10000):
        self.cspace = cspace
        self.step_size = step_size
        self.max_iterations = max_iterations

    def plan(self, start, goal, goal_threshold=0.1):
        """Plan path from start to goal"""
        # Initialize tree with start
        tree = {'nodes': [start], 'parents': [-1]}

        for i in range(self.max_iterations):
            # Sample random configuration (bias toward goal)
            if np.random.random() < 0.1:
                q_rand = goal
            else:
                q_rand = self.cspace.random_config()

            # Find nearest node in tree
            nearest_idx = self._find_nearest(tree['nodes'], q_rand)
            q_nearest = tree['nodes'][nearest_idx]

            # Extend toward random config
            q_new = self._extend(q_nearest, q_rand)

            # Check if valid
            if self._is_path_valid(q_nearest, q_new):
                tree['nodes'].append(q_new)
                tree['parents'].append(nearest_idx)

                # Check if reached goal
                if self.cspace.distance(q_new, goal) < goal_threshold:
                    return self._extract_path(tree, len(tree['nodes']) - 1)

        return None  # Failed to find path

    def _find_nearest(self, nodes, config):
        """Find nearest node to config"""
        distances = [self.cspace.distance(n, config) for n in nodes]
        return np.argmin(distances)

    def _extend(self, q_from, q_to):
        """Extend from q_from toward q_to"""
        direction = q_to - q_from
        distance = np.linalg.norm(direction)

        if distance < self.step_size:
            return q_to
        else:
            return q_from + self.step_size * direction / distance

    def _is_path_valid(self, q1, q2, num_checks=10):
        """Check if path between configs is collision-free"""
        for t in np.linspace(0, 1, num_checks):
            config = self.cspace.interpolate(q1, q2, t)
            if not self.cspace.is_valid(config):
                return False
        return True

    def _extract_path(self, tree, goal_idx):
        """Extract path from tree"""
        path = []
        idx = goal_idx

        while idx != -1:
            path.append(tree['nodes'][idx])
            idx = tree['parents'][idx]

        return list(reversed(path))


class RRTStarPlanner(RRTPlanner):
    """RRT* with path optimization"""

    def __init__(self, cspace, step_size=0.1, max_iterations=10000,
                 neighbor_radius=0.5):
        super().__init__(cspace, step_size, max_iterations)
        self.neighbor_radius = neighbor_radius
        self.costs = []

    def plan(self, start, goal, goal_threshold=0.1):
        """RRT* planning with rewiring"""
        tree = {'nodes': [start], 'parents': [-1]}
        self.costs = [0.0]

        for i in range(self.max_iterations):
            q_rand = goal if np.random.random() < 0.1 else self.cspace.random_config()

            nearest_idx = self._find_nearest(tree['nodes'], q_rand)
            q_nearest = tree['nodes'][nearest_idx]
            q_new = self._extend(q_nearest, q_rand)

            if not self._is_path_valid(q_nearest, q_new):
                continue

            # Find nearby nodes
            neighbors = self._find_neighbors(tree['nodes'], q_new)

            # Choose best parent
            best_parent = nearest_idx
            best_cost = self.costs[nearest_idx] + self.cspace.distance(q_nearest, q_new)

            for neighbor_idx in neighbors:
                q_neighbor = tree['nodes'][neighbor_idx]
                new_cost = self.costs[neighbor_idx] + self.cspace.distance(q_neighbor, q_new)

                if new_cost < best_cost and self._is_path_valid(q_neighbor, q_new):
                    best_parent = neighbor_idx
                    best_cost = new_cost

            # Add to tree
            tree['nodes'].append(q_new)
            tree['parents'].append(best_parent)
            self.costs.append(best_cost)

            # Rewire tree
            self._rewire(tree, len(tree['nodes']) - 1, neighbors)

            if self.cspace.distance(q_new, goal) < goal_threshold:
                return self._extract_path(tree, len(tree['nodes']) - 1)

        return None

    def _find_neighbors(self, nodes, config):
        """Find all nodes within radius"""
        neighbors = []
        for i, node in enumerate(nodes):
            if self.cspace.distance(node, config) < self.neighbor_radius:
                neighbors.append(i)
        return neighbors

    def _rewire(self, tree, new_idx, neighbors):
        """Rewire tree through new node if better"""
        q_new = tree['nodes'][new_idx]

        for neighbor_idx in neighbors:
            q_neighbor = tree['nodes'][neighbor_idx]
            new_cost = self.costs[new_idx] + self.cspace.distance(q_new, q_neighbor)

            if new_cost < self.costs[neighbor_idx]:
                if self._is_path_valid(q_new, q_neighbor):
                    tree['parents'][neighbor_idx] = new_idx
                    self.costs[neighbor_idx] = new_cost
```

## A* for Grid-Based Planning

```python
import heapq

class AStarPlanner:
    """A* planner for grid-based navigation"""

    def __init__(self, grid_map):
        self.grid = grid_map  # 2D array, 0=free, 1=obstacle
        self.rows, self.cols = grid_map.shape

    def plan(self, start, goal):
        """Find shortest path using A*"""
        # Priority queue: (f_score, counter, position)
        counter = 0
        open_set = [(self._heuristic(start, goal), counter, start)]
        came_from = {}
        g_score = {start: 0}

        while open_set:
            _, _, current = heapq.heappop(open_set)

            if current == goal:
                return self._reconstruct_path(came_from, current)

            for neighbor in self._get_neighbors(current):
                tentative_g = g_score[current] + self._cost(current, neighbor)

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + self._heuristic(neighbor, goal)
                    counter += 1
                    heapq.heappush(open_set, (f_score, counter, neighbor))

        return None  # No path found

    def _heuristic(self, a, b):
        """Euclidean distance heuristic"""
        return np.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

    def _cost(self, a, b):
        """Movement cost"""
        return np.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

    def _get_neighbors(self, pos):
        """Get valid neighbors (8-connected)"""
        neighbors = []
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue

                r, c = pos[0] + dr, pos[1] + dc

                if 0 <= r < self.rows and 0 <= c < self.cols:
                    if self.grid[r, c] == 0:  # Free space
                        neighbors.append((r, c))

        return neighbors

    def _reconstruct_path(self, came_from, current):
        """Reconstruct path from came_from map"""
        path = [current]
        while current in came_from:
            current = came_from[current]
            path.append(current)
        return list(reversed(path))
```

## Task Planning with PDDL

Planning Domain Definition Language for high-level planning:

```python
class TaskPlanner:
    """Simple task planner using PDDL-style planning"""

    def __init__(self):
        self.actions = {}
        self.objects = {}

    def define_action(self, name, parameters, preconditions, effects):
        """Define an action schema"""
        self.actions[name] = {
            'parameters': parameters,
            'preconditions': preconditions,
            'effects': effects
        }

    def plan(self, initial_state, goal_state, max_depth=10):
        """Find action sequence from initial to goal state"""
        from collections import deque

        queue = deque([(initial_state, [])])
        visited = {frozenset(initial_state)}

        while queue:
            current_state, plan = queue.popleft()

            if len(plan) > max_depth:
                continue

            # Check if goal reached
            if goal_state.issubset(current_state):
                return plan

            # Try each action
            for action_name, action_def in self.actions.items():
                for binding in self._get_bindings(action_def['parameters']):
                    grounded_prec = self._ground(action_def['preconditions'], binding)

                    if grounded_prec.issubset(current_state):
                        # Apply action
                        new_state = current_state.copy()
                        effects = self._ground(action_def['effects'], binding)

                        for effect in effects:
                            if effect.startswith('not_'):
                                new_state.discard(effect[4:])
                            else:
                                new_state.add(effect)

                        state_key = frozenset(new_state)
                        if state_key not in visited:
                            visited.add(state_key)
                            new_plan = plan + [(action_name, binding)]
                            queue.append((new_state, new_plan))

        return None

    def _get_bindings(self, parameters):
        """Generate all possible parameter bindings"""
        from itertools import product

        if not parameters:
            yield {}
            return

        param_names = list(parameters.keys())
        param_types = [parameters[p] for p in param_names]

        type_objects = [[obj for obj in self.objects if self.objects[obj] == t]
                       for t in param_types]

        for combo in product(*type_objects):
            yield dict(zip(param_names, combo))

    def _ground(self, predicates, binding):
        """Ground predicates with binding"""
        grounded = set()
        for pred in predicates:
            grounded_pred = pred
            for param, obj in binding.items():
                grounded_pred = grounded_pred.replace(f'?{param}', obj)
            grounded.add(grounded_pred)
        return grounded


# Example usage
planner = TaskPlanner()

# Define objects
planner.objects = {
    'cup': 'object',
    'table': 'location',
    'kitchen': 'location',
    'robot': 'robot'
}

# Define pick action
planner.define_action(
    name='pick',
    parameters={'obj': 'object', 'loc': 'location'},
    preconditions={'at(?obj, ?loc)', 'robot_at(?loc)', 'hand_empty'},
    effects={'holding(?obj)', 'not_at(?obj, ?loc)', 'not_hand_empty'}
)

# Define place action
planner.define_action(
    name='place',
    parameters={'obj': 'object', 'loc': 'location'},
    preconditions={'holding(?obj)', 'robot_at(?loc)'},
    effects={'at(?obj, ?loc)', 'not_holding(?obj)', 'hand_empty'}
)

# Define move action
planner.define_action(
    name='move',
    parameters={'from_loc': 'location', 'to_loc': 'location'},
    preconditions={'robot_at(?from_loc)'},
    effects={'robot_at(?to_loc)', 'not_robot_at(?from_loc)'}
)
```

## Integrated Task and Motion Planning

```python
class TAMP:
    """Task and Motion Planning integration"""

    def __init__(self, task_planner, motion_planner):
        self.task_planner = task_planner
        self.motion_planner = motion_planner

    def plan(self, initial_state, goal_state, robot_config):
        """Generate task plan with motion feasibility"""
        # Get task plan
        task_plan = self.task_planner.plan(initial_state, goal_state)

        if task_plan is None:
            return None

        # Verify motion feasibility
        full_plan = []
        current_config = robot_config

        for action, binding in task_plan:
            # Get motion plan for action
            target_config = self._get_target_config(action, binding)

            motion_path = self.motion_planner.plan(current_config, target_config)

            if motion_path is None:
                # Motion infeasible, replan with constraint
                return self._replan_with_constraint(
                    initial_state, goal_state, action, binding
                )

            full_plan.append({
                'action': action,
                'binding': binding,
                'motion_path': motion_path
            })

            current_config = target_config

        return full_plan

    def _get_target_config(self, action, binding):
        """Get target robot configuration for action"""
        # Implementation depends on action type
        if action == 'pick':
            obj = binding['obj']
            return self._compute_grasp_config(obj)
        elif action == 'place':
            loc = binding['loc']
            return self._compute_place_config(loc)
        elif action == 'move':
            to_loc = binding['to_loc']
            return self._compute_navigation_config(to_loc)
```

## Key Takeaways

:::tip Summary
- **Planning hierarchy** spans from missions to motor commands
- **Configuration space** represents all possible robot states
- **RRT/RRT*** efficiently explore high-dimensional spaces
- **A*** finds optimal paths in discrete search spaces
- **Task planning** (PDDL) handles symbolic reasoning
- **TAMP** integrates task and motion planning
:::

## Practice Exercises

1. **RRT Implementation**: Implement RRT for a 2D robot arm and visualize the tree growth.

2. **A* Navigation**: Build A* pathfinding on an occupancy grid from SLAM.

3. **Task Planning**: Define a PDDL domain for a household robot and solve planning problems.

4. **TAMP Integration**: Combine task and motion planning for a pick-and-place task.

## Further Reading

- LaValle, S. "Planning Algorithms"
- Ghallab et al. "Automated Planning: Theory and Practice"
- Kavraki et al. "Probabilistic Roadmaps for Path Planning"
- Garrett et al. "Integrated Task and Motion Planning"

---
sidebar_position: 3
sidebar_label: Reinforcement Learning for Decision Making
---

# Reinforcement Learning for Humanoid Decision Making

## Recap

*   **Lesson 1 - Reactive Behaviors:** Simple, direct responses to sensory inputs without internal models.
*   **Lesson 2 - State-based Decision Making:** Decisions made based on predefined states and transitions.

Humanoid robots often operate in complex, dynamic, and uncertain environments. Traditional rule-based or state-machine approaches to decision-making can become unwieldy and brittle in such scenarios. **Reinforcement Learning (RL)** offers a powerful paradigm where a robot learns optimal behaviors through trial and error, guided by a reward system. This allows humanoids to develop adaptive and sophisticated decision-making policies without explicit programming for every possible situation.

### 1. Fundamentals of Reinforcement Learning

RL involves an **agent** (the humanoid robot) interacting with an **environment**. The agent performs **actions**, which change the state of the environment. Based on these actions and the new state, the environment provides a **reward** (or penalty), which the agent tries to maximize over time.

#### Key Components:

*   **Agent:** The humanoid robot, which makes decisions and takes actions.
*   **Environment:** The world the robot operates in (e.g., a room, a simulated training ground).
*   **State (S):** A complete description of the environment at a given time (e.g., robot's joint angles, sensor readings, object locations).
*   **Action (A):** A move the agent can make (e.g., move left arm, take a step forward, change gaze direction).
*   **Reward (R):** A scalar feedback signal from the environment, indicating the desirability of the agent's action. The agent's goal is to maximize cumulative reward.
*   **Policy ($\pi$):** A mapping from states to actions, defining the agent's behavior. An optimal policy maximizes long-term reward.
*   **Value Function (V or Q):** Predicts the expected future reward from a given state or state-action pair.

### 2. Markov Decision Processes (MDPs)

Most RL problems are formalized as Markov Decision Processes. An MDP is defined by:
*   A set of states $S$.
*   A set of actions $A$.
*   A transition probability function $P(s' | s, a)$, which gives the probability of reaching state $s'$ from state $s$ by taking action $a$.
*   A reward function $R(s, a, s')$, which specifies the reward received after transitioning from $s$ to $s'$ via action $a$.

The "Markov property" states that the future depends only on the present state, not on the sequence of events that preceded it.

### 3. Popular RL Algorithms for Humanoids

#### a. Q-Learning

A value-based, off-policy RL algorithm that learns an action-value function (Q-function). $Q(s, a)$ represents the expected maximum future reward if the agent is in state $s$ and takes action $a$. The robot iteratively updates its $Q$-values based on the Bellman equation:

$$Q(s, \text{a}) \leftarrow Q(s, \text{a}) + \alpha [R + \gamma \max_{\text{a}} Q(s', \text{a}) - Q(s, \text{a})]$$

Where:
*   $\alpha$: Learning rate
*   $\gamma$: Discount factor (prioritizes immediate vs. future rewards)

#### b. Deep Q-Networks (DQN)

For environments with large or continuous state spaces (common in robotics), maintaining a table for $Q$-values becomes infeasible. DQN uses a deep neural network to approximate the $Q$-function. This allows the robot to generalize from observed experiences.

#### c. Policy Gradients (e.g., REINFORCE, Actor-Critic)

Instead of learning a value function, policy gradient methods directly learn the policy. An "Actor" neural network learns the policy, while a "Critic" network learns the value function to guide the actor. These methods are particularly effective for continuous action spaces, which are typical for humanoid robots (e.g., continuous joint angle commands).

#### d. Proximal Policy Optimization (PPO)

PPO is a popular policy gradient algorithm that has shown great success in robotics. It strikes a balance between ease of implementation, sample efficiency, and good performance. It makes sure that each policy update does not deviate too far from the previous policy, preventing catastrophic forgetting.

**Code Snippet Example (Conceptual Q-Learning Update):**

```python
import numpy as np

# Conceptual Q-table for a simplified humanoid task (e.g., navigate a grid)
# States: (x, y) coordinates in a grid
# Actions: (up, down, left, right)

# Assume a small grid for illustration: 3x3
num_states = 3 * 3
num_actions = 4 # 0: up, 1: down, 2: left, 3: right

# Initialize Q-table (states x actions)
Q_table = np.zeros((num_states, num_actions))

# Hyperparameters
learning_rate = 0.1 # alpha
discount_factor = 0.9 # gamma
epsilon = 0.1 # for epsilon-greedy policy

# Reward map (simplified)
# R_grid = [
#     [-1, -1, -1],
#     [-1, -1, -1],
#     [-1, -1, 10] # Goal at (2,2)
# ]

# Function to get current state (e.g., linear index from (x,y))
def get_state_index(pos_x, pos_y, grid_width=3):
    return pos_y * grid_width + pos_x

# Function to simulate environment step and reward
def take_action_and_get_reward(current_state_idx, action):
    # This would involve simulating robot physics/environment interaction
    # For simplification, let's assume a simple grid world
    
    # Example: move right from state 0 (0,0) -> state 1 (1,0)
    # This needs to be much more detailed in a real scenario
    
    # Placeholder for actual environment dynamics
    next_state_idx = (current_state_idx + action_mapping[action]) % num_states
    reward = -1 # small penalty for each step
    if next_state_idx == 8: # Assuming state 8 is target (2,2)
        reward = 100
    
    is_done = (next_state_idx == 8) # Terminal state
    
    return next_state_idx, reward, is_done

# Dummy action mapping for illustration
action_mapping = {
    0: -3, # up (row - 1)
    1: 3,  # down (row + 1)
    2: -1, # left (col - 1)
    3: 1   # right (col + 1)
}

# Training loop (conceptual)
for episode in range(1000):
    current_state_idx = 0 # Start at state (0,0)
    is_done = False
    
    while not is_done:
        # Epsilon-greedy action selection
        if np.random.uniform(0, 1) < epsilon:
            action = np.random.randint(num_actions) # Explore
        else:
            action = np.argmax(Q_table[current_state_idx, :]) # Exploit
            
        next_state_idx, reward, is_done = take_action_and_get_reward(current_state_idx, action)
        
        # Q-Learning update rule
        old_q_value = Q_table[current_state_idx, action]
        next_max_q = np.max(Q_table[next_state_idx, :])
        
        new_q_value = old_q_value + learning_rate * (reward + discount_factor * next_max_q - old_q_value)
        Q_table[current_state_idx, action] = new_q_value
        
        current_state_idx = next_state_idx
        
    # Optional: decay epsilon over time
    epsilon = max(0.01, epsilon * 0.995)

# print("Learned Q-table:")
# print(Q_table)

# To get optimal policy: for each state, choose action with max Q-value
```

### Challenges in Applying RL to Humanoids

*   **High Dimensionality:** Humanoid robots have many degrees of freedom, leading to vast state and action spaces, making learning difficult and computationally expensive.
*   **Sample Inefficiency:** Real-world robots are slow and expensive to operate. RL algorithms often require millions of interactions, making direct training on physical humanoids impractical.
*   **Sim-to-Real Gap:** Policies learned in simulation often do not transfer well to the real world due to discrepancies in physics, sensor noise, and actuator dynamics.
*   **Safety:** Random exploration, a core part of RL, can be dangerous for physical robots, potentially leading to damage or unsafe behaviors.

### Activities

1.  **Reward Function Design:** Imagine you want a humanoid to learn to walk. Propose a reward function that would encourage forward movement, stability, and energy efficiency. How would you penalize falling or inefficient gaits?
2.  **State Representation:** If you were designing an RL agent for a humanoid to pick up a cup, what sensory inputs and internal variables would you include in its 'state' representation to enable effective learning?

### Diagram

_Placeholder for a diagram illustrating the basic Reinforcement Learning loop: Agent interacts with Environment, takes Action, receives State and Reward, updates Policy/Value function._
*(This image will be stored in `/static/img/diagrams/part3-ch2-lesson3-rl-decision.svg`)*

### Multiple Choice Questions

1.  In Reinforcement Learning, the **agent's primary goal** is to:
    a) Minimize the number of actions taken.
    b) Maximize the cumulative reward over time.
    c) Explore every possible state.
    d) Avoid all penalties.
    **Answer: b**

2.  Which of the following is NOT a fundamental component of an RL system?
    a) Agent
    b) Environment
    c) Reward
    d) Compiler
    **Answer: d**

3.  The **policy** in Reinforcement Learning defines:
    a) The value of each state.
    b) The agent's behavior, mapping states to actions.
    c) The amount of reward received.
    d) The transition probabilities between states.
    **Answer: b**

4.  **Markov Decision Processes (MDPs)** are commonly used to formalize RL problems because they assume:
    a) The future depends only on the present state.
    b) All actions are deterministic.
    c) Rewards are always positive.
    d) The environment is always static.
    **Answer: a**

5.  For environments with **large state spaces**, which RL technique is often used to approximate the Q-function?
    a) Q-table lookups
    b) Deep Q-Networks (DQN)
    c) Analytical solutions
    d) Random walks
    **Answer: b**

6.  Which RL algorithm is known for directly learning the policy and being effective for **continuous action spaces**?
    a) Q-Learning
    b) Sarsa
    c) Policy Gradients
    d) Monte Carlo
    **Answer: c**

7.  A major challenge when applying RL to **physical humanoid robots** is:
    a) The simplicity of their kinematics.
    b) The low dimensionality of their state space.
    c) Sample inefficiency and the sim-to-real gap.
    d) The lack of available computational power.
    **Answer: c**

8.  In the Q-Learning update rule, the **discount factor ($\gamma$)** is used to:
    a) Control the learning rate.
    b) Determine how much immediate rewards are valued over future rewards.
    c) Introduce randomness into action selection.
    d) Normalize the Q-values.
    **Answer: b**

9.  If a humanoid robot is trying to learn to balance, a **negative reward (penalty)** would likely be given for:
    a) Taking a step forward.
    b) Standing still.
    c) Falling over.
    d) Maintaining an upright posture.
    **Answer: c**

10. What is the primary purpose of the **"Critic" network** in Actor-Critic methods?
    a) To perform random actions.
    b) To learn the value function to guide the Actor.
    c) To evaluate the environment's state.
    d) To generate new states.
    **Answer: b**
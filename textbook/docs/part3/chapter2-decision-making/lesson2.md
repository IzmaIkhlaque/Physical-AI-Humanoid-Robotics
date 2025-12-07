---
sidebar_position: 2
title: Reinforcement Learning for Robotics
description: Learning robot behaviors through trial and error
---

# Reinforcement Learning for Robotics

## Learning Objectives

- Understand reinforcement learning fundamentals for robotics
- Learn Q-learning and policy gradient methods
- Implement Deep RL algorithms (DQN, PPO, SAC)
- Apply RL to robot locomotion and manipulation tasks

## Introduction to RL for Robotics

Reinforcement Learning enables robots to learn behaviors through interaction with the environment. Unlike supervised learning, RL learns from rewards rather than labeled examples.

### The RL Framework

```
┌──────────┐
│  Agent   │
│ (Robot)  │
└────┬─────┘
     │ Action (a)
     ↓
┌──────────────┐
│ Environment  │
└────┬─────────┘
     │ State (s), Reward (r)
     ↓
┌──────────┐
│  Agent   │
└──────────┘
```

### Key Concepts

| Concept | Description | Robotics Example |
|---------|-------------|------------------|
| State (s) | Robot's current situation | Joint angles, object positions |
| Action (a) | What robot can do | Motor commands, gripper open/close |
| Reward (r) | Feedback signal | +10 for successful grasp, -1 for collision |
| Policy (π) | Strategy for action selection | Neural network mapping states to actions |
| Value Function (V) | Expected future reward | How good is this robot configuration? |

## Markov Decision Process (MDP)

Robotics problems are formulated as MDPs:

```python
import numpy as np

class MDP:
    """Markov Decision Process for robot tasks"""

    def __init__(self, state_dim, action_dim):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.gamma = 0.99  # Discount factor

    def step(self, state, action):
        """Execute action and return next state, reward, done"""
        # Implemented by specific robot environment
        raise NotImplementedError

    def reset(self):
        """Reset to initial state"""
        raise NotImplementedError

    def get_reward(self, state, action, next_state):
        """Compute reward for transition"""
        raise NotImplementedError


class RobotReachingMDP(MDP):
    """Simple reaching task MDP"""

    def __init__(self, target_position):
        super().__init__(state_dim=6, action_dim=3)  # 3D position + velocity, 3D action
        self.target = np.array(target_position)
        self.position = np.zeros(3)
        self.velocity = np.zeros(3)
        self.max_steps = 100
        self.current_step = 0

    def reset(self):
        """Reset robot to random position"""
        self.position = np.random.uniform(-1, 1, 3)
        self.velocity = np.zeros(3)
        self.current_step = 0
        return self._get_state()

    def step(self, action):
        """Apply action (acceleration)"""
        # Physics simulation (simplified)
        self.velocity += action * 0.1
        self.velocity = np.clip(self.velocity, -0.5, 0.5)
        self.position += self.velocity * 0.1
        self.current_step += 1

        # Compute reward
        distance = np.linalg.norm(self.position - self.target)
        reward = -distance

        # Success bonus
        if distance < 0.1:
            reward += 10
            done = True
        elif self.current_step >= self.max_steps:
            done = True
        else:
            done = False

        return self._get_state(), reward, done, {}

    def _get_state(self):
        """Get current state"""
        return np.concatenate([self.position, self.velocity])
```

## Q-Learning

Learn action-value function Q(s, a):

```python
class QLearning:
    """Tabular Q-learning"""

    def __init__(self, state_space, action_space, learning_rate=0.1,
                 epsilon=0.1, gamma=0.99):
        self.lr = learning_rate
        self.epsilon = epsilon
        self.gamma = gamma

        # Q-table
        self.q_table = {}
        self.action_space = action_space

    def get_q_value(self, state, action):
        """Get Q-value for state-action pair"""
        state_key = self._discretize_state(state)
        if state_key not in self.q_table:
            self.q_table[state_key] = np.zeros(len(self.action_space))
        return self.q_table[state_key][action]

    def choose_action(self, state, training=True):
        """Epsilon-greedy action selection"""
        if training and np.random.random() < self.epsilon:
            return np.random.choice(len(self.action_space))
        else:
            state_key = self._discretize_state(state)
            if state_key not in self.q_table:
                return np.random.choice(len(self.action_space))
            return np.argmax(self.q_table[state_key])

    def update(self, state, action, reward, next_state, done):
        """Q-learning update rule"""
        state_key = self._discretize_state(state)
        next_state_key = self._discretize_state(next_state)

        # Initialize if needed
        if state_key not in self.q_table:
            self.q_table[state_key] = np.zeros(len(self.action_space))
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = np.zeros(len(self.action_space))

        # Q-learning update
        current_q = self.q_table[state_key][action]

        if done:
            target_q = reward
        else:
            max_next_q = np.max(self.q_table[next_state_key])
            target_q = reward + self.gamma * max_next_q

        self.q_table[state_key][action] += self.lr * (target_q - current_q)

    def _discretize_state(self, state):
        """Convert continuous state to discrete key"""
        # Simple discretization
        discretized = tuple(np.round(state, decimals=1))
        return discretized
```

## Deep Q-Network (DQN)

Scale Q-learning to high-dimensional states:

```python
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random

class DQN(nn.Module):
    """Deep Q-Network"""

    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()

        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim)
        )

    def forward(self, state):
        return self.network(state)


class DQNAgent:
    """DQN agent with experience replay"""

    def __init__(self, state_dim, action_dim, learning_rate=1e-3,
                 gamma=0.99, epsilon=1.0, epsilon_decay=0.995,
                 epsilon_min=0.01, buffer_size=100000, batch_size=64):

        self.state_dim = state_dim
        self.action_dim = action_dim
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min
        self.batch_size = batch_size

        # Networks
        self.q_network = DQN(state_dim, action_dim)
        self.target_network = DQN(state_dim, action_dim)
        self.target_network.load_state_dict(self.q_network.state_dict())

        self.optimizer = optim.Adam(self.q_network.parameters(), lr=learning_rate)

        # Experience replay buffer
        self.memory = deque(maxlen=buffer_size)

    def choose_action(self, state, training=True):
        """Epsilon-greedy action selection"""
        if training and random.random() < self.epsilon:
            return random.randrange(self.action_dim)

        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0)
            q_values = self.q_network(state_tensor)
            return q_values.argmax(dim=1).item()

    def store_transition(self, state, action, reward, next_state, done):
        """Store experience in replay buffer"""
        self.memory.append((state, action, reward, next_state, done))

    def train(self):
        """Train on batch from replay buffer"""
        if len(self.memory) < self.batch_size:
            return

        # Sample batch
        batch = random.sample(self.memory, self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.FloatTensor(dones)

        # Compute current Q values
        current_q = self.q_network(states).gather(1, actions.unsqueeze(1))

        # Compute target Q values
        with torch.no_grad():
            next_q = self.target_network(next_states).max(1)[0]
            target_q = rewards + (1 - dones) * self.gamma * next_q

        # Loss
        loss = nn.MSELoss()(current_q.squeeze(), target_q)

        # Optimize
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        # Decay epsilon
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

        return loss.item()

    def update_target_network(self):
        """Copy weights to target network"""
        self.target_network.load_state_dict(self.q_network.state_dict())
```

## Policy Gradient Methods

Directly learn policy π(a|s):

```python
class PolicyNetwork(nn.Module):
    """Policy network for continuous actions"""

    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()

        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh()
        )

        self.mean = nn.Linear(hidden_dim, action_dim)
        self.log_std = nn.Parameter(torch.zeros(action_dim))

    def forward(self, state):
        features = self.network(state)
        mean = self.mean(features)
        std = self.log_std.exp()
        return mean, std

    def sample_action(self, state):
        """Sample action from policy"""
        mean, std = self.forward(state)
        dist = torch.distributions.Normal(mean, std)
        action = dist.sample()
        log_prob = dist.log_prob(action).sum(dim=-1)
        return action, log_prob


class REINFORCE:
    """REINFORCE policy gradient algorithm"""

    def __init__(self, state_dim, action_dim, learning_rate=1e-3, gamma=0.99):
        self.policy = PolicyNetwork(state_dim, action_dim)
        self.optimizer = optim.Adam(self.policy.parameters(), lr=learning_rate)
        self.gamma = gamma

        self.saved_log_probs = []
        self.rewards = []

    def select_action(self, state):
        """Select action from policy"""
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        action, log_prob = self.policy.sample_action(state_tensor)

        self.saved_log_probs.append(log_prob)

        return action.squeeze(0).detach().numpy()

    def store_reward(self, reward):
        """Store reward for current step"""
        self.rewards.append(reward)

    def train(self):
        """Update policy using collected episode"""
        # Compute returns
        returns = []
        R = 0
        for r in reversed(self.rewards):
            R = r + self.gamma * R
            returns.insert(0, R)

        returns = torch.FloatTensor(returns)

        # Normalize returns
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)

        # Compute policy loss
        policy_loss = []
        for log_prob, R in zip(self.saved_log_probs, returns):
            policy_loss.append(-log_prob * R)

        policy_loss = torch.stack(policy_loss).sum()

        # Optimize
        self.optimizer.zero_grad()
        policy_loss.backward()
        self.optimizer.step()

        # Clear episode data
        self.saved_log_probs = []
        self.rewards = []

        return policy_loss.item()
```

## Proximal Policy Optimization (PPO)

State-of-the-art policy gradient method:

```python
class PPO:
    """Proximal Policy Optimization"""

    def __init__(self, state_dim, action_dim, learning_rate=3e-4,
                 gamma=0.99, clip_epsilon=0.2, epochs=10, batch_size=64):

        self.policy = PolicyNetwork(state_dim, action_dim)
        self.value_network = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.Tanh(),
            nn.Linear(256, 256),
            nn.Tanh(),
            nn.Linear(256, 1)
        )

        self.optimizer = optim.Adam(
            list(self.policy.parameters()) + list(self.value_network.parameters()),
            lr=learning_rate
        )

        self.gamma = gamma
        self.clip_epsilon = clip_epsilon
        self.epochs = epochs
        self.batch_size = batch_size

        self.memory = []

    def select_action(self, state):
        """Select action and compute value"""
        state_tensor = torch.FloatTensor(state).unsqueeze(0)

        with torch.no_grad():
            action, log_prob = self.policy.sample_action(state_tensor)
            value = self.value_network(state_tensor)

        return action.squeeze(0).numpy(), log_prob.item(), value.item()

    def store_transition(self, state, action, reward, next_state, done, log_prob, value):
        """Store transition"""
        self.memory.append((state, action, reward, next_state, done, log_prob, value))

    def train(self):
        """Train using PPO"""
        if len(self.memory) < self.batch_size:
            return

        # Extract batch
        states, actions, rewards, next_states, dones, old_log_probs, values = zip(*self.memory)

        states = torch.FloatTensor(states)
        actions = torch.FloatTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.FloatTensor(dones)
        old_log_probs = torch.FloatTensor(old_log_probs)

        # Compute advantages
        with torch.no_grad():
            next_values = self.value_network(next_states).squeeze()
            returns = rewards + (1 - dones) * self.gamma * next_values
            advantages = returns - torch.FloatTensor(values)

        # PPO update
        for _ in range(self.epochs):
            # Recompute log probs and values
            means, stds = self.policy(states)
            dist = torch.distributions.Normal(means, stds)
            new_log_probs = dist.log_prob(actions).sum(dim=-1)
            new_values = self.value_network(states).squeeze()

            # Ratio
            ratio = (new_log_probs - old_log_probs).exp()

            # Clipped surrogate objective
            surr1 = ratio * advantages
            surr2 = torch.clamp(ratio, 1 - self.clip_epsilon, 1 + self.clip_epsilon) * advantages
            policy_loss = -torch.min(surr1, surr2).mean()

            # Value loss
            value_loss = nn.MSELoss()(new_values, returns)

            # Total loss
            loss = policy_loss + 0.5 * value_loss

            # Optimize
            self.optimizer.zero_grad()
            loss.backward()
            self.optimizer.step()

        # Clear memory
        self.memory = []

        return loss.item()
```

## Training Loop

```python
def train_robot_rl(env, agent, num_episodes=1000, max_steps=200):
    """Generic RL training loop"""

    episode_rewards = []

    for episode in range(num_episodes):
        state = env.reset()
        episode_reward = 0

        for step in range(max_steps):
            # Select action
            action = agent.choose_action(state)

            # Execute action
            next_state, reward, done, info = env.step(action)

            # Store transition
            agent.store_transition(state, action, reward, next_state, done)

            # Train
            if hasattr(agent, 'train'):
                loss = agent.train()

            episode_reward += reward
            state = next_state

            if done:
                break

        episode_rewards.append(episode_reward)

        # Update target network (DQN)
        if hasattr(agent, 'update_target_network') and episode % 10 == 0:
            agent.update_target_network()

        # Logging
        if episode % 100 == 0:
            avg_reward = np.mean(episode_rewards[-100:])
            print(f"Episode {episode}, Avg Reward: {avg_reward:.2f}")

    return episode_rewards
```

## Key Takeaways

:::tip Summary
- **RL framework**: Agent learns from rewards through environment interaction
- **MDPs** formalize robot decision-making problems
- **Q-learning** learns action-value functions (discrete actions)
- **DQN** scales Q-learning with deep networks and experience replay
- **Policy gradients** directly optimize policy parameters
- **PPO** is current state-of-the-art for robot learning
:::

## Practice Exercises

1. **Q-Learning Navigation**: Implement Q-learning for grid-world navigation.

2. **DQN Reaching**: Train DQN agent to reach target positions.

3. **PPO Locomotion**: Train quadruped robot to walk using PPO.

4. **Sim-to-Real**: Transfer learned policy from simulation to real robot.

## Further Reading

- Sutton & Barto "Reinforcement Learning: An Introduction"
- Schulman et al. "Proximal Policy Optimization"
- Lillicrap et al. "Continuous Control with Deep RL"
- OpenAI Spinning Up in Deep RL

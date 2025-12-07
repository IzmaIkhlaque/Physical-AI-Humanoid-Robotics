# Data Model: Physical AI & Humanoid Robotics Textbook

**Date**: 2025-12-05
**Feature**: 001-physical-ai-textbook

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐
│     users       │       │    user_prefs       │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │──────<│ user_id (FK, PK)    │
│ email           │       │ level               │
│ password_hash   │       │ hardware_access     │
│ created_at      │       │ updated_at          │
│ updated_at      │       └─────────────────────┘
└─────────────────┘
        │
        │
        ▼
┌─────────────────┐
│  chat_sessions  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ created_at      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  chat_messages  │
├─────────────────┤
│ id (PK)         │
│ session_id (FK) │
│ role            │
│ content         │
│ context_used    │
│ created_at      │
└─────────────────┘
```

## Entities

### 1. User

Represents a registered user of the textbook platform.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Password minimum 8 characters before hashing
- Email uniqueness enforced at database level

### 2. UserPreference

Stores user learning preferences collected during signup.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| user_id | UUID | PK, FK → users.id | Links to user |
| level | ENUM | NOT NULL | 'beginner', 'intermediate', 'advanced' |
| hardware_access | TEXT | NULLABLE, MAX 500 chars | Optional hardware description |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last preference update |

**Validation Rules**:
- Level must be one of: beginner, intermediate, advanced
- Hardware access maximum 500 characters
- One-to-one relationship with User (same PK)

### 3. ChatSession

Groups chat messages for a user's conversation session.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Session identifier |
| user_id | UUID | FK → users.id, NOT NULL | Session owner |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session start time |

**Validation Rules**:
- User must be authenticated to create session
- Sessions are never deleted (for analytics)

### 4. ChatMessage

Stores individual messages in a chat conversation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Message identifier |
| session_id | UUID | FK → chat_sessions.id, NOT NULL | Parent session |
| role | ENUM | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message content |
| context_used | JSONB | NULLABLE | RAG context snippets used |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Message timestamp |

**Validation Rules**:
- Role must be 'user' or 'assistant'
- Content cannot be empty
- context_used stores array of relevant lesson excerpts

## Static Content Structure (File-Based)

The following entities are managed as static files, not database records:

### Lesson (MDX Files)

Location: `/docs/part{N}/chapter{M}/lesson{L}.md`

**Frontmatter Schema**:
```yaml
---
sidebar_position: 1
title: "Lesson Title"
description: "Brief description for SEO"
keywords: [keyword1, keyword2]
---
```

**Content Structure**:
```markdown
# Lesson Title

## Recap
- Point 1 from previous lesson
- Point 2 from previous lesson
- Point 3 from previous lesson

## Main Content
[800-1200 words of beginner-friendly content]

### Code Example
```python
# Example code
```

### Activity 1
[Interactive activity description]

### Activity 2
[Second activity if applicable]

## Diagram
![Diagram description](/img/part{N}/chapter{M}/lesson{L}-diagram.svg)

## Quiz (Optional)

<details>
<summary>Test Your Knowledge</summary>

1. Question 1?
   - [ ] Option A
   - [x] Option B (correct)
   - [ ] Option C
   - [ ] Option D

[... 10 MCQs total]

</details>

---
[← Previous](./lesson{L-1}.md) | [Next →](./lesson{L+1}.md)
```

### Part (Category)

Location: `/docs/part{N}/_category_.json`

```json
{
  "label": "Part 1: Introduction to Physical AI",
  "position": 1,
  "collapsible": true,
  "collapsed": false
}
```

### Chapter (Category)

Location: `/docs/part{N}/chapter{M}/_category_.json`

```json
{
  "label": "Chapter 1: What is Physical AI?",
  "position": 1,
  "collapsible": true,
  "collapsed": true
}
```

## Neon PostgreSQL Schema

```sql
-- File: backend/db/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- User level enum
CREATE TYPE user_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- User preferences table
CREATE TABLE user_prefs (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    level user_level NOT NULL DEFAULT 'beginner',
    hardware_access TEXT CHECK (char_length(hardware_access) <= 500),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on user_id for session lookups
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Chat message role enum
CREATE TYPE message_role AS ENUM ('user', 'assistant');

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    context_used JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on session_id for message retrieval
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_prefs table
CREATE TRIGGER update_user_prefs_updated_at
    BEFORE UPDATE ON user_prefs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Vector Database Schema (Qdrant)

Collection: `textbook_lessons`

```json
{
  "name": "textbook_lessons",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "part": "integer",
    "chapter": "integer",
    "lesson": "integer",
    "title": "keyword",
    "content_chunk": "text",
    "chunk_index": "integer"
  }
}
```

**Indexing Strategy**:
- Split each lesson into ~500 token chunks
- Generate embeddings using OpenAI text-embedding-3-small
- Store with metadata for context retrieval

## State Transitions

### User Authentication State

```
[Anonymous] --signup--> [Registered]
[Registered] --login--> [Authenticated]
[Authenticated] --logout--> [Anonymous]
[Authenticated] --token_expired--> [Anonymous]
```

### Chat Session State

```
[None] --user_opens_chat--> [Active Session]
[Active Session] --30min_inactivity--> [Archived]
[Active Session] --user_sends_message--> [Active Session]
```

## Data Retention

| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| User accounts | Indefinite | Required for authentication |
| User preferences | Indefinite | Required for personalization |
| Chat sessions | 90 days | Analytics and debugging |
| Chat messages | 90 days | Analytics and debugging |

## Privacy Considerations

- Passwords are hashed with bcrypt (cost factor 12)
- Email addresses are not shared externally
- Chat history is user-specific and not visible to others
- No tracking cookies beyond authentication
- Hardware access field is optional and user-controlled

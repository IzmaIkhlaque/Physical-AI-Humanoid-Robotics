
// Simulated user database
const USERS_DB_KEY = 'physical_ai_textbook_users_db';

// Basic in-memory password hashing (for simulation only)
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

export function getUsersDB(): Record<string, { user: any; passwordHash: string }> {
  try {
    const db = localStorage.getItem(USERS_DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch {
    return {};
  }
}

export function saveUsersDB(db: Record<string, any>) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
}

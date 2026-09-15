import { DEMO_USERS } from "@/repositories/mock/demo-data";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string; // stored hashed or plain for demo
  bio?: string;
  location?: string;
  website?: string;
}

// Initialize with DEMO_USERS, giving them fake emails and passwords for demo mode login
const initialMockUsers: MockUser[] = DEMO_USERS.map((u, i) => ({
  ...u,
  email: `${u.id}@example.com`,
  password: "password123", // default mock password
}));

// Global variable to persist in memory across hot reloads in dev
const globalForMockDb = global as unknown as { mockDb_users: MockUser[] };

export const mockDb = {
  users: globalForMockDb.mockDb_users || initialMockUsers,
};

if (process.env.NODE_ENV !== "production") {
  globalForMockDb.mockDb_users = mockDb.users;
}

export const getMockUserByEmail = (email: string) => {
  return mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getMockUserById = (id: string) => {
  return mockDb.users.find(u => u.id === id);
};

export const createMockUser = (user: Omit<MockUser, "id">) => {
  const newUser = {
    ...user,
    id: `usr-mock-${Date.now()}`
  };
  mockDb.users.push(newUser);
  return newUser;
};

export const updateMockUser = (id: string, updates: Partial<MockUser>) => {
  const index = mockDb.users.findIndex(u => u.id === id);
  if (index !== -1) {
    mockDb.users[index] = { ...mockDb.users[index], ...updates };
    return mockDb.users[index];
  }
  return null;
};

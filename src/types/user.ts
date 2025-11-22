import { Timestamp } from 'firebase/firestore';

/**
 * User entity - represents a family member
 */
export interface User {
  uid: string;
  familyId: string;
  email: string | null;
  name: string;
  isAdmin: boolean;
  createdAt: Timestamp;
  lastActive: Timestamp;
  avatarUrl?: string | null;
  displayName?: string | null;
  phoneNumber?: string;
  dateOfBirth?: Timestamp;
  notificationToken?: string;
  status?: 'active' | 'inactive' | 'pending';
  joinedAt?: Timestamp;
}

/**
 * Type guards for runtime type checking
 */
export const isUser = (data: any): data is User => {
  return data && typeof data.userId === 'string' && typeof data.familyId === 'string';
};

/**
 * Helper types for creating new documents (without generated IDs and timestamps)
 */
export type NewUser = Omit<User, 'userId' | 'createdAt' | 'lastActive' | 'joinedAt'>;

/**
 * Helper types for partial updates
 */
export type UpdateUser = Partial<Omit<User, 'userId' | 'createdAt'>> & { lastActive: Timestamp };

import { Timestamp } from 'firebase/firestore';

/**
 * Group entity - represents a user group within a family
 * Users can belong to zero or more groups
 * Categories can belong to zero or more groups
 */
export interface Group {
  groupId: string;
  familyId: string;
  name: string;
  createdBy: string; // userId
  createdAt: Timestamp;
  updatedAt: Timestamp;
  color?: string;
  icon?: string;
  memberIds: string[]; // Array of userIds
  categoryIds: string[]; // Array of categoryIds (denormalized)
  memberCount?: number;
  isArchived?: boolean;
}

/**
 * Helper types for creating new documents (without generated IDs and timestamps)
 */
export type NewGroup = Omit<Group, 'groupId' | 'createdAt' | 'updatedAt'>;

/**
 * Helper types for partial updates
 */
export type UpdateGroup = Partial<Omit<Group, 'groupId' | 'createdAt'>> & { updatedAt: Timestamp };

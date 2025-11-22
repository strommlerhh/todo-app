import { Timestamp } from 'firebase/firestore';

/**
 * Category entity - can belong to multiple groups
 */
export interface Category {
  categoryId: string;
  familyId: string;
  groupIds: string[]; // Array of groupIds this category belongs to
  name: string;
  createdBy: string; // userId
  createdAt: Timestamp;
  updatedAt: Timestamp;
  color?: string;
  icon?: string;
  sortOrder?: number;
  isArchived?: boolean;
  todoCount?: number;
}

/**
 * Helper types for creating new documents (without generated IDs and timestamps)
 */
export type NewCategory = Omit<Category, 'categoryId' | 'createdAt' | 'updatedAt'>;

/**
 * Helper types for partial updates
 */
export type UpdateCategory = Partial<Omit<Category, 'categoryId' | 'createdAt'>> & { updatedAt: Timestamp };

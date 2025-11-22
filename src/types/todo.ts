import {Timestamp} from 'firebase/firestore';
import {Subtask} from "./subtask.ts";

/**
 * Todo entity - the main task item
 */
export interface Todo {
    todoId: string;
    userId: string; // Creator
    familyId: string;
    categoryId: string | null;
    hasGroups: boolean;
    groupIds: string[]; // Empty array = visible to all family members
    description: string;
    effortLevel: number; // 1-5, required for statistics
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isCompleted: boolean;
    completedAt?: Timestamp;
    completedBy?: string; // userId who completed it
    dueDate?: Timestamp | null;
    priority?: 'low' | 'medium' | 'high';
    subtasks?: Subtask[];
    reminderTime?: Timestamp | null;
    recurrence?: {
        type: 'daily' | 'weekly' | 'monthly';
        interval: number;
    } | null;
    attachments?: string[]; // URLs
    tags?: string[];
    notes?: string | null;
}

/**
 * Type guards for runtime type checking
 */
export const isTodo = (data: any): data is Todo => {
    return (
        data &&
        typeof data.todoId === 'string' &&
        typeof data.text === 'string' &&
        typeof data.effortLevel === 'number'
    );
};

/**
 * Helper types for creating new documents (without generated IDs and timestamps)
 */
export type NewTodo = Omit<Todo, 'todoId' | 'createdAt' | 'updatedAt' | 'completedAt' | 'isCompleted' | 'hasGroups'>;

/**
 * Helper types for partial updates
 */
export type UpdateTodo = Partial<Omit<Todo, 'todoId' | 'createdAt'>> & { updatedAt: Timestamp };

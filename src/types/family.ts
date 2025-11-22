import {Timestamp} from 'firebase/firestore';

/**
 * Family entity - represents a family unit
 */
export interface Family {
    familyId: string;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    avatarUrl?: string;
    description?: string;
    memberCount?: number;
}

/**
 * Helper types for creating new documents (without generated IDs and timestamps)
 */
export type NewFamily = Omit<Family, 'familyId' | 'createdAt' | 'updatedAt'>;

/**
 * Helper types for partial updates
 */
export type UpdateFamily = Partial<Omit<Family, 'familyId' | 'createdAt'>> & { updatedAt: Timestamp };


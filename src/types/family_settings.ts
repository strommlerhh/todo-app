import { Timestamp } from 'firebase/firestore';

/**
 * FamilySettings entity - family-wide settings
 */
export interface FamilySettings {
  familyId: string; // Document ID
  updatedAt: Timestamp;
  defaultTodoPriority?: 'low' | 'medium' | 'high';
  autoArchiveCompletedAfterDays?: number;
}

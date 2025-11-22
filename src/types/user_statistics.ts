import {Timestamp} from 'firebase/firestore';
import {MonthlyStats} from "./montly_stats.ts";
import {CategoryGroupStats} from "./category_group_stats.ts";
import {WeeklyStats} from "./weekly_stats.ts";


/**
 * UserStatistics entity - tracks completion stats per user
 */
export interface UserStatistics {
    userStatsId: string; // Format: {familyId}_{userId}
    userId: string;
    familyId: string;
    totalCompleted: number;
    totalEffortPoints: number;
    lastUpdated: Timestamp;
    completedByWeek?: Record<string, WeeklyStats>; // "2025-44": {count: 5, effort: 15}
    completedByMonth?: Record<string, MonthlyStats>; // "2025-11": {count: 5, effort: 15}
    completedByCategory?: Record<string, CategoryGroupStats>; // categoryId: {count: X, effort: Y}
    completedByGroup?: Record<string, CategoryGroupStats>; // groupId: {count: X, effort: Y}
    currentStreak?: number;
    longestStreak?: number;
    averageEffortLevel?: number;
}

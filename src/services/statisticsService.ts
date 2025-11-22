import {
    collection,
    doc,
    getAggregateFromServer,
    getCountFromServer,
    getDoc,
    getDocs,
    increment,
    query,
    serverTimestamp,
    setDoc,
    sum,
    updateDoc,
    where,
} from 'firebase/firestore';
import {db} from '../firebase';
import {UserStatistics} from "../types/user_statistics.ts";

const COLLECTION_NAME = 'userStatistics';

export const statisticsService = {
    // Get user statistics
    async getUserStatistics(familyId: string, userId: string): Promise<UserStatistics | null> {
        const statsId = `${familyId}_${userId}`;
        const docRef = doc(db, COLLECTION_NAME, statsId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {userStatsId: docSnap.id, ...docSnap.data()} as UserStatistics;
        }
        return null;
    },

    // Initialize user statistics
    async initializeUserStatistics(familyId: string, userId: string): Promise<void> {
        const statsId = `${familyId}_${userId}`;
        await setDoc(doc(db, COLLECTION_NAME, statsId), {
            userStatsId: statsId,
            userId,
            familyId,
            totalCompleted: 0,
            totalEffortPoints: 0,
            lastUpdated: serverTimestamp(),
            completedByMonth: {},
            completedByCategory: {},
            completedByGroup: {},
            currentStreak: 0,
            longestStreak: 0,
            averageEffortLevel: 0,
        });
    },

    // Update statistics when todo is completed
    async incrementStatistics(
        familyId: string,
        userId: string,
        effortLevel: number,
        categoryId: string | null,
        groupIds: string[]
    ): Promise<void> {
        const statsId = `${familyId}_${userId}`;
        const docRef = doc(db, COLLECTION_NAME, statsId);

        // Get current month key
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Update statistics
        const updates: any = {
            totalCompleted: increment(1),
            totalEffortPoints: increment(effortLevel),
            lastUpdated: serverTimestamp(),
            [`completedByMonth.${monthKey}.count`]: increment(1),
            [`completedByMonth.${monthKey}.effort`]: increment(effortLevel),
        };

        if (categoryId) {
            updates[`completedByCategory.${categoryId}.count`] = increment(1);
            updates[`completedByCategory.${categoryId}.effort`] = increment(effortLevel);
        }

        groupIds.forEach(groupId => {
            updates[`completedByGroup.${groupId}.count`] = increment(1);
            updates[`completedByGroup.${groupId}.effort`] = increment(effortLevel);
        });

        await updateDoc(docRef, updates);
    },

    // Recalculate statistics from todos (for data correction)
    async recalculateUserStatistics(familyId: string, userId: string): Promise<void> {
        const todosRef = collection(db, 'todos');
        const q = query(
            todosRef,
            where('familyId', '==', familyId),
            where('completedBy', '==', userId),
            where('isCompleted', '==', true)
        );

        const countSnapshot = await getCountFromServer(q);
        const aggSnapshot = await getAggregateFromServer(q, {
            totalEffort: sum('effortLevel'),
        });

        const statsId = `${familyId}_${userId}`;
        await updateDoc(doc(db, COLLECTION_NAME, statsId), {
            totalCompleted: countSnapshot.data().count,
            totalEffortPoints: aggSnapshot.data().totalEffort || 0,
            lastUpdated: serverTimestamp(),
        });
    },

    // Get all family statistics
    async getFamilyStatistics(familyId: string): Promise<UserStatistics[]> {
        const q = query(collection(db, COLLECTION_NAME), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            userStatsId: doc.id,
            ...doc.data(),
        } as UserStatistics));
    },
};

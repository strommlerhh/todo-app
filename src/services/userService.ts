import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import {db} from '../firebase';
import {NewUser, UpdateUser, User} from "../types/user.ts";

const COLLECTION_NAME = 'users';

export const userService = {
    // Create user (with custom userId from Firebase Auth)
    async createUser(userId: string, userData: NewUser): Promise<void> {
        await setDoc(doc(db, COLLECTION_NAME, userId), {
            ...userData,
            userId,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
            joinedAt: serverTimestamp(),
        });
    },

    // Get user by ID
    async getUser(userId: string): Promise<User | null> {
        console.log("getting user", userId);
        try {
            const docRef = doc(db, COLLECTION_NAME, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("found user", userId);
                return {uid: docSnap.id, ...docSnap.data()} as User;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    },

    // Update user
    async updateUser(userId: string, updates: Partial<UpdateUser>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, userId);
        await updateDoc(docRef, {
            ...updates,
            lastActive: serverTimestamp(),
        });
    },

    // Delete user
    async deleteUser(userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, userId);
        await deleteDoc(docRef);
    },

    // Get all users in a family
    async getFamilyUsers(familyId: string): Promise<User[]> {
        const q = query(collection(db, COLLECTION_NAME), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
        } as User));
    },

    // Get family admins
    async getFamilyAdmins(familyId: string): Promise<User[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            where('isAdmin', '==', true)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
        } as User));
    },
};

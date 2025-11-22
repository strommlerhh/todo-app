import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import {db} from '../firebase';
import {Category, NewCategory, UpdateCategory} from "../types/category.ts";

const COLLECTION_NAME = 'categories';

export const categoryService = {
    // Create category
    async createCategory(categoryData: NewCategory): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...categoryData,
            groupIds: categoryData.groupIds || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Get category by ID
    async getCategory(categoryId: string): Promise<Category | null> {
        const docRef = doc(db, COLLECTION_NAME, categoryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {categoryId: docSnap.id, ...docSnap.data()} as Category;
        }
        return null;
    },

    // Update category
    async updateCategory(categoryId: string, updates: Partial<UpdateCategory>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, categoryId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete category
    async deleteCategory(categoryId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, categoryId);
        await deleteDoc(docRef);
    },

    // Get all categories in a family
    async getFamilyCategories(familyId: string): Promise<Category[]> {
        const q = query(collection(db, COLLECTION_NAME), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            categoryId: doc.id,
            ...doc.data(),
        } as Category));
    },

    // Get categories for a specific group
    async getGroupCategories(groupId: string, familyId: string): Promise<Category[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            where('groupIds', 'array-contains', groupId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            categoryId: doc.id,
            ...doc.data(),
        } as Category));
    },

    // Add group to category
    async addGroupToCategory(categoryId: string, groupId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, categoryId);
        await updateDoc(docRef, {
            groupIds: arrayUnion(groupId),
            updatedAt: serverTimestamp(),
        });
    },

    // Remove group from category
    async removeGroupFromCategory(categoryId: string, groupId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, categoryId);
        await updateDoc(docRef, {
            groupIds: arrayRemove(groupId),
            updatedAt: serverTimestamp(),
        });
    },
};

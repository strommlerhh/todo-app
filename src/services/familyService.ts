import {
    addDoc,
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
import {Family, NewFamily, UpdateFamily} from "../types/family.ts";

const COLLECTION_NAME = 'families';

export const familyService = {
    // Create a new family
    async createFamily(familyData: NewFamily): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...familyData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Get family by ID
    async getFamily(familyId: string): Promise<Family | null> {
        const docRef = doc(db, COLLECTION_NAME, familyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {familyId: docSnap.id, ...docSnap.data()} as Family;
        }
        return null;
    },

    // Update family
    async updateFamily(familyId: string, updates: Partial<UpdateFamily>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, familyId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete family
    async deleteFamily(familyId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, familyId);
        await deleteDoc(docRef);
    },

    // Get family by invite code
    async getFamilyByInviteCode(inviteCode: string): Promise<Family | null> {
        const q = query(collection(db, COLLECTION_NAME), where('inviteCode', '==', inviteCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return {familyId: docSnap.id, ...docSnap.data()} as Family;
        }
        return null;
    },
};

import {doc, getDoc, serverTimestamp, setDoc, updateDoc,} from 'firebase/firestore';
import {db} from '../firebase';
import {UserSettings} from "../types/user_settings.ts";
import {FamilySettings} from "../types/family_settings.ts";

export const settingsService = {
    // User Settings
    async getUserSettings(userId: string): Promise<UserSettings | null> {
        const docRef = doc(db, 'userSettings', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {userId: docSnap.id, ...docSnap.data()} as UserSettings;
        }
        return null;
    },

    async createUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
        await setDoc(doc(db, 'userSettings', userId), {
            userId,
            ...settings,
            updatedAt: serverTimestamp(),
        });
    },

    async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<void> {
        const docRef = doc(db, 'userSettings', userId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },

    // Family Settings
    async getFamilySettings(familyId: string): Promise<FamilySettings | null> {
        const docRef = doc(db, 'familySettings', familyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {familyId: docSnap.id, ...docSnap.data()} as FamilySettings;
        }
        return null;
    },

    async createFamilySettings(familyId: string, settings: Partial<FamilySettings>): Promise<void> {
        await setDoc(doc(db, 'familySettings', familyId), {
            familyId,
            ...settings,
            updatedAt: serverTimestamp(),
        });
    },

    async updateFamilySettings(familyId: string, updates: Partial<FamilySettings>): Promise<void> {
        const docRef = doc(db, 'familySettings', familyId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },
};

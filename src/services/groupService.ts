import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import {db} from '../firebase';
import {Group, NewGroup, UpdateGroup} from "../types/group.ts";
import firebase from "firebase/compat/app";
import Unsubscribe = firebase.Unsubscribe;


const COLLECTION_NAME = 'groups';

export const groupService = {
    // Create group
    async createGroup(groupData: NewGroup): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...groupData,
            memberIds: groupData.memberIds || [],
            categoryIds: groupData.categoryIds || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Get group by ID
    async getGroup(groupId: string): Promise<Group | null> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {groupId: docSnap.id, ...docSnap.data()} as Group;
        }
        return null;
    },

    // Update group
    async updateGroup(groupId: string, updates: Partial<UpdateGroup>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete group
    async deleteGroup(groupId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await deleteDoc(docRef);
    },

    // Get all groups in a family
    async getFamilyGroups(familyId: string): Promise<Group[]> {
        const q = query(collection(db, COLLECTION_NAME), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            groupId: doc.id,
            ...doc.data(),
        } as Group));
    },

    // Get groups for a specific user
    getUserGroups(userId: string, familyId: string, callback: (userGroups: Group[]) => void): Unsubscribe {
        console.log("getting userGroups for userId", userId);
        const q = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            where('memberIds', 'array-contains', userId)
        );

        return onSnapshot(q, querySnapshot => {
            const userGroups =
                querySnapshot.docs.map(doc => ({groupId: doc.id, ...doc.data()} as Group));
            callback(userGroups);
            console.log("userGroups", userGroups);
        });
    },

    // Add user to group
    async addMemberToGroup(groupId: string, userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await updateDoc(docRef, {
            memberIds: arrayUnion(userId),
            updatedAt: serverTimestamp(),
        });
    },

    // Remove user from group
    async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await updateDoc(docRef, {
            memberIds: arrayRemove(userId),
            updatedAt: serverTimestamp(),
        });
    },

    // Add category to group
    async addCategoryToGroup(groupId: string, categoryId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await updateDoc(docRef, {
            categoryIds: arrayUnion(categoryId),
            updatedAt: serverTimestamp(),
        });
    },

    // Remove category from group
    async removeCategoryFromGroup(groupId: string, categoryId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, groupId);
        await updateDoc(docRef, {
            categoryIds: arrayRemove(categoryId),
            updatedAt: serverTimestamp(),
        });
    },
};

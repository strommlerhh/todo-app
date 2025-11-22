import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import {db} from '../firebase';
import {NewTodo, Todo, UpdateTodo} from "../types/todo.ts";
import firebase from "firebase/compat/app";
import Unsubscribe = firebase.Unsubscribe;

const COLLECTION_NAME = 'todos';

export const todoService = {
    // Create todo
    async createTodo(todoData: NewTodo): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...todoData,
            hasGroups: todoData.groupIds.length > 0,
            groupIds: todoData.groupIds || [],
            isCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Get todo by ID
    async getTodo(todoId: string): Promise<Todo | null> {
        const docRef = doc(db, COLLECTION_NAME, todoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {todoId: docSnap.id, ...docSnap.data()} as Todo;
        }
        return null;
    },

    // Update todo
    async updateTodo(todoId: string, updates: Partial<UpdateTodo>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, todoId);
        await updateDoc(docRef, {
            ...updates,
            hasGroups: updates.groupIds && updates.groupIds.length > 0,
            updatedAt: serverTimestamp(),
        });
    },

    // Complete todo
    async completeTodo(todoId: string, completedBy: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, todoId);
        await updateDoc(docRef, {
            isCompleted: true,
            completedAt: serverTimestamp(),
            completedBy,
            updatedAt: serverTimestamp(),
        });
    },

    // Uncomplete todo
    async uncompleteTodo(todoId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, todoId);
        await updateDoc(docRef, {
            isCompleted: false,
            completedAt: null,
            completedBy: null,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete todo
    async deleteTodo(todoId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, todoId);
        await deleteDoc(docRef);
    },

    // Get all todos in a family
    async getFamilyTodos(familyId: string): Promise<Todo[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            todoId: doc.id,
            ...doc.data(),
        } as Todo));
    },

    getUserVisibleTodos(familyId: string, userGroupIds: string[], callback: (todos: Todo[]) => void): Unsubscribe {
        console.log("getUserVisibleTodos", familyId, userGroupIds);

        let noGroupTodos: Todo[] = [];
        let groupTodos: Todo[] = [];

        // Function to merge and send results
        const sendCombinedResults = () => {
            const allTodos = [...noGroupTodos, ...groupTodos];
            const uniqueTodos = Array.from(
                new Map(allTodos.map(todo => [todo.todoId, todo])).values()
            ).sort((a, b) =>
                (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis()
            );
            callback(uniqueTodos);
            console.log("Combined todos:", uniqueTodos);
        };

        // Listener 1: No-group todos
        const noGroupQuery = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            where('hasGroups', '==', false),
            orderBy('createdAt', 'desc')
        );

        const unsubscribeNoGroupTodos = onSnapshot(noGroupQuery, querySnapshot => {
            noGroupTodos = querySnapshot.docs.map(doc => ({
                todoId: doc.id,
                ...doc.data()
            } as Todo));
            console.log("noGroupTodos", noGroupTodos);
            sendCombinedResults();
        });

        // Listener 2: Group todos (if user has groups)
        let unsubscribeGroupTodos: Unsubscribe = () => {
        };

        if (userGroupIds.length > 0) {
            const groupQuery = query(
                collection(db, COLLECTION_NAME),
                where('familyId', '==', familyId),
                where('groupIds', 'array-contains-any', userGroupIds.slice(0, 10)),
                orderBy('createdAt', 'desc')
            );

            unsubscribeGroupTodos = onSnapshot(groupQuery, querySnapshot => {
                groupTodos = querySnapshot.docs.map(doc => ({
                    todoId: doc.id,
                    ...doc.data()
                } as Todo));
                console.log("groupTodos", groupTodos);
                sendCombinedResults();
            });
        }

        // Return combined unsubscribe function
        return () => {
            unsubscribeNoGroupTodos();
            unsubscribeGroupTodos();
        };
    },

    // Get todos by category
    async getCategoryTodos(categoryId: string): Promise<Todo[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('categoryId', '==', categoryId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            todoId: doc.id,
            ...doc.data(),
        } as Todo));
    },

    // Get completed todos
    async getCompletedTodos(familyId: string): Promise<Todo[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('familyId', '==', familyId),
            where('isCompleted', '==', true),
            orderBy('completedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            todoId: doc.id,
            ...doc.data(),
        } as Todo));
    },
};

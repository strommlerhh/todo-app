import React, {useEffect, useState} from 'react';
import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth} from './firebase';
import './App.css';
import {User} from "./types/user.ts";
import {NewTodo, Todo} from "./types/todo.ts";
import {userService} from "./services/userService.ts";
import {todoService} from "./services/todoService.ts";
import {groupService} from "./services/groupService.ts";
import {Group} from "./types/group.ts";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    // const [showPrivateOnly, setShowPrivateOnly] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await currentUser.getIdToken(true);
                const user = await userService.getUser(currentUser.uid);
                console.log("authenticated: ", user);
                // Check if user is admin
                const tokenResult = await currentUser.getIdTokenResult();
                setUser(user);
                setIsAdmin(tokenResult.claims.admin === true);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = groupService.getUserGroups(user.uid, user.familyId, setUserGroups);
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!user || !userGroups) return;
        const groupIds = userGroups.map((group) => group.groupId);
        const unsubscribe = todoService.getUserVisibleTodos(user.familyId, groupIds, setTodos);
        return () => unsubscribe();
    }, [userGroups]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("signing in for " + email);
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
        } catch (error) {
            alert('Error: ' + (error as Error).message);
        }
    };

    const handleLogout = () => signOut(auth);

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !user) return;

        await todoService.createTodo({
            userId: user.uid,
            familyId: user.familyId,
            categoryId: null,
            groupIds: [],
            description: newTodo,
            effortLevel: 1,
            dueDate: null,
            priority: 'low',
            subtasks: [],
            reminderTime: null,
            recurrence: null,
            attachments: [],
            tags: [],
            notes: null
        } as NewTodo);

        setNewTodo('');
    };

    const toggleCompleteTodo = async (todo: Todo) => {
        if (!user) {
            return;
        }

        if (todo.isCompleted) {
            await todoService.uncompleteTodo(todo.todoId)
        } else {
            await todoService.completeTodo(todo.todoId, user.uid);
        }
    };

    // const toggleVisibility = async (todo: Todo) => {
    //     const todoRef = doc(db, 'todos', todo.id);
    //     await updateDoc(todoRef, {
    //         visibility: todo.visibility === 'public' ? 'private' : 'public',
    //         updatedAt: Date.now()
    //     });
    // };

    const deleteTodo = async (id: string) => {
        await todoService.deleteTodo(id);
    };

    // const filteredTodos = todos.filter(todo => {
    //     if (showPrivateOnly) {
    //         return todo.createdBy === user?.email && todo.visibility === 'private';
    //     }
    //     return todo.visibility === 'public' || todo.createdBy === user?.email;
    // });

    if (!user) {
        return (
            <div className="app">
                <div className="auth-container">
                    <h1>Familien To-Do Liste</h1>
                    <form onSubmit={handleAuth}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Anmelden</button>
                    </form>
                </div>
            </div>
        );
    }

    console.log("rendering", todos)
    return (
        <div className="app">
            <header>
                <h1>Familien To-Do Liste</h1>
                <div className="user-info">
                    <span>{user.email}</span>
                    {isAdmin && <span className="admin-badge">👑 Admin</span>}
                    <button onClick={handleLogout}>Abmelden</button>
                </div>
            </header>

            {/*<div className="filter-buttons">*/}
            {/*    <button*/}
            {/*        className={!showPrivateOnly ? 'active' : ''}*/}
            {/*        onClick={() => setShowPrivateOnly(false)}*/}
            {/*    >*/}
            {/*        Alle anzeigen*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        className={showPrivateOnly ? 'active' : ''}*/}
            {/*        onClick={() => setShowPrivateOnly(true)}*/}
            {/*    >*/}
            {/*        Nur meine privaten*/}
            {/*    </button>*/}
            {/*</div>*/}

            <form onSubmit={addTodo} className="add-todo">
                <input
                    type="text"
                    placeholder="Neue Aufgabe..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit">Hinzufügen</button>
            </form>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.todoId} className={todo.isCompleted ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => toggleCompleteTodo(todo)}
                        />
                        <span>{todo.description}</span>
                        <div className="todo-meta">
                            {todo.hasGroups &&
                                <ul className={"todo-group-list"}>
                                    {userGroups.filter(g => todo.groupIds.includes(g.groupId)) //
                                        .map(group => (
                                            <li key={group.groupId}>
                                                <span>{group.name}</span>
                                            </li>))}
                                </ul>}
                            <span className={"todo-created-by"}>von {todo.userId}</span>
                            {/*              <span className={'visibility-badge ' + todo.visibility}>*/}
                            {/*  {todo.visibility === 'public' ? '👥 Öffentlich' : '🔒 Privat'}*/}
                            {/*</span>*/}
                        </div>
                        {/*{todo.createdBy === user.email && (*/}
                        {/*    <button*/}
                        {/*        className="visibility-btn"*/}
                        {/*        onClick={() => toggleVisibility(todo)}*/}
                        {/*        title={todo.visibility === 'public' ? 'Als privat markieren' : 'Als öffentlich markieren'}*/}
                        {/*    >*/}
                        {/*        {todo.visibility === 'public' ? '🔒' : '👥'}*/}
                        {/*    </button>*/}
                        {/*)}*/}
                        <button
                            title="delete"
                            onClick={() => deleteTodo(todo.todoId)}>&#128465;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

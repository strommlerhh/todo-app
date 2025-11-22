import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase';
import './App.css';
import {NewTodo, Todo} from "./types/todo.ts";
import {todoService} from "./services/todoService.ts";
import {Header} from "./components/header.tsx";
import {useAuth} from "./hooks/useAuth.ts";
import {useUserGroups} from "./hooks/useUserGroup.ts";
import {useTodos} from "./hooks/useTodos.ts";

function App() {
    const {user, isAdmin} = useAuth();
    const userGroups = useUserGroups(user);
    const todos = useTodos(user, userGroups);

    const [newTodo, setNewTodo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [showPrivateOnly, setShowPrivateOnly] = useState(false);

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
            <Header user={user} isAdmin={isAdmin}/>
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

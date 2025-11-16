import {useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import {Todo, User} from './types';
import './App.css';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName
                });

                // Check if user is admin
                const tokenResult = await currentUser.getIdTokenResult();
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

        const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const todosData: Todo[] = [];
            snapshot.forEach((doc) => {
                todosData.push({id: doc.id, ...doc.data()} as Todo);
            });
            setTodos(todosData);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            setEmail('');
            setPassword('');
        } catch (error) {
            alert('Fehler: ' + (error as Error).message);
        }
    };

    const handleLogout = () => signOut(auth);

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !user) return;

        await addDoc(collection(db, 'todos'), {
            text: newTodo,
            completed: false,
            createdBy: user.email,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        setNewTodo('');
    };

    const toggleTodo = async (todo: Todo) => {
        const todoRef = doc(db, 'todos', todo.id);
        await updateDoc(todoRef, {
            completed: !todo.completed,
            updatedAt: Date.now()
        });
    };

    const deleteTodo = async (id: string) => {
        if (!isAdmin) {
            const todo = todos.find(t => t.id === id);
            if (todo && todo.createdBy !== user?.email) {
                alert('Only admins can delete other users\' todos');
                return;
            }
        }
        await deleteDoc(doc(db, 'todos', id));
    };

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
                        <button type="submit">{isLogin ? 'Anmelden' : 'Registrieren'}</button>
                    </form>
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Noch kein Account? Registrieren' : 'Schon registriert? Anmelden'}
                    </button>
                </div>
            </div>
        );
    }

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
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo)}
                        />
                        <span>{todo.text}</span>
                        <small>von {todo.createdBy}</small>
                        <button onClick={() => deleteTodo(todo.id)}>Löschen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

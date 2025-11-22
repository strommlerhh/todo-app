import React from 'react';
import './App.css';
import {Header} from "./components/header.tsx";
import {useAuth} from "./hooks/useAuth.ts";
import {useUserGroups} from "./hooks/useUserGroup.ts";
import {useTodos} from "./hooks/useTodos.ts";
import {TodoForm} from "./components/todo-form.tsx";
import {TodoList} from "./components/todo-list.tsx";
import {Login} from "./components/login.tsx";

function App() {
    const {user, isAdmin} = useAuth();
    const userGroups = useUserGroups(user);
    const todos = useTodos(user, userGroups);

    return <div className="app">
        {!user && <Login/>}
        {user &&
            <div className="app">
                <Header user={user} isAdmin={isAdmin}/>
                <TodoForm user={user}/>
                <TodoList user={user} todos={todos} userGroups={userGroups}/>
            </div>}
    </div>;
}

export default App;

import {User} from "../types/user.ts";
import React from "react";
import {signOut} from 'firebase/auth';
import {auth} from '../firebase';

interface HeaderProps {
    user: User;
    isAdmin: boolean;
}

const handleLogout = () => signOut(auth);

export const Header: React.FC<HeaderProps> = (props) => {
    return <header>
        <h1>Familien To-Do Liste</h1>
        <div className="user-info">
            <span>{props.user.email}</span>
            {props.isAdmin && <span className="admin-badge">👑 Admin</span>}
            <button onClick={handleLogout}>Abmelden</button>
        </div>
    </header>;
}


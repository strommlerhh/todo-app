import React, {useState} from "react";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../firebase.ts";

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    return <div className="auth-container">
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
    </div>;
}


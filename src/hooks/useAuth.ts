import {useEffect, useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';
import {User} from '../types/user.ts';
import {userService} from '../services/userService.ts';

export const useAuth: () => { user: User | null; isAdmin: boolean } = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await currentUser.getIdToken(true);
                const user = await userService.getUser(currentUser.uid);
                console.log("authenticated: ", user);

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

    return {user, isAdmin};
};

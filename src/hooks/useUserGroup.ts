import {useEffect, useState} from 'react';
import {Group} from '../types/group.ts';
import {groupService} from '../services/groupService.ts';
import {User} from '../types/user.ts';

export const useUserGroups = (user: User | null) => {
    const [userGroups, setUserGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = groupService.getUserGroups(user.uid, user.familyId, setUserGroups);
        return () => unsubscribe();
    }, [user]);

    return userGroups;
};

import {useEffect, useState} from 'react';
import {Todo} from '../types/todo.ts';
import {todoService} from '../services/todoService.ts';
import {User} from '../types/user.ts';
import {Group} from '../types/group.ts';

export const useTodos = (user: User | null, userGroups: Group[]) => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        if (!user || !userGroups) return;

        const groupIds = userGroups.map((group) => group.groupId);
        const unsubscribe = todoService.getUserVisibleTodos(user.familyId, groupIds, setTodos);
        return () => unsubscribe();
    }, [user, userGroups]);

    return todos;
};

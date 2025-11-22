import {User} from "../types/user.ts";
import React, {useState} from "react";
import {todoService} from "../services/todoService.ts";
import {NewTodo} from "../types/todo.ts";

interface TodoFormProps {
    user: User;
}


export const TodoForm: React.FC<TodoFormProps> = (props) => {
    const [newTodo, setNewTodo] = useState('');

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !props.user) return;

        await todoService.createTodo({
            userId: props.user.uid,
            familyId: props.user.familyId,
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

    return <form onSubmit={addTodo} className="add-todo">
        <input
            type="text"
            placeholder="Neue Aufgabe..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Hinzufügen</button>
    </form>
        ;
}


import React from "react";
import {Todo} from "../types/todo.ts";
import {User} from "../types/user.ts";
import {todoService} from "../services/todoService.ts";
import {Group} from "../types/group.ts";

interface TodoProps {
    user: User;
    todos: Todo[];
    userGroups: Group[];
}

export const TodoList: React.FC<TodoProps> = (props) => {
    const toggleCompleteTodo = async (todo: Todo) => {
        if (!props.user) {
            return;
        }

        if (todo.isCompleted) {
            await todoService.uncompleteTodo(todo.todoId)
        } else {
            await todoService.completeTodo(todo.todoId, props.user.uid);
        }
    };

    const deleteTodo = async (id: string) => {
        await todoService.deleteTodo(id);
    };

    return <ul className="todo-list">
        {props.todos.map((todo) => (
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
                            {props.userGroups.filter(g => todo.groupIds.includes(g.groupId)) //
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
        ;
}


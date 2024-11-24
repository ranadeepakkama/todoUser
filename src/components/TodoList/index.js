import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css';

const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [status, setStatus] = useState('');
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const url = 'https://todoserver-k4hr.onrender.com';
    const userId = Cookies.get('user_id');
    const token = Cookies.get('jwt_token');

    const getApiData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/todoList/${userId}`);
            setTodos(response.data.todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApiData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!todo.trim() || !status.trim()) {
            alert('Task and status cannot be empty!');
            return;
        }
        try {
            await axios.post(
                `${url}/todoPost/${userId}`,
                { task: todo, status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodo('');
            setStatus('');
            getApiData();
        } catch (err) {
            console.error('Error creating todo:', err);
        }
    };

    const onClickUpdate = async (id) => {
        try {
            await axios.put(`${url}/updateTodo/${id}`, {
                task: todo,
                status: status
            });
            setEditId(null); // Clear edit mode
            setTodo('');
            setStatus('');
            await getApiData(); 
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const onClickDelete = async (id) => {
        try {
            await axios.delete(`${url}/deleteTodo/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            getApiData();
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    return (
        <div className="todo-container">
            <form onSubmit={handleSubmit} className="text-center p-3">
                <input
                    type="text"
                    placeholder="Enter todo"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    style={{ width: '50vw', marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Enter status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <button type="submit" className="btn btn-primary mb-1">Submit</button>
            </form>

            {loading ? (
                <p className='text-center'>Loading...</p>
            ) : (
                <div className="todo-list">
                {todos.length > 0 ? (
                    <ul>
                        {todos.map((eachItem) => (
                            <li key={eachItem._id}>
                                <div className="todo-item">
                                    <input
                                        style={{ width: '70vw' }}
                                        type="text"
                                        value={eachItem._id === editId ? todo : eachItem.task}
                                        onChange={(e) => setTodo(e.target.value)}
                                    />
                                    <p className='pt-3 text-center' style={{width:'120px'}}>{eachItem.status}</p>
                                    <button type='button' className="icon-btn" onClick={() => onClickDelete(eachItem._id)}><MdOutlineDelete /></button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditId(eachItem._id);
                                            setTodo(eachItem.task); // Set task for editing
                                            setStatus(eachItem.status); // Set status for editing
                                        }}
                                        className="icon-btn"
                                    >
                                        <FaRegEdit />
                                    </button>

                                    {eachItem._id === editId && (
                                        <button
                                            type="button"
                                            onClick={() => onClickUpdate(eachItem._id)}
                                            className="btn btn-secondary"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No todo item is available</p>
                )}
            </div>
            )}
        </div>
    );
};

export default TodoList;

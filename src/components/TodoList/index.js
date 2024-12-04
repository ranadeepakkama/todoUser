import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { Rings } from 'react-loader-spinner'
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css';

const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [status, setStatus] = useState('');
    const [todos, setTodos] = useState([]);
    const [filterTodos, setFilterTodos] = useState([])
    const [editTodo, setEditTodo] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState({})
    const [filter, setFilter] = useState('')
    const url = 'https://todoserver-k4hr.onrender.com';
    const userId = Cookies.get('user_id');
    const token = Cookies.get('jwt_token');

    const getApiData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/todoList/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(response.data.todos);
            setFilterTodos(response.data.todos)
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
        if (!editTodo.trim() || !editStatus.trim()) {
            alert('Task and status cannot be empty!');
            return;
        }
        setLoading(true);
        try {
            await axios.put(
                `${url}/updateTodo/${id}`,
                { task: editTodo, status: editStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditId(null);
            setEditTodo('');
            setEditStatus('');
            getApiData();
        } catch (err) {
            console.error('Error updating todo:', err);
        } finally {
            setLoading(false);
        }
    };

    const onClickDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${url}/deleteTodo/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            getApiData();
        } catch (err) {
            console.error('Error deleting todo:', err);
        } finally {
            setLoading(false);
        }
    };

    const onChangeCheckbox = async (id) => {
        setCheckedTasks((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    
        if (id) {
            try {
                await axios.put(
                    `${url}/updateTodo/${userId}`,
                    { status: 'done' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                getApiData();
            } catch (err) {
                console.error('Error updating todo status:', err);
            }
        } else {
            console.error('Task ID is required for updating status.');
        }
    };
    

    const onChangeFilter = e => {
        const filterData = e.target.value;
        setFilter(filterData)
        if (filterData){
            const result  = todos.filter(data => data.status === filterData)
            setFilterTodos(result)
        }else{
            setFilterTodos(todos)
        }
    }
    return (
        <div className="todo-container">
            <form onSubmit={handleSubmit} className="text-center p-3" style={{fontFamily:'serif'}}>
                <input
                    className="todo-input"
                    type="text"
                    placeholder="Enter todo"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    style={{ width: '50vw', marginRight: '10px' }}
                />
                <select
                    name="status"
                    className="todo-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Select Status</option>
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                </select>

                <button type="submit" className="btn btn-primary mb-1">
                    Submit
                </button>
                    <select
                        name="filter"
                        className="filter-input"
                        value={filter}
                        onChange={onChangeFilter}
                    >
                        <option value="">Filter by Status</option>
                        <option value="done">Done</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                    </select>
            </form>
            <div className='todo-list-container'>
                {loading ? (
                    <div className='loader'>
                        <Rings
                            height="88"
                            width="88"
                            radius="9"
                            color="green"
                            ariaLabel="loading"
                        />
                    </div>
                ) : (
                    <div className="todo-list">
                        {filterTodos.length > 0 ? (
                            <ul>
                                {filterTodos.map((eachItem) => (
                                    <li key={eachItem._id}>
                                        <div className="todo-item">
                                            {eachItem._id === editId ? (
                                                <>
                                                    <input
                                                        className="todo-input"
                                                        type="text"
                                                        value={editTodo}
                                                        onChange={(e) => setEditTodo(e.target.value)}
                                                        style={{ width: '50%' }}
                                                    />
                                                    <select
                                                        className="todo-input"
                                                        value={editStatus || eachItem.status}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                    >
                                                        <option value="done">Done</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="in-progress">In Progress</option>
                                                    </select>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() => onClickUpdate(eachItem._id)}
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            ) : (
                                                <div className='d-flex flex-row justify-content-between align-items-center' style={{fontFamily:'serif', fontSize:'20px', width:'100%'}}>
                                                    <p className='prg-task' style={{width:'65%', textDecoration: checkedTasks[eachItem._id]? 'line-through':'none'}}>{eachItem.task}</p>
                                                    <p className='prg-task' style={{width:'25%'}}>{eachItem.status}</p>
                                                    <button
                                                        className="icon-btn"
                                                        onClick={() => {
                                                            setEditId(eachItem._id);
                                                            setEditTodo(eachItem.task);
                                                            setEditStatus(eachItem.status);
                                                        }}
                                                    >
                                                        <FaRegEdit />
                                                    </button>
                                                    <button
                                                        className="icon-btn"
                                                        onClick={() => onClickDelete(eachItem._id)}
                                                    >
                                                        <MdOutlineDelete />
                                                    </button>
                                                    <input
                                                    type='checkbox' 
                                                    checked={checkedTasks[eachItem._id] || false}
                                                    onChange={() => onChangeCheckbox(eachItem._id)} 
                                                    className='checkbox-input'/>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No todo items are available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;

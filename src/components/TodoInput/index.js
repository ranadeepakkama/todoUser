import React, { useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css'

const TodoInput = () => {
    const [todo, setTodo] = useState('');
    const [status, setStatus] = useState('');
    const [filter, setFilter] = useState('')
    const [filterTodos, setFilterTodos] = useState([])
    const [loading, setLoading] = useState(false);
    const [todos, setTodos] = useState([]);
    const url = 'https://todoserver-k4hr.onrender.com';
    const userId = Cookies.get('user_id');
    const token = Cookies.get('jwt_token');

    console.log(filterTodos,loading)

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

    return(
        <div>
            <form onSubmit={handleSubmit} name='todo-form' className="text-center p-3" style={{fontFamily:'serif'}}>
                <input
                    className="todo-input"
                    type="text"
                    placeholder="Enter todo"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    style={{ width: '50vw', marginRight: '10px' }}
                />
                <label>
                    <select
                        aria-labelledby='status-of-todo'
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
                </label>
                

                <button type="submit" id = 'submit-btn' className="btn btn-primary mb-1">
                    Submit
                </button>
                    <label>
                        <select
                            aria-labelledby='filter-input'
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
                    </label>
            </form>
        </div>
    )
}

export default TodoInput
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const Login = () => {
    const [user, setUser] = useState('');
    const [passwd, setPasswd] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwt_token');

    useEffect(() => {
        if (jwtToken) {
            navigate('/');
        }
    }, [jwtToken, navigate]);

    const onChangeUser = (e) => {
        setUser(e.target.value);
    };

    const onChangePassword = (e) => {
        setPasswd(e.target.value);
    };

    const setCookiesAndNavigateToHome = (token) => {
        Cookies.set('jwt_token', token, { expires: 30 });
        Cookies.set('user_id',user,{ expires:30})
        navigate('/'); // navigating to home page
    };

    const url = 'https://todoserver-k4hr.onrender.com'
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/login`, {
                username: user,
                password: passwd
            });
            setError(null);

            const getToken = response.data.token;
            if (response.status === 200 && getToken) {
                setCookiesAndNavigateToHome(getToken);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError('Failed to log in. Please check your username and password.');
        }
        setUser('')
        setPasswd('')
    };

    console.log(user)

    return (
        <div className="main-container">
            <div className='d-flex justify-content-between align-items-center p-3' style={{width:'60vw'}}>
                <div className='text-center p-3' style={{height:'20vh'}}>
                    <h1 style={{color:'#fff', fontFamily:'serif', fontSize:'50px'}}>Welcome To <br/> <span>ToDo</span></h1>
                </div>
                <div style={{left: '50%', top: '0px', bottom: '0px',height:'30vh', borderLeft: '1px solid black'}}></div>
                <div>
                    <div className="form-container">
                        <form className="form" onSubmit={onSubmitForm}>
                            <div>
                                <input 
                                    id="username" 
                                    onChange={onChangeUser} 
                                    value={user} 
                                    type="text" 
                                    className="user-input" 
                                    placeholder="Username"
                                /> 
                            </div>
                            <div>
                                <input 
                                    id="password" 
                                    onChange={onChangePassword} 
                                    value={passwd} 
                                    type="password" 
                                    className="user-input" 
                                    placeholder="Password"
                                /> 
                            </div>
                            <div className="btn-container d-flex justify-content-center align-items-center mt-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                        <div className='p-2' style={{marginLeft:'27px',color:'#fff', fontFamily:'serif'}}>
                            {error ? (<p className="error-message">{error} For new user <a href='/register'> sign_in</a></p>):(<p>New user <a href='/register'>Sign_in</a></p>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

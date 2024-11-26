import Navbar from "../Navbar";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
import './index.css';

const UserDetails = () => {
    const [getUser, setUser] = useState(null); 
    const user = Cookies.get('user_id')
    const token = Cookies.get('jwt_token')
    const url = "https://todoserver-k4hr.onrender.com"

    const getUserDetails = async () => {
        try {
            const response = await axios.get(`${url}/userDetails`,{
                headers: {
                    Authorization: `Bearer ${token}`
                  },
            });
            const userList = response.data.result;
            const filter_user = userList.filter(item => item.username === user)
            const userDetails = filter_user[0]
            // console.log(userDetails);
            setUser(userDetails)
        } catch (error) {
            console.log('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        if (user) {  
            getUserDetails();
        }
    },[user, getUserDetails()]);  

    return (
        <div>
            <Navbar />
            <div className="user-detail-main-container d-flex flex-column justify-content-center align-items-center mt-3">
                <h1 style={{ fontFamily:'serif', color:'#fffff'}}>User Details</h1>
                <div className="user-container text-start mt-1">
                    <div>
                        <img 
                            style={{ width: '90px', height: '90px', marginBottom: '5px' }} 
                            src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" 
                            alt='profile' 
                        />
                    </div>
                    <div>
                    {getUser ? (
                            <>
                                <h2 style={{ fontSize: '20px' }}>Name: {getUser.username}</h2>
                                <p>Email: {getUser.email}</p>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;

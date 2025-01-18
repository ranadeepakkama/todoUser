import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import './index.css'

const Navbar = () => { 
    const navigate = useNavigate();
    const user = Cookies.get('user_id');
    const onClickUserContainer = () => {
        navigate('/userDetails')
    }

    const onClickLogout = () =>{
        Cookies.remove('jwt_token');
        navigate('/login')
    }
    return(
        <div className="navbar d-flex justify-content-between align-items-center">
            <h1 onClick={() => navigate('/')} style={{ cursor: "pointer",color: 'rgb(250, 63, 63)'}}>ToDo</h1>
            <div className="button-container d-flex justify-content-between align-items-center p-2" style={{width:'200px'}}>
                <button type="button" className="logout bg-primary bg-opacity-50 text-white" onClick={onClickLogout}>Logout</button>
                <div className="user-content" onClick={onClickUserContainer}>
                    <img className="img" src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="user-img"/>
                    <p className="pt-3 user-name" style={{fontSize:'20px'}}>{user}</p>
                </div>
            </div>
            
        </div>
    )
}

export default Navbar
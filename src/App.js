import { Route, Routes } from 'react-router-dom';
import Login from "./components/LoginPage";
import HomePage from './components/HomePage';
import Register from './components/RegisterPage';
import UserDetails from './components/UserDetails';
import { UserProvider } from './context/userContext';
//import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <div>
    <UserProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path="/" element={<HomePage />} />
        <Route path='/UserDetails' element={<UserDetails />} />
        <Route path='/UserDetails' element={<UserDetails />} /> 
      </Routes>
    </UserProvider>
  </div>
);

export default App;

/* <Route path="/" element={<HomePage />} />
        <Route path='/UserDetails' element={<UserDetails />} /> */

/* <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/userDetails' 
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          } 
        /> */

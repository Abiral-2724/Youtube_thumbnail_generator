import React from 'react';
import { Button, Space, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setAuthUser } from '../redux/authSlice'; // Ensure the path is correct

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth); 
  console.log(user);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        // Dispatch an action to remove the user from Redux store
        dispatch(setAuthUser(null));
        
        // Redirect to login page
        navigate('/login');
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,zIndex:'10',border:'2px white'}}>
        <div style={{fontWeight:'700' ,fontFamily:'cursive',fontSize:'30px' ,color:'#fce7f3'}}>Quick <span style={{color:'#be185d',marginLeft:'1px',
    animation: 'pulse 2s infinite',}}>ThumbGen</span></div>
        {user ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
             <p style={{marginRight:'40px'}}><a href="/" style={{color:'whitesmoke',textDecoration:'none'}}>Home</a></p>
             <p style={{marginRight:'30px'}}><a href="/explore" style={{color:'whitesmoke',textDecoration:'none'}} >Explore</a></p>
             <p style={{marginRight:'30px'}}><a href="/collection" style={{color:'whitesmoke',textDecoration:'none'}} >Collection</a></p>

            <Button type="primary" style={{ fontWeight: '600' }} onClick={logoutHandler}>
              Logout
            </Button>
            <Space wrap size={16}>
              <a href="/profile"> <Avatar size={45} icon={<UserOutlined />} /></a>
             
            </Space>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <p><a href="/">Home</a></p>
            <Button type="primary" style={{ fontWeight: '600' }}>
              <a href="/signup">Signup</a>
            </Button>
            <Button type="primary" style={{ fontWeight: '600' }}>
              <a href="/login">Login</a>
            </Button>
          </div>
        )}
      </div>
     
      <ToastContainer />
    </div>
  );
};

export default Navbar;

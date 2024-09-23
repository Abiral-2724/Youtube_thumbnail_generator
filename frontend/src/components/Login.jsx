import React, { useEffect, useState } from 'react';
import { Input, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice.js'; // Adjust the path to your authSlice file

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginhandler = async (e) => { 
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        console.log('User data from backend:', res.data.user);
        console.log(res.data.user) ;
        dispatch(setAuthUser(res.data.user));
        // Optionally store in localStorage/sessionStorage if needed
        // localStorage.setItem('user', JSON.stringify(res.data.user));

        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'black' }}>
      <form onSubmit={loginhandler}>
        <div style={{ height: '350px', width: '450px', backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', fontSize: '30px', fontFamily: 'cursive' }}>
            Login
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            <div>
              <span>Email</span>
              <Input placeholder="Enter Email" style={{ marginTop: '6px' }} value={input.email}
                onChange={changeEventHandler} name='email' />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Password</span>
              <Space direction="horizontal">
                <Input.Password
                  placeholder="Input password"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  value={input.password}
                  onChange={changeEventHandler}
                  name="password"
                  style={{ width: '180%' }}
                />
                <Button
                  style={{ width: 80, marginLeft: '160px' }}
                  onClick={() => setPasswordVisible(prevState => !prevState)}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </Button>
              </Space>
            </div>
          </div>
          <div style={{ marginTop: '50px', marginLeft: '100px' }}>
            <Button type="primary" block style={{ fontSize: '18px', width: '70%', height: '40px' }} htmlType="submit" loading={loading}>
              Login
            </Button>
            <p style={{ marginTop: '6px', marginLeft: '9px' }}>Do not have an account? <a href="/signup" style={{ color: 'blue' }}>Signup</a></p>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;

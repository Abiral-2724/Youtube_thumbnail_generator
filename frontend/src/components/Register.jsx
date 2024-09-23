import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Cascader } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
const options = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Prefer not to say', value: 'Prefer not to say' },
];

const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: null,
    youtubeChannelName: "",
    youtubeChannelLink: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const changeEventhandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value) => {
    setInput({ ...input, gender: value[0] }); // Ensure only one value is selected
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!input.username || !input.email || !input.password || !input.confirmPassword || !input.gender) {
      toast.error('All fields are required');
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true); // Set loading while API call is made
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/register',
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(res);

      if (res.data.success) {
       
        setInput({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: null,
          youtubeChannelName: "",
          youtubeChannelLink: "",
        });
        navigate('/login');
        toast.success('User registered successfully');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };
  
  

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'black' }}>
      <form onSubmit={submitHandler}>
        <div style={{ height: '670px', width: '450px', backgroundColor: 'white', padding: '15px', borderRadius: '10px', paddingLeft: '25px', paddingRight: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', fontSize: '30px', fontFamily: 'cursive' }}>
            Signup
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <span>Full Name</span>
              <Input placeholder="Enter your name" style={{ marginTop: '3px' }} value={input.username} onChange={changeEventhandler} name='username' />
            </div>
            <div>
              <span>Email</span>
              <Input placeholder="Enter your email" style={{ marginTop: '0px' }} value={input.email} onChange={changeEventhandler} name='email' />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Password</span>
              <Space direction="horizontal">
                <Input.Password
                  placeholder="Enter password"
                  visibilityToggle={{
                    visible: passwordVisible1,
                    onVisibleChange: setPasswordVisible1,
                  }}
                  style={{ width: '180%' }}
                  value={input.password} onChange={changeEventhandler} name='password'
                />
                <Button
                  style={{
                    width: 80,
                    marginLeft: '160px',
                  }}
                  onClick={() => setPasswordVisible1((prevState) => !prevState)}
                >
                  {passwordVisible1 ? 'Hide' : 'Show'}
                </Button>
              </Space>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Confirm Password</span>
              <Space direction="horizontal">
                <Input.Password
                  placeholder="ReEnter password"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  style={{ width: '180%' }}
                  value={input.confirmPassword} onChange={changeEventhandler} name='confirmPassword'
                />
                <Button
                  style={{
                    width: 80,
                    marginLeft: '160px',
                  }}
                  onClick={() => setPasswordVisible((prevState) => !prevState)}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </Button>
              </Space>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Gender</span>
              <Cascader
                options={options}
                placeholder="Please select"
                style={{ width: '96%' }}
                value={input.gender ? [input.gender] : []} // Ensure Cascader value is an array
                onChange={handleGenderChange}
              />
            </div>
            <div>
              <span>Youtube Channel name</span>
              <Input placeholder="Enter your Channel name" style={{ marginTop: '3px' }}
                value={input.youtubeChannelName} onChange={changeEventhandler} name='youtubeChannelName'
              />
            </div>
            <div>
              <span>Channel Url</span>
              <Input placeholder="Enter your Channel URL" style={{ marginTop: '3px' }} value={input.youtubeChannelLink} onChange={changeEventhandler} name='youtubeChannelLink' />
            </div>
          </div>
          <div style={{ marginTop: '30px', marginLeft: '100px' }}>
            <Button
              type="primary"
              block
              style={{ fontSize: '18px', width: '70%', height: '40px' }}
              htmlType="submit"
              loading={loading} // Add loading spinner to button
            >
              Signup
            </Button>
            <p style={{ marginTop: '2px', marginLeft: '9px' }}>Already Have an account? <a href="/login" style={{ color: 'blue' }}>Login</a></p>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Register;

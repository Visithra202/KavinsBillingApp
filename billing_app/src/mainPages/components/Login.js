import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function Login({ setLogin }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [loginFormData, setLoginFormData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginFormData({ ...loginFormData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('http://localhost:8000/user-login/', loginFormData)
            .then((response) => {
                setLoading(false)
                navigate('/dashboard');
                setLogin(true)
                handleReset();
            }
            ).catch((error) => {
                alert('Invalid Credentials')
                // console.log(error.response||error.response.data);
                setLoading(false);
            }
            )
    }


    const handleReset = () => {
        setLoginFormData({
            username: '',
            password: ''
        })
    }

    return (
        <div className='vh-100 d-flex justify-content-center align-items-center bg-light'>
            <div className='bg-white  border rounded-5 shadow' style={{ width: '40%', height: '50%' }}>
                <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Login</h5>


                <form onSubmit={handleSubmit} className='p-3 px-5'>
                    <div className='d-flex flex-column'>
                        <label htmlFor='username' className='form-label'>Username</label>
                        <input type='text' id='username' className='form-control p-2'  name='username' value={loginFormData.username||''}
                            onChange={handleChange} autoComplete="off" required />
                    </div>
                    <div className='d-flex flex-column mt-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type='password' id='password' className='form-control p-2'  name='password' value={loginFormData.password||''}
                            onChange={handleChange} autoComplete='off' required />
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center mt-4 '>
                        <button type='submit' className='btn btn-success rounded-pill p-1 px-4 w-25 '>Login</button>
                        <span className='form-label text-primary mt-3'>forgot password?</span>
                    </div>

                </form>

                {loading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}>
                        <Loader message="" />
                    </div>
                )}
            </div>
        </div>

    )
}



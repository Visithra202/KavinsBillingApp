import React from 'react'
import AppRoutes from '../AppRoutes'
import { useNavigate } from 'react-router-dom'

export default function MainBar({ setLogin }) {
  const navigate = useNavigate();


  const handleLogout = async () => {
    const logout = window.confirm("Do you want to logout?");
    if(logout)
      setLogin(false);
  };


  return (
    <>
      <div className='navbar d-flex justify-content-between' style={{ backgroundColor: 'white' }}>
        <div></div>
        <div>
          <button className='btn btn-primary rounded-pill px-3 py-1 mx-1' onClick={() => navigate('/addSale')}><i className="bi bi-plus-circle me-1"></i>Add sale</button>
          <button className='btn btn-danger rounded-pill px-3 py-1 mx-1' onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div>
        <AppRoutes />
      </div>
    </>
  )
}

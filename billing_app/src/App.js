import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './mainPages/components/Login.js';
import MainBar from './mainPages/components/MainBar.js';
import SideBar from './mainPages/components/SideBar.js';

function App() {
  const [login, setLogin] = useState(false);
  const [showReports, setShowReports] = useState(false);

  return (
    <BrowserRouter basename='/kavins-billing-app'>
      <Routes>
        <Route
          path="/login"
          element={<Login setLogin={setLogin} />}
        />

        <Route
          path="/*"
          element={
            login ? (
              <div className='App container-fluid row vh-100 p-0 m-0'>
                <div className='sidebar bg-dark col-auto text-light px-2'>
                  <SideBar setShowReports={setShowReports}/>
                </div>
                <div className='mainbar col p-0' style={{ height: '100%' }}>
                  <MainBar setLogin={setLogin} showReports={showReports} setShowReports={setShowReports}/>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;



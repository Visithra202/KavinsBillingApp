import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './mainPages/components/Login.js';
import MainBar from './mainPages/components/MainBar.js';
import SideBar from './mainPages/components/SideBar.js';

// function App() {
//   const [login, setLogin] = useState(false);
//   return (

//     <BrowserRouter >
//       <div className='App container-fluid row vh-100 p-0 m-0'>

//         {!login ? (
//           <div className='w-100'>
//             {/* <Routes> */}
//               {/* <Route path='/login' element={<Login setLogin={setLogin}/>} /> */}
//               {/* Redirect to /login by default if not logged in */}
//               {/* <Route path='*' element={<Navigate to="/login" replace />} /> */}
//               <Login setLogin={setLogin}/>
//             {/* </Routes> */}
//           </div>
//         ) : (
//           <>
//             <div className='sidebar bg-dark col-auto text-light px-2'>
//               <SideBar/>
//             </div>
//             <div className='mainbar col p-0' style={{ height: '100%' }}>
//               <MainBar setLogin={setLogin} />
//             </div>
//           </>
//         )}

//       </div>
//     </BrowserRouter>
//   );
// }

function App() {
  const [login, setLogin] = useState(false);

  return (
    <BrowserRouter>
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
                  <SideBar />
                </div>
                <div className='mainbar col p-0' style={{ height: '100%' }}>
                  <MainBar setLogin={setLogin} />
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



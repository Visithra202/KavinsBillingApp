import React, { useEffect, useState } from 'react';
import axios from "axios";
import SidebarMenu from './SidebarMenu';

export default function SideBar({setShowReports}) {

    return (

        <>
            <div className='d-flex justify-content-center'>
                <Logo />
            </div>
            <hr className='mt-3 border-light' />
            <div className='p-2'>
                <SidebarMenu setShowReports={setShowReports}/>
            </div>
        </>
    );
}

function Logo() {

    const [logo, setLogo] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/get-logo/")
            .then(response => {
                // console.log(response.data.logo_path)
                setLogo(`${response.data.logo_path}`);
            })
            .catch(error => {
                // console.error("Error fetching logo:", error);
            });
    }, []);

    return (
        <>
            {logo &&
                <img src={logo} alt="logo-image" className="logo_image img-fluid pt-2 ps-2" />
            }
        </>
    );
}

import React from 'react'
import {useNavigate } from 'react-router-dom';

export default function GlReport({setShowReports}) {
    const navigate = useNavigate();

    const handleNavigate = (navTo) =>{
        setShowReports(false);
        navigate(navTo);
    }

    return (
        <div className='d-flex flex-column'>
            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/cash_report')}>
                Cash report
            </div>

            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/account_report')}>
                Account report
            </div>

            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/penalty_report')}>
                Penalty Income report
            </div>

            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/mobile_report')}>
                Mobile Income report
            </div>

            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/accessories_report')}>
                Accessories Income report
            </div>

            <div className={`reportby py-1 px-4 border-bottom`} onClick={() => handleNavigate('/reports/service_report')}>
                Service Income report
            </div>

            <div className={`reportby py-1 px-4`} onClick={() => handleNavigate('/reports/interest_report')}>
                Interest Income report
            </div>
        </div>
    )
}

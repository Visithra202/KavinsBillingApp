import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SalesReport({ location , setShowReports}) {
    const navigate = useNavigate();

    const handleNavigate = (navTo) =>{
        setShowReports(false);
        navigate(navTo);
    }

    return (
        <div className='d-flex flex-column'>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("sale_by_customer") ? "isActive" : ""}`} onClick={() => handleNavigate('/reports/sale/sale_by_customer')}>
                <span>Sale by customer</span>
            </div>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("sale_by_products") ? "isActive" : ""}`}
            onClick={() => handleNavigate('/reports/sale/sale_by_products')}>
                <span>Sale by products</span>
            </div>

        </div>
    )
}

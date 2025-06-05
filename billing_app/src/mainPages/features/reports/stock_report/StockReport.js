import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StockReport({ location, setShowReports }) {
    const navigate = useNavigate();

    const handleNavigate = (navTo) =>{
        setShowReports(false);
        navigate(navTo);
    }

    return (
        <div className='d-flex flex-column'>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("required_stock") ? "isActive" : ""}`} 
            onClick={() => handleNavigate('/reports/stock/required_stock')}>
                <span>Required Stock</span>
            </div>

            {/* <div className={`reportby py-1 px-4 ${location.pathname.includes("sale_by_products") ? "isActive" : ""}`}
            onClick={() => navigate('/reports/sale/sale_by_products')}>
                <span>Sale by products</span>
            </div> */}

        </div>
    )
}

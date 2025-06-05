import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PurchaseReport({ location, setShowReports }) {
    const navigate = useNavigate();

    const handleNavigate = (navTo) =>{
        setShowReports(false);
        navigate(navTo);
    }

    return (
        <div className='d-flex flex-column'>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("purchase_by_seller") ? "isActive" : ""}`} onClick={() => handleNavigate('/reports/purchase/purchase_by_seller')}>
                <span>Purchase by seller</span>
            </div>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("purchase_by_products") ? "isActive" : ""}`}
            onClick={() => handleNavigate('/reports/purchase/purchase_by_products')}>
                <span>Purchase by products</span>
            </div>
        </div>
    )
}

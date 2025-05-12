import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SalesReport({ location }) {
    const navigate = useNavigate();
    return (
        <div className='d-flex flex-column'>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("sale_by_customer") ? "isActive" : ""}`} onClick={() => navigate('/reports/sale/sale_by_customer')}>
                <span>Sale by customer</span>
            </div>

            <div className={`reportby py-1 px-4 ${location.pathname.includes("sale_by_products") ? "isActive" : ""}`}
            onClick={() => navigate('/reports/sale/sale_by_products')}>
                <span>Sale by products</span>
            </div>

        </div>
    )
}

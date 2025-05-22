import React, { useState } from 'react'
import SalesReport from './sale_report/SalesReport';
import { useLocation, useNavigate } from 'react-router-dom';
import PurchaseReport from './purchase_report/PurchaseReport';
import StockReport from './stock_report/StockReport';

export default function Reports() {
    return (
        <div className='container p-0 d-flex' style={{ height: 'calc(100vh - 65px)' }}>

            <div className='bg-white' style={{ width: '230px' }}>
                <div className='report bg-secondary text-white p-2' >Reports</div>
                <ReportBy />
            </div>

        </div>
    )
}

function ReportBy() {
    const [openMenu, setOpenMenu] = useState("");
    const location = useLocation();
    const navigate= useNavigate();

    const handleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? "" : menu);
    };
    return (
        <>
            {/* Sales */}
            <div>
                <button type="button"
                    className={`report px-3 py-2 w-100 text-start border-0 bg-transparent ${openMenu === "sales_report" ? "" : "border-bottom"}`}
                    onClick={() => handleMenu('sales_report')}>
                    <span>Sale</span>
                    <i className={`bi ${openMenu === "sales_report" ? "bi-chevron-up" : "bi-chevron-down"} `}></i>
                </button>

                <div id='sales_report' className={`collapse ${openMenu === "sales_report" ? "show border-bottom" : ""}`}>
                    <SalesReport location={location} />
                </div>

                {/* Purchase */}
                <button type="button"
                    className={`report px-3 py-2 w-100 text-start border-0 bg-transparent ${openMenu === "purchase_report" ? "" : "border-bottom"}`}
                    onClick={() => handleMenu('purchase_report')}>
                    <span>Purchase</span>
                    <i className={`bi ${openMenu === "purchase_report" ? "bi-chevron-up" : "bi-chevron-down"} `}></i>
                </button>

                <div id='purchase_report' className={`collapse ${openMenu === "purchase_report" ? "show border-bottom" : ""}`}>
                    <PurchaseReport location={location} />
                </div>

                {/* /Stock Report */}
                <button type="button"
                    className={`report px-3 py-2 w-100 text-start border-0 bg-transparent ${openMenu === "stock_report" ? "" : "border-bottom"}`}
                    onClick={() => handleMenu('stock_report')}>
                    <span>Stock</span>
                    <i className={`bi ${openMenu === "stock_report" ? "bi-chevron-up" : "bi-chevron-down"} `}></i>
                </button>

                <div id='stock_report' className={`collapse ${openMenu === "stock_report" ? "show border-bottom" : ""}`}>
                    <StockReport location={location} />
                </div>



                <div className='report px-3 py-2 bg-transparent border-bottom' onClick={() => navigate('/reports/cash_report')}>
                    Cash report
                </div>

                <div className='report px-3 py-2 bg-transparent border-bottom' onClick={() => navigate('/reports/account_report')}>
                    Account report
                </div>

                <div className='report px-3 py-2 bg-transparent border-bottom' onClick={() => navigate('/reports/balancesheet_report')}>
                    Balance sheet report
                </div>

            </div>
        </>
    )
}

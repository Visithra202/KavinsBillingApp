import React, { useState } from 'react'
import { Link, useLocation } from "react-router-dom";

export default function SidebarMenu({setShowReports}) {
    const [openMenu, setOpenMenu] = useState('');
    const location = useLocation();

    const handleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? "" : menu);
    };

    return (
        <>
            <ul className='list-unstyled fs-6'>
                {/* Dashboard */}
                <li className='list-item'>
                    <Link
                        to='/dashboard'
                        className={`menu text-decoration-none d-flex justify-content-between p-2 text-light ${location.pathname.includes("dashboard") ? "isActive" : ""}`}>
                        <span><i className="bi bi-speedometer me-3"></i> Dashboard</span>
                        <></>
                    </Link>
                </li>

                {/* Sales */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('sales')}>
                        <span><i className="bi bi-graph-up-arrow me-3"></i> Sales</span>
                        <i className={`bi ${openMenu === "sales" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='sales' className={`collapse ${openMenu === "sales" ? "show" : ""}`}>
                        <SalesMenu location={location} />
                    </div>
                </li>

                {/* Purchase */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('purchase')}>
                        <span><i className="bi bi-bag-fill me-3"></i> Purchase</span>
                        <i className={`bi ${openMenu === "purchase" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='purchase' className={`collapse ${openMenu === "purchase" ? "show" : ""}`}>
                        <PurchaseMenu location={location} />
                    </div>
                </li>

                {/* Stocks */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('stocks')}>
                        <span><i className="bi bi-cart-fill me-3"></i> Stocks</span>
                        <i className={`bi ${openMenu === "stocks" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='stocks' className={`collapse ${openMenu === "stocks" ? "show" : ""}`}>
                        <StocksMenu location={location} />
                    </div>
                </li>

                {/* Service */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('service')}>
                        <span><i class="bi bi-tools me-3"></i> Service</span>
                        <i className={`bi ${openMenu === "service" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='service' className={`collapse ${openMenu === "service" ? "show" : ""}`}>
                        <ServiceMenu location={location} />
                    </div>
                </li>

                {/* Master Data */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('masterData')}>
                        <span><i className="bi bi-database-fill-gear me-3"></i> Master data</span>
                        <i className={`bi ${openMenu === "masterData" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='masterData' className={`collapse ${openMenu === "masterData" ? "show" : ""}`}>
                        <MasterDataMenu location={location} />
                    </div>
                </li>

                {/* Customers */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('customer_seller')}>
                        <span><i className="bi bi-people-fill me-3"></i> Customers & Sellers</span>
                        <i className={`bi ${openMenu === "customer_seller" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='customer_seller' className={`collapse ${openMenu === "customer_seller" ? "show" : ""}`}>
                        <CustomerSellerMenu location={location} />
                    </div>

                </li>

                {/* Loan */}
                <li className='list-item '>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => handleMenu('loan')}>
                        <span><i className="bi bi-bank2 me-3"></i> Loan</span>
                        <i className={`bi ${openMenu === "loan" ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ fontSize: '12px' }}></i>
                    </button>

                    <div id='loan' className={`collapse ${openMenu === "loan" ? "show" : ""}`}>
                        <LoanMenu location={location} />
                    </div>
                </li>

                {/* reports */}
                {/* <li className='list-item hover-slide'>
                    <Link
                        to='/reports'
                        className={`menu text-decoration-none d-flex justify-content-between p-2 text-light ${location.pathname.includes("reports") ? "isActive" : ""}`}>
                        <span><i className="bi bi-clipboard2-data-fill me-3"></i> Reports</span>
                        <></>
                    </Link>
                </li> */}
                <li className='list-item hover-slide'>
                    <button className='sidebar-menu menu w-100 p-2' onClick={() => setShowReports(true)}>
                        <span><i className="bi bi-clipboard2-data-fill me-3"></i> Reports</span>
                    </button>
                </li>

            </ul>
        </>
    )
}


function LoanMenu({ location }) {

    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/createLoan' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("createLoan") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bag-fill me-2"></i>Create loan</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/loanList' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("loanList") ? "isActive" : ""}`}>
                    <span><i className="bi bi-list-check me-2"></i>Loan list</span>
                </Link>

            </li>
            <li className='pt-1'>
                <Link to='/loanDetails' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("loanDetails") ? "isActive" : ""}`}>
                    <span><i className="bi bi-ticket-detailed me-2"></i>Loan details</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/loanCollection' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("loanCollection") ? "isActive" : ""}`}>
                    <span><i className="bi bi-collection me-2"></i>Loan collection</span>
                </Link>
            </li>
        </ul>
    )
}

function SalesMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/addSale' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("addSale") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bag-fill me-2"></i>Add sale</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/saleList' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("saleList") ? "isActive" : ""}`}>
                    <span><i className="bi bi-list-check me-2"></i>Sales list</span>
                </Link>

            </li>
            <li className='pt-1'>
                <Link to='/saleDetails' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("saleDetails") ? "isActive" : ""}`}>
                    <span><i className="bi bi-ticket-detailed me-2"></i>Sales details</span>
                </Link>
            </li>
        </ul>
    )
}

function PurchaseMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/addPurchase' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("addPurchase") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bag-plus me-2"></i>Add purchase</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/purchaseList' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("purchaseList") ? "isActive" : ""}`}>
                    <span><i className="bi bi-list-check me-2"></i>Purchase list</span>
                </Link>

            </li>
            <li className='pt-1'>
                <Link to='/purchaseDetails' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("purchaseDetails") ? "isActive" : ""}`}>
                    <span><i className="bi bi-ticket-detailed me-2"></i>Purchase details</span>
                </Link>
            </li>
        </ul>
    )
}

function ServiceMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/serviceEntry' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("serviceEntry") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bag-plus me-2"></i>Service Entry</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/serviceList' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("serviceList") ? "isActive" : ""}`}>
                    <span><i className="bi bi-list-check me-2"></i>Service list</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/serviceDetails' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("serviceDetails") ? "isActive" : ""}`}>
                    <span><i className="bi bi-ticket-detailed me-2"></i>Service details</span>
                </Link>
            </li>
        </ul>
    )
}

function StocksMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/addItem' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("addItem") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bag-plus me-2"></i>Add Item</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/stockList' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("stockList") ? "isActive" : ""}`}>
                    <span><i className="bi bi-list-check me-2"></i>Stock list</span>
                </Link>
            </li>
        </ul>
    )
}

function MasterDataMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/categories' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("categories") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bookmark-plus me-2"></i>Categories</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/brands' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("brands") ? "isActive" : ""}`}>
                    <span><i className="bi bi-substack me-2"></i>Brands</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/users' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("users") ? "isActive" : ""}`}>
                    <span><i className="bi bi-person-square me-2"></i>Users</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/invest' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("invest") ? "isActive" : ""}`}>
                    <span><i className="bi bi-cash me-2"></i>Invest</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/receiveIncome' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("receiveIncome") ? "isActive" : ""}`}>
                    <span><i className="bi bi-wallet-fill me-2"></i>Receive Income </span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/transferAmount' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("transferAmount") ? "isActive" : ""}`}>
                    <span><i className="bi bi-wallet2 me-2"></i>Transfer Amount</span>
                </Link>
            </li>
        </ul>
    )
}

function CustomerSellerMenu({ location }) {
    return (
        <ul className='menu-icon list-unstyled ps-2 ms-2'>
            <li className='pt-1'>
                <Link to='/customerData' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("customerData") ? "isActive" : ""}`}>
                    <span><i className="bi bi-bookmark-plus me-2"></i>Customer data</span>
                </Link>
            </li>
            <li className='pt-1'>
                <Link to='/sellerData' className={`text-decoration-none text-light py-1 px-3  ${location.pathname.includes("sellerData") ? "isActive" : ""}`}>
                    <span><i className="bi bi-substack me-2"></i>Seller data</span>
                </Link>
            </li>
        </ul>
    )
}
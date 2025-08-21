import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useReactToPrint } from 'react-to-print';

export default function StockList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [itemList, setItemList] = useState([]);
    const [reload, setReload] = useState(true);
    const [loading, setLoading] = useState(true);
    const [filteredItems, setFilteredItems] = useState([]);

    const navigate = useNavigate();
    const contentRef = useRef();

    useEffect(() => {
        axios.get('http://localhost:8000/get-stock-list/')
            .then((response) => {
                setItemList(response.data);
                setFilteredItems(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }, [reload]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredItems(itemList);
        } else {
            const terms = searchTerm.toLowerCase().split(/\s+/);
            const filtered = itemList.filter((item) => {
                const name = item.item_name.toLowerCase();
                const category = item.category.toLowerCase();
                const brand = item.brand.toLowerCase();
                return terms.every(term =>
                    name.includes(term) || category.includes(term) || brand.includes(term)
                );
            });
            setFilteredItems(filtered);
        }
    }, [searchTerm, itemList]);

    const handleDelete = (item) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Item?");
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/delete-item/${item.item_id}/`)
                .then(() => setReload(prev => !prev))
                .catch(() => alert('Error Deleting Item'));
        }
    };

    const handleChange = (e) => setSearchTerm(e.target.value);

    const handlePrint = useReactToPrint({
        contentRef
    });

    return (
        <>
            {/* Visible Content */}
            <div className='container' style={{ height: 'calc(100vh - 85px)' }}>
                <div className='d-flex justify-content-between align-items-center btnrow'>
                    <input
                        className='form-control border rounded px-2 my-2'
                        type='text'
                        placeholder='Search...'
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <button className='btn btn-primary' onClick={handlePrint}>Print</button>
                </div>

                <div className='border border-secondary bg-white rounded-5 shadow my-1 scroll-bar'
                    style={{ minHeight: '93%', maxHeight: '93%', overflowY: 'auto' }}>
                    <table className='itmlst table table-hover'>
                        <thead style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                            <tr>
                                <th>Product name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th className='text-end'>Purchase price</th>
                                <th className='text-end'>Sale price</th>
                                <th className='text-end'>MRP</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-end'>Total</th>
                                <th className='text-center no-print'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className='text-center'><td colSpan='9'><Loader message='Fetching Items' /></td></tr>
                            ) : (
                                filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.item_name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.brand}</td>
                                            <td className='text-end'>{item.purchase_price}</td>
                                            <td className='text-end'>{item.sale_price}</td>
                                            <td className='text-end'>{item.mrp}</td>
                                            <td className='text-center'>{item.quantity}</td>
                                            <td className='text-end'>{(item.quantity * item.purchase_price).toFixed(2)}</td>
                                            <td className='text-center no-print'>
                                                <i className="bi bi-pencil-square text-primary mx-1" style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate('/editItem', { state: { item } })}></i>
                                                <i className="bi bi-trash-fill text-danger mx-1" style={{ cursor: 'pointer' }}
                                                    onClick={() => handleDelete(item)}></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='text-center'><td colSpan='9'>No Products Found</td></tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hidden Print-Only Content */}
            <div style={{ display: 'none' }}>
                <div ref={contentRef} className='container-fluid print-area p-4'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th className='text-end'>Purchase price</th>
                                <th className='text-end'>Sale price</th>
                                <th className='text-end'>MRP</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-end'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems
                                .filter(item => item.quantity > 0)
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.brand}</td>
                                        <td className='text-end'>{item.purchase_price}</td>
                                        <td className='text-end'>{item.sale_price}</td>
                                        <td className='text-end'>{item.mrp}</td>
                                        <td className='text-center'>{item.quantity}</td>
                                        <td className='text-end'>{(item.quantity * item.purchase_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import EditItem from './EditItem';
import { useNavigate } from 'react-router-dom';

export default function StockList() {
    const [itemList, setItemList] = useState([]);
    const [reload,setReload] = useState(true)
    const navigate=useNavigate();

    useEffect(() => {
        axios.get('http://192.168.1.23:8000/get-stock-list/')
            .then((response) => {
                setItemList(response.data)
            })
            .catch((error) => {
                console.error('Error Fetching Items')
            })
    }, [reload])

    const handleDelete = (item) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Item?");
        if (confirmDelete) {
            axios.delete(`http://192.168.1.23:8000/delete-item/${item.item_id}/`)
                .then((response) =>
                    setReload((prev) => !prev)
                ).catch((error) => {
                    alert('Error Deleting Item')
                });
        }
    }

    return (
        <div className='container'  style={{ height: 'calc(100vh - 85px)' }}>

            <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar' 
            style={{minHeight:'100%', maxHeight: '100%', overflowY: 'auto' }}>
                <table className='itmlst table table-hover'>
                    <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1',}}>
                        <tr>
                            <th>Product name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th className='text-end'>Purchase price</th>
                            <th className='text-end'>Sale price</th>
                            <th className='text-end'>MRP</th>
                            <th className='text-center'>Quantity</th>
                            <th className='text-end'>Total</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>

                    <tbody className='px-4 py-1'>
                        {itemList.length > 0 ? (
                            itemList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item_name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.brand}</td>
                                    <td className='text-end'>{item.purchase_price}</td>
                                    <td className='text-end'>{item.sale_price}</td>
                                    <td className='text-end'>{item.mrp}</td>
                                    <td className='text-center'>{item.quantity}</td>
                                    <td className='text-end'>{(item.quantity*item.purchase_price).toFixed(2)}</td>
                                    <td className='text-center'>
                                        <i className="bi bi-pencil-square text-primary mx-1" style={{ cursor: 'pointer' }}
                                        onClick={() => navigate('/editItem', {state : {item}}) }></i>
                                        <i className="bi bi-trash-fill text-danger mx-1" style={{ cursor: 'pointer' }} onClick={() => handleDelete(item)}></i>
                                    </td>
                                </tr>
                            ))

                        ) : (
                            <tr className='text-center'><td colSpan='9'>No Products Found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

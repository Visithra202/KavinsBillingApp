import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function SaleByProducts() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/get-report-sales-by-products/')
            .then((response) => {
                setSales(response.data)
                setLoading(false);
            }).catch((error) => {
                // console.error('Error fetching sales report ' + error.response.data)
                setLoading(false);
            })
    }, [])

    return (
        <div className='container' style={{ height: 'calc(100vh - 85px)' }}>


            <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
                style={{ minHeight: '100%', maxHeight: '100%', overflowY: 'auto' }}>
                <table className='itmlst table table-hover'>
                    <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
                        <tr>
                            <th>#</th>
                            <th>Item name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th className='text-center'>Quantity</th>
                            <th className='text-end'>Sales amount</th>
                            <th className='text-center'>No of sales</th>
                            <th className='text-center'>Last sale date</th>
                        </tr>
                    </thead>

                    <tbody className='px-4 py-1'>
                        {loading ?
                            <tr className='text-center'><td colSpan='8' ><Loader message='fetching reports' /></td></tr>
                            : sales.length > 0 ? (
                                sales.map((sale, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{sale.product__item_name}</td>
                                        <td>{sale.product__category}</td>
                                        <td>{sale.product__brand}</td>
                                        <td className='text-center'>{sale.total_quantity}</td>
                                        <td className='text-end'>{sale.total_sales.toFixed(2)}</td>
                                        <td className='text-center'>{sale.bills}</td>
                                        <td className='text-center'>{sale.last_sale_date}</td>
                                    </tr>
                                ))

                            ) : (
                                <tr className='text-center'><td colSpan='9'>Sales report not Found</td></tr>
                            )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

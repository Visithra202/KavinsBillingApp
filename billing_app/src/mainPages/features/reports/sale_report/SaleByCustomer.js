import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function SaleByCustomer() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://192.168.1.23:8000/get-report-sales-by-customer/')
            .then((response) => {
                setSales(response.data)
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching sales report ' + error.response.data)
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
                            <th>Customer name</th>
                            <th>Mobile no</th>
                            <th className='text-center'>Bills</th>
                            <th className='text-end'>Total sales</th>
                            <th className='text-end'>Total paid</th>
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
                                        <td>{sale.customer_name}</td>
                                        <td>{sale.mph}</td>
                                        <td className='text-center'>{sale.bills}</td>
                                        <td className='text-end'>{sale.total_sales.toFixed(2)}</td>
                                        <td className='text-end'>{sale.total_paid.toFixed(2)}</td>
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

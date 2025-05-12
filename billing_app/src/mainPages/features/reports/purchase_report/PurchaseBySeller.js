import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function PurchaseBySeller() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/get-report-purchase-by-seller/')
            .then((response) => {
                setPurchases(response.data)
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching purchase report ' + error.response.data)
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
                            <th>Seller name</th>
                            <th>Mobile no</th>
                            <th className='text-center'>Bills</th>
                            <th className='text-end'>Total purchase</th>
                            <th className='text-end'>Total paid</th>
                            <th className='text-center'>Last purchase date</th>
                        </tr>
                    </thead>

                    <tbody className='px-4 py-1'>
                        {loading ?
                            <tr className='text-center'><td colSpan='8' ><Loader message='fetching reports' /></td></tr>
                            : purchases.length > 0 ? (
                                purchases.map((purchase, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{purchase.seller_name}</td>
                                        <td>{purchase.mph}</td>
                                        <td className='text-center'>{purchase.bills}</td>
                                        <td className='text-end'>{purchase.total_purchase.toFixed(2)}</td>
                                        <td className='text-end'>{purchase.total_paid.toFixed(2)}</td>
                                        <td className='text-center'>{purchase.last_purchase_date}</td>
                                    </tr>
                                ))

                            ) : (
                                <tr className='text-center'><td colSpan='9'>purchase report not Found</td></tr>
                            )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

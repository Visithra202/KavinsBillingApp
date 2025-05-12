import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function PurchaseByProducts() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/get-report-purchase-by-products/')
            .then((response) => {
                setPurchases(response.data)
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching purchases report ' + error.response.data)
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
                            <th className='text-end'>Purchase amount</th>
                            <th className='text-center'>No of Purchase</th>
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
                                        <td>{purchase.product__item_name}</td>
                                        <td>{purchase.product__category}</td>
                                        <td>{purchase.product__brand}</td>
                                        <td className='text-center'>{purchase.total_quantity}</td>
                                        <td className='text-end'>{purchase.total_purchase.toFixed(2)}</td>
                                        <td className='text-center'>{purchase.bills}</td>
                                        <td className='text-center'>{purchase.last_purchase_date}</td>
                                    </tr>

                                ))

                            ) : (
                                <tr className='text-center'><td colSpan='9'>Purchase report not Found</td></tr>
                            )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

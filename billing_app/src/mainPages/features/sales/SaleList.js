import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function SaleList() {
    const [saleList, setSaleList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://192.168.1.23:8000/get-sale-list/')
            .then((response) => {
                setSaleList(response.data)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error Fetching Sales')
            })
    }, [])

    const handlePrint = (sale, string) => {

        if (string === 'print') {
            navigate('/printSale', {
                state: {
                    sale,
                    from: '/saleList',
                }
            });
            return;
        }
        else if (string === 'details') {
            navigate('/saleDetails', {
                state: {
                    sale
                }
            });
            return;
        }

    };




    return (
        <div className='container'  style={{ height: 'calc(100vh - 85px)' }}>

            <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
                style={{ minHeight: '100%', maxHeight: '100%', overflowY: 'auto' }}>
                <table className='itmlst table table-hover'>
                    <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr>
                            <th>Bill No</th>
                            <th>Sale date</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Payment type</th>
                            <th className='text-end'>Total amount</th>
                            <th className='text-end'>Discount</th>
                            <th className='text-end'>Income</th>
                            {/* <th className='text-center'>Action</th> */}
                            <th>Print</th>
                        </tr>
                    </thead>

                    <tbody className='px-4 py-1'>
                        {
                            loading ? (
                                <tr><td colSpan='9'><Loader message='Fetching Sale Items' /></td></tr>
                            ) : (
                                saleList.length > 0 ? (
                                    saleList.map((sale, index) => (
                                        <tr key={index}>
                                            <td className='text-primary' style={{cursor:'pointer'}} onClick={() => handlePrint(sale, 'details')}>{sale.bill_no}</td>
                                            <td>{sale.sale_date}</td>
                                            <td>
                                                {sale.customer?.customer_name || ""}
                                            </td>
                                            <td>
                                                {(() => {
                                                    let prods = '';
                                                    sale.sale_products?.length > 0 && sale.sale_products.forEach((prod) => {
                                                        if (prod) {
                                                            prods += (prods ? ', ' : '') + prod.product.item_name;
                                                        }
                                                    });
                                                    return prods || '';
                                                })()}
                                            </td>

                                            <td>
                                                {(() => {
                                                    let ans = '';
                                                    const payment = sale.payment;
                                                    if (!payment) return '-';
                                                    if (payment.cash > 0) ans += 'Cash';
                                                    if (payment.account > 0) ans += (ans ? ' & Account' : 'Account');
                                                    if (payment.credit > 0) ans += (ans ? ' & Credit' : 'Credit');
                                                    return ans || '-';
                                                })()}
                                            </td>
                                            <td className='text-end'>{sale.total_amount}</td>
                                            <td className='text-end'>{sale.discount}</td>
                                            <td className='text-end'>{sale.income}</td>
                                            <td className="text-center">
                                                <i
                                                    className="bi bi-printer-fill" style={{cursor:'pointer'}}
                                                    onClick={() => handlePrint(sale, 'print')}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))

                                ) : (
                                    <tr className='text-center'><td colSpan='9'>No Sale Found</td></tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import PaymentOption from '../payment/PaymentOption';

export default function AddLoanPayment() {
    const location = useLocation();
    const collection = location.state?.collect || {};
    const [totalDue, setTotalDue] = useState(0);

    return (
        <div className='container '>
            <div className='row mt-4 mx-2'>
                <div className='col'>
                    <PaymentForm collection={collection} totalDue={totalDue} />
                </div>

                <div className='col bg-light p-3 px-5 border rounded-5 shadow '>
                    <DueDetails collection={collection} setTotalDue={setTotalDue} />
                </div>
            </div>

        </div>
    )
}

function PaymentForm({ collection, totalDue }) {
    const [amount, setAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const navigate = useNavigate()
    const [payment, setPayment] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isNaN(value))
            return;
        if (name === 'payment_amount')
            setAmount(value)
        else
            setDiscount(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(amount) < 0) {
            return;
        }

        if (parseFloat(amount) + parseFloat(discount) > parseFloat(totalDue)) {
            alert('Enter valid amount');
            return;
        }

        if (payment === '') {
            alert('Select payment type')
            return;
        }

        const formData = {
            loan_accno: collection.loan_accno,
            payment_amount: amount,
            payment: payment,
            discount: discount ? Number(discount) : 0
        }

        try {
            await axios.post('http://localhost:8000/add-loan-payment/', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            alert('Payment added Successfully')
            setAmount('')
            navigate('/loanCollection')
        } catch (error) {
            alert('Error adding loan payment');
        }
    }


    return (
        <div className='bg-white border rounded-5 shadow'>
            <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Payment</h5>

            <form onSubmit={handleSubmit} className='py-3 px-4'>
                <div className='d-flex flex-column'>
                    <label className='form-label'>Account no</label>
                    <input type='text' className='form-control p-2' name='loan_accno' value={collection?.loan_accno || ''}
                        autoComplete="off" disabled />
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label className='form-label'>Customer name</label>
                    <input type='text' className='form-control p-2' name='customer_name' value={collection?.customer?.customer_name || ''}
                        autoComplete='off' disabled />
                </div>

                <div className='row mt-3'>
                    <div className='col d-flex flex-column'>
                        <label className='form-label'>Due Amount</label>
                        <input type='text' className='form-control p-2' name='due_amount' value={collection ? (parseFloat(collection.due_amount)).toFixed(2) : ''}
                            autoComplete='off' disabled />
                    </div>
                    <div className='col d-flex flex-column'>
                        <label className='form-label'>Late fee</label>
                        <input type='text' className='form-control p-2' name='late_fee' value={collection ? (parseFloat(collection.late_fee)).toFixed(2) : ''}
                            autoComplete='off' disabled />
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col d-flex flex-column'>
                        <label className='form-label'>Total due</label>
                        <input type='text' className='form-control p-2' name='total_due' value={collection ? (parseFloat(collection.due_amount) + parseFloat(collection.late_fee)).toFixed(2) : ''}
                            autoComplete='off' disabled />
                    </div>
                    <div className='col d-flex flex-column'>
                        <label className='form-label'>Payment amount</label>
                        <input type='text' className='form-control p-2' name='payment_amount' value={amount} onChange={handleChange}
                            autoComplete='off' required />
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col d-flex flex-column '>
                        <label className='form-label'>Discount</label>
                        <input type='text' className='form-control p-2' name='discount' value={discount} onChange={handleChange}
                            autoComplete='off' />
                    </div>
                    <div className='col d-flex flex-column '>
                        <PaymentOption payment={payment} setPayment={setPayment} />
                    </div>
                </div>

                <div className='d-flex justify-content-center mt-4 '>
                    <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
                </div>

            </form>
        </div>
    )
}

function DueDetails({ collection, setTotalDue }) {

    const [loanBills, setLoanBills] = useState([]);
    const [loading, setLoading] = useState(true)
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const unpaidBills = bills.filter(bill => !bill.paid_date);
        const totalUnpaidDue = unpaidBills.reduce((sum, bill) => {
            return sum + (parseFloat(bill.total_due) || 0);
        }, 0);
        setTotalDue(totalUnpaidDue);
    }, [bills, setTotalDue]);


    useEffect(() => {
        axios.get(`http://localhost:8000/get-loan-bill/${collection.loan_accno}`)
            .then((response) => {
                setLoanBills(response.data.loan_bills);
                setLoading(false);
            })
            .catch((error) => {
                // console.error('Error Fetching loan bills');
                setLoading(false);
            });

        axios.get(`http://localhost:8000/get-acc-loan-bills/${collection?.loan_accno}`)
            .then((response) => {
                setBills(response.data)
            }).catch((error) => {
                // console.error('Error fetching loan bills ' + error.response?.data)
            });
    }, [collection.loan_accno]);



    return (
        <div className='container' style={{ height: 'calc(100vh - 250px)' }}>
            <div className='d-flex justify-content-center pb-2' ><h5>Due pending</h5></div>
            <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
                <table className="table table-hover table-light">
                    <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr>
                            <th>#</th>
                            <th>Due date</th>
                            <th className='text-end'>Due amount</th>
                            <th className='text-end'>Late fee</th>
                            <th className='text-end'>Total due</th>
                            <th className='text-end'>Paid Amount</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {loading ? (
                            <tr className="text-center">
                                <td colSpan="6">
                                    <Loader message='Fetching details' />
                                </td>
                            </tr>
                        ) : loanBills.length > 0 ? (
                            loanBills.map((bill, index) => (
                                <tr key={index}>
                                    <td>{bill.bill_seq}</td>
                                    <td>{bill.bill_date}</td>
                                    <td className='text-end'>{bill.due_amount}</td>
                                    <td className='text-end'>{bill.late_fee}</td>
                                    <td className='text-end'>{bill.total_due}</td>
                                    <td className='text-end'>{bill.paid_amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="6">No due found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

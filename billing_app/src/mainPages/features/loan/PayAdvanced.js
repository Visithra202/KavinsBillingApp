import axios from 'axios';
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentOption from '../payment/PaymentOption.js';

export default function PayAdvanced() {
    const location = useLocation();
    const loan = location.state?.loan || {};
    const loanBills = location.state.loanBills || [];

    const unpaidBills = loanBills.filter(bill => !bill.paid_date);
    const totalUnpaidDue = unpaidBills.reduce((sum, bill) => {
        return sum + (parseFloat(bill.total_due)-parseFloat(bill.paid_amount) || 0);
    }, 0);

    return (
        <div className='container '>
            <div className='row mt-4 mx-2'>
                <div className='col'>
                    <PaymentForm loan={loan} totalUnpaidDue={totalUnpaidDue} />
                </div>

                <div className='col bg-light p-3 px-5 border rounded-5 shadow '>
                    <DueDetails unpaidBills={unpaidBills} />
                </div>
            </div>

        </div>
    )
}

function PaymentForm({ loan, totalUnpaidDue }) {
    const [amount, setAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const [payment, setPayment] = useState('');
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (isNaN(value))
            return;
        if (name === 'payment_amount')
            setAmount(value)
        else
            setDiscount(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(amount) <= 0) {
            return;
        }
        
        const disc=discount?parseFloat(discount):0;

        if (parseFloat(amount) + disc > parseFloat(totalUnpaidDue)) {
            alert('Enter valid amount');
            return;
        }

        if (payment === '') {
            alert('Select payment type')
            return;
        }

        const formData = {
            loan_accno: loan.loan_accno,
            payment_amount: amount,
            payment: payment,
            discount: disc
        }

        try {
            await axios.post('http://localhost:8000/add-loan-payment/', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            alert('Payment added Successfully')
            setAmount('')
            navigate('/loanBills', { state: { loan } })
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
                    <input type='text' className='form-control p-2' name='loan_accno' value={loan?.loan_accno || ''}
                        autoComplete="off" disabled />
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label className='form-label'>Customer name</label>
                    <input type='text' className='form-control p-2' name='customer_name' value={loan?.customer?.customer_name || ''}
                        autoComplete='off' disabled />
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label className='form-label'>Outstanding</label>
                    <input type='text' className='form-control p-2' name='tot_due' value={totalUnpaidDue}
                        disabled />
                </div>
                <div className='row mt-3'>
                    <div className='col d-flex flex-column'>
                        <label className='form-label'>Payment amount</label>
                        <input type='text' className='form-control p-2' name='payment_amount' value={amount} onChange={handleChange}
                            autoComplete='off' />
                    </div>
                    <div className='col d-flex flex-column '>
                        <label className='form-label'>Discount</label>
                        <input type='text' className='form-control p-2' name='discount' value={discount} onChange={handleChange}
                            autoComplete='off' />
                    </div>
                </div>
                <div className='d-flex flex-column mt-3'>
                    <PaymentOption payment={payment} setPayment={setPayment} />
                </div>
                <div className='d-flex justify-content-center mt-4 '>
                    <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
                </div>

            </form>
        </div>
    )
}

function DueDetails({ unpaidBills }) {

    return (
        <div className='container' style={{ height: 'calc(100vh - 250px)' }}>
            <div className='d-flex justify-content-center pb-2' ><h5>Loan bills</h5></div>
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

                        {unpaidBills.length > 0 ? (
                            unpaidBills.map((bill, index) => (
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

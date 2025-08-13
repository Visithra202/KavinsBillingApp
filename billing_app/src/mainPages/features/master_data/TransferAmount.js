import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader';

export default function TransferAmount() {
    const [reload, setReload] = useState(false);
    return (
        <div className='container'>
            <div className='row overflow-hidden'>
                <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
                    <TransactionList reload={reload} setReload={setReload} />
                </div>

                <div className='col h-75'>
                    <TransactionForm setReload={setReload} />
                </div>
            </div>
        </div>
    )
}

function TransactionForm({ setReload }) {
    const [formData, setFormData] = useState([]);
    const [lastCashBal, setLastCashBal] = useState(0);
    const [lastAccBal, setLastAccBal] = useState(0);
    const [loading, setLoading] = useState(false);

    const date = new Date();

    useEffect(() => {
        axios.get('http://localhost:8000/get-last-balance/')
            .then((response) => {
                setLastCashBal(response.data.cash_bal);
                setLastAccBal(response.data.acc_bal);
            })
            .catch((error) => {
                // console.error('Error Fetching balance');
            });
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);

        if (formData.trans_from === formData.trans_to) {
            alert('Transaction not allowed for same')
            return;
        }

        if (formData.trans_amt < 0) {
            alert('Amount must be positive');
            return;
        }

        if (formData.trans_amt <= 0)
            return;


        if (formData.trans_from === 'Cash' && lastCashBal < formData.trans_amt) {
            alert("Insufficient cash balance");
            return;
        } else if (formData.trans_from === 'Account' && lastAccBal < formData.trans_amt) {
            alert("Insufficient account balance");
            return;
        }

        const transferData = {
            date: date.toISOString().split('T')[0],
            trans_from: formData.trans_from,
            trans_to: formData.trans_to,
            amount: formData.trans_amt
        }

        try {
            await axios.post('http://localhost:8000/amount-transfer/', transferData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setReload((prev) => !prev)
            handleReset();
        } catch (err) {
            // console.log(err)
        }finally{
            setLoading(false);
        }
    }

    const handleReset = () => {
        setFormData({
            trans_date: '',
            trans_from: '',
            trans_to: '',
            trans_amt: ''
        })
    }

    return (
        <div className='bg-white m-4 mt-4  border rounded-5 shadow'>

            <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Transfer Amount</h5>

            <form onSubmit={handleSubmit} className='p-3 px-5'>
                <div className='d-flex flex-column'>
                    <label htmlFor='trans_date' className='form-label'>Date</label>
                    <input id='trans_date' type='date' className='form-control p-2' name='date' value={date.toISOString().split('T')[0] || ''}
                        autoComplete="off" disabled />
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='trans_from' className='form-label'>From</label>
                    <select id='trans_from' className='form-select' name='trans_from' value={formData.trans_from} onChange={handleChange} required>
                        <option value="">Select option</option>
                        <option value="Cash">Cash</option>
                        <option value="Account">Account</option>
                    </select>
                </div>

                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='trans_to' className='form-label'>To</label>
                    <select id='trans_to' className='form-select' name='trans_to' value={formData.trans_to} onChange={handleChange} required>
                        <option value="">Select option</option>
                        <option value="Cash">Cash</option>
                        <option value="Account">Account</option>
                    </select>
                </div>

                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='trans_amt' className='form-label'>Amount</label>
                    <input id='trans_amt' type='number' className='form-control p-2' name='trans_amt' value={formData.trans_amt}
                        onChange={handleChange} autoComplete='off' required />
                </div>
                <div className='d-flex justify-content-center mt-4 '>
                    <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
                </div>

            </form>
        </div>
    )
}

function TransactionList({ reload, setReload }) {

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/get-amount-transfer-list/')
            .then((response) => {
                setTransactions(response.data)
                setLoading(false)
            })
            .catch((error) => {
                // console.error('Error Fetching transactions')
                setLoading(false)
            })
    }, [reload])

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <div className='container' style={{ height: 'calc(100vh - 150px)' }}>
            <div className='d-flex justify-content-center pb-2' ><h5>Transaction list</h5></div>
            <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
                <table className="table table-light">
                    <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr>
                            <th>Date</th>
                            <th>From</th>
                            <th>To</th>
                            <th className='text-end'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {loading ? (
                            <tr className="text-center">
                                <td colSpan="4">
                                    <Loader message='Fetching transactions' />
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((trans, index) => (
                                <tr key={index}>
                                    <td>{formatDate(trans.date)}</td>
                                    <td>{trans.trans_from}</td>
                                    <td>{trans.trans_to}</td>
                                    <td className='text-end'>{trans.amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="4">Transaction not Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
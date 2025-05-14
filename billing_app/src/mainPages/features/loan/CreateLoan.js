import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import UseClickOutside from '../../hooks/UseClickOutside';


export default function CreateLoan() {
    const [loanFormData, setLoanFormData] = useState({});
    const [searchCustomer, setSearchCustomer] = useState({});
    const [refContact, setRefContact] = useState('');
    const [lockId, setLockId] = useState('');
    const date = new Date();

    useEffect(() => {
        const sellPrice = parseFloat(loanFormData.sell_prc) || 0;
        const advanceAmt = parseFloat(loanFormData.advance_amt) || 0;
        const advanceBal = parseFloat(loanFormData.advance_bal) || 0;
        const totalPayment = parseFloat(loanFormData.total_payment) || 0;
        const term = parseFloat(loanFormData.term) || 0;
        const frequency = loanFormData.payment_frequency;

        const loanAmount = sellPrice - advanceAmt - advanceBal;
        const paymentAmount = totalPayment - advanceAmt - advanceBal;
        const interest = paymentAmount - loanAmount;

        let emiAmount = 0;
        const duration = frequency === 'Weekly' ? term * 4 : term;
        if (paymentAmount > 0 && duration > 0) {
            emiAmount = paymentAmount / duration;
        }

        setLoanFormData((prev) => ({
            ...prev,
            loan_amount: isNaN(loanAmount) || loanAmount <= 0 ? '' : loanAmount.toFixed(2),
            payment_amount: isNaN(paymentAmount) || paymentAmount <= 0 ? '' : paymentAmount.toFixed(2),
            interest: isNaN(interest) || interest <= 0 ? '' : interest.toFixed(2),
            emi_amount: isNaN(emiAmount) || emiAmount <= 0 ? '' : emiAmount.toFixed(2),
        }));
    }, [
        loanFormData.sell_prc,
        loanFormData.advance_amt,
        loanFormData.advance_bal,
        loanFormData.total_payment,
        loanFormData.term,
        loanFormData.payment_frequency
    ]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!searchCustomer.customer_name || !searchCustomer.mph) {
            alert('Please select a customer or add customer');
            return;
        }

        if (searchCustomer.customer_id === 1) {
            alert('Walkin customer not allowed');
            return;
        }

        if (Number(loanFormData.payment_amount) < Number(loanFormData.loan_amount)) {
            alert('Loan amount is greater than payment amount');
            return;
        }

        if (parseFloat(loanFormData.advance_amt) > 0 && !loanFormData.advance_paydate) {
            alert("Enter advance paydate");
            return;
        }


        const loanData = {
            total_payment: loanFormData.total_payment,
            advance_amt: loanFormData.advance_amt,
            selling_price: loanFormData.sell_prc,
            payment_amount: loanFormData.payment_amount,
            loan_amount: loanFormData.loan_amount,
            interest: loanFormData.interest,
            payment_freq: loanFormData.payment_frequency,
            term: loanFormData.term,
            emi_amount: loanFormData.emi_amount,
            loan_date: date.toISOString().split('T')[0],
            next_pay_date: loanFormData.next_payment_date,
            bal_amount: parseFloat(loanFormData.payment_amount) + parseFloat(loanFormData.advance_bal ? loanFormData.advance_bal : 0),
            advance_bal: loanFormData.advance_bal ? loanFormData.advance_bal : 0,
            advance_paydate: loanFormData.advance_paydate ? loanFormData.advance_paydate : null,
            customer: searchCustomer,
            lock_id:lockId,
            ref_mph:refContact
        }

        try {
            await axios.post('http://localhost:8000/create-loan/', loanData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            alert('Loan Created successfully')
            handleReset();
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.non_field_errors);
            } else {
                alert("Something went wrong!");
            }
        }
    }

    const handleReset = () => {
        setLoanFormData({
            total_payment: '',
            advance_amt: '',
            sell_prc: '',
            loan_amount: '',
            payment_amount: '',
            term: '',
            emi_amount: '',
            interest: '',
            payment_frequency: '',
            next_payment_date: '',
            advance_bal: '',
            advance_paydate: ''
        });
        setSearchCustomer({});
    };


    return (
        <div className='container'>
            <form className='bg-white my-2 mx-4  rounded-5 shadow' autoComplete='off' onSubmit={handleSubmit}>

                <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Create Loan</h5>

                <div className='p-3'>
                    {/* customer */}
                    <div className='border rounded px-4 py-3 position-relative'>
                        <CustomerSelection searchCustomer={searchCustomer} setSearchCustomer={setSearchCustomer} refContact={refContact} setRefContact={setRefContact} lockId={lockId} setLockId={setLockId} />
                    </div>

                    {/* loan details */}
                    <div className='border rounded px-4 py-3 mt-3 position-relative'>
                        <LoanCreation loanFormData={loanFormData} setLoanFormData={setLoanFormData} />
                    </div>

                    {/* buttons */}
                    <div className='d-flex justify-content-center mt-3'>
                        <button type='submit' className="btn btn-success rounded-pill p-1 px-4 mx-2">Save</button>
                        <button type="button" className="btn btn-secondary rounded-pill p-1 px-4 mx-2" onClick={handleReset}>Reset</button>
                    </div>

                </div>

            </form>
        </div>
    )
}

function LoanCreation({ loanFormData, setLoanFormData }) {
    const date = new Date();
    const today = date.toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!["payment_frequency", "next_payment_date", "advance_paydate"].includes(name) && !/^\d*$/.test(value)) {
            return;
        }

        setLoanFormData({ ...loanFormData, [name]: value });
    };


    return (
        <>
            <h5 className="loan-title">Loan details</h5>
            <div className='row'>
                <div className="col">
                    <label htmlFor='total_payment' className="form-label">Total payment</label>
                    <input id='total_payment' type="text" name="total_payment" className="form-control"
                        value={loanFormData.total_payment || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='advance_amt' className="form-label">Advance amount</label>
                    <input id='advance_amt' type="text" name="advance_amt" className="form-control"
                        value={loanFormData.advance_amt || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='advance_bal' className="form-label">Advance Balance</label>
                    <input id='advance_bal' type="text" name="advance_bal" className="form-control"
                        value={loanFormData.advance_bal || ''} onChange={handleChange} required />
                </div>
            </div>

            <div className='row'>
                <div className="col-4">
                    <label htmlFor='sell_prc' className="form-label">Selling price</label>
                    <input id='sell_prc' type="text" name="sell_prc" className="form-control"
                        value={loanFormData.sell_prc || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='loan_amount' className="form-label">Loan amount</label>
                    <input id='loan_amount' type="text" name="loan_amount" className="form-control"
                        value={loanFormData.loan_amount || ''} onChange={handleChange} disabled />
                </div>
                <div className="col">
                    <label htmlFor='payment_amount' className="form-label">Payment amount</label>
                    <input id='payment_amount' type="text" name="payment_amount" className="form-control"
                        value={loanFormData.payment_amount || ''} onChange={handleChange} disabled />
                </div>
            </div>

            <div className='row mt-2'>
                <div className="col">
                    <label htmlFor='interest' className="form-label">Interest</label>
                    <input id='interest' type="text" name="interest" className="form-control"
                        value={loanFormData.interest} disabled />
                </div>
                <div className="col">
                    <label htmlFor='payment_frequency' className="form-label">Payment frequency</label>
                    <select id='payment_frequency' name="payment_frequency" className="form-select"
                        value={loanFormData.payment_frequency || ''} onChange={handleChange} required>
                        <option disabled value="">Select Frequency</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>
                <div className="col">
                    <label htmlFor='term' className="form-label">Term (months)</label>
                    <input id='term' type="text" name="term" className="form-control"
                        value={loanFormData.term || ''} onChange={handleChange} required />
                </div>
            </div>

            <div className='row mt-2'>
                <div className="col-4">
                    <label htmlFor='emi_amount' className="form-label">Emi amount</label>
                    <input id='emi_amount' type="text" name="emi_amount" className="form-control"
                        value={loanFormData.emi_amount || ''} onChange={handleChange} disabled />
                </div>
                <div className="col">
                    <label htmlFor='loan_date' className="form-label">Loan date</label>
                    <input id='loan_date' type="date" name="loan_date" className="form-control"
                        value={date.toISOString().split('T')[0] || ''}
                        disabled />
                </div>
                <div className="col">
                    <label htmlFor='next_payment_date' className="form-label">Next payment date</label>
                    <input id='next_payment_date' type="date" name="next_payment_date" className="form-control" min={today}
                        value={loanFormData.next_payment_date || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='advance_paydate' className="form-label">Advance pay date</label>
                    <input id='advance_paydate' type="date" name="advance_paydate" className="form-control" min={today}
                        value={loanFormData.advance_paydate || ''} onChange={handleChange} />
                </div>
            </div>

        </>
    );
}


function CustomerSelection({ searchCustomer, setSearchCustomer, refContact, setRefContact, lockId, setLockId }) {
    const [customers, setCustomers] = useState([]);
    const [customerDropdown, setCustomerDropdown] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = UseClickOutside(() => setCustomerDropdown(false));


    useEffect(() => {
        axios.get('http://localhost:8000/get-customer-list/')
            .then((response) => {
                setCustomers(response.data);
                setLoading(false);
            }).catch((error) => {
                // console.error('Error Getting Customers:', error);
                setLoading(false);
            });
    }, []);

    const handleCustomerChange = (e) => {
        const search = e.target.value.trim().toLowerCase();
        setSearchCustomer((prev) => ({ ...prev, customer_name: e.target.value }));
        setCustomerDropdown(true);

        if (search === "") {
            setFilteredCustomers([]);
            return;
        }

        if (customers?.length > 0) {
            const filtered = customers.filter((cust) =>
                (`${cust.customer_name} ${cust.mph}`.toLowerCase().includes(search))
            );

            setFilteredCustomers(filtered);
        }

    };


    const handleCustomer = (customer) => {
        setSearchCustomer(customer);
        setCustomerDropdown(false);
    };

    return (
        <>
            <h5 className="loan-title">Customer details</h5>
            <div className='row '>
                <div className="col-4">
                    <label htmlFor='customer_name' className="form-label">Customer name</label>
                    <input id='customer_name' type="text" name="customer_name" className="form-control"
                        value={searchCustomer.customer_name || ''} onChange={handleCustomerChange} required autoFocus />
                </div>
                <div className="col">
                    <label htmlFor='mph' className="form-label">Mobile number</label>
                    <input id='mph' type="text" name="mph" className="form-control"
                        value={searchCustomer.mph || ''} disabled />
                </div>
                <div className="col">
                    <label htmlFor='refContact' className="form-label">Reference contact</label>
                    <input id='refContact' type="text" name="refContact" className="form-control"
                        value={refContact || ''} onChange={(e) => setRefContact(e.target.value)} />
                </div>
                <div className="col">
                    <label htmlFor='lockId' className="form-label">Lock id</label>
                    <input id='lockId' type="text" name="lockId" className="form-control"
                        value={lockId || ''} onChange={(e) => setLockId(e.target.value)} />
                </div>

            </div>

            {customerDropdown && searchCustomer?.customer_name?.length > 0 && (
                <div ref={dropdownRef} className='dropdown-menu show mt-1' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className='table table-hover' style={{ width: '285px' }}>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Mobile Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    <tr><td colSpan='2' ><Loader size='sm' message='Fetching customers' /></td></tr>
                                ) : (
                                    customers?.length > 0 ? (
                                        filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((customer, index) => (
                                                <tr key={index} className='custom-hover' onClick={() => handleCustomer(customer)}>
                                                    <td>{customer?.customer_name}</td>
                                                    <td>{customer?.mph}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center">Matches not found</td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr><td colSpan="2" className="text-center">Customers not found</td></tr>
                                    )
                                )

                            }
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

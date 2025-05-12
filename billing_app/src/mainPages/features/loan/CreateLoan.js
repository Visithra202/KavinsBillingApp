import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import UseClickOutside from '../../hooks/UseClickOutside';


export default function CreateLoan() {
    const [loanFormData, setLoanFormData] = useState({});
    const [searchCustomer, setSearchCustomer] = useState({});
    const date = new Date();

    const calculateEmi = (amount, term, frequency) => {
        const principal = parseFloat(amount);
        const duration = frequency === 'Weekly' ? parseFloat(term) * 4 : parseFloat(term);

        if (isNaN(principal) || isNaN(duration) || duration === 0) return null;

        return Math.round(principal / duration);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!searchCustomer.customer_name || !searchCustomer.mph) {
            alert('Please select a customer or add customer')
            return;
        }

        if (Number(loanFormData.payment_amount) < Number(loanFormData.loan_amount)) {
            alert('Loan amount is greater than payment amount')
            return;
        }

        const loanData = {
            payment_amount: loanFormData.payment_amount,
            loan_amount: loanFormData.loan_amount,
            interest: loanFormData.payment_amount - loanFormData.loan_amount,
            payment_freq: loanFormData.payment_frequency,
            term: loanFormData.term,
            emi_amount: calculateEmi(loanFormData.payment_amount, loanFormData.term, loanFormData.payment_frequency),
            loan_date: date.toISOString().split('T')[0],
            next_pay_date: loanFormData.next_payment_date,
            bal_amount: parseFloat(loanFormData.payment_amount) + parseFloat(loanFormData.advance_bal?loanFormData.advance_bal : 0),
            advance_bal: loanFormData.advance_bal?loanFormData.advance_bal:0,
            advance_paydate: loanFormData.advance_paydate?loanFormData.advance_paydate:null,
            customer: searchCustomer
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
            loan_amount: '',
            payment_amount: '',
            term: '',
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
                        <CustomerSelection searchCustomer={searchCustomer} setSearchCustomer={setSearchCustomer} />
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
                    <label htmlFor='loan_amount' className="form-label">Loan amount</label>
                    <input id='loan_amount' type="text" name="loan_amount" className="form-control"
                        value={loanFormData.loan_amount || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='payment_amount' className="form-label">Payment amount</label>
                    <input id='payment_amount' type="text" name="payment_amount" className="form-control"
                        value={loanFormData.payment_amount || ''} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor='interest' className="form-label">Interest</label>
                    <input id='interest' type="text" name="interest" className="form-control"
                        value={loanFormData.payment_amount &&
                            loanFormData.loan_amount &&
                            (loanFormData.payment_amount - loanFormData.loan_amount).toFixed(2)} disabled />
                </div>
            </div>

            <div className='row mt-2'>
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
                <div className="col">
                    <label htmlFor='emi_amount' className="form-label">Emi amount</label>
                    <input id='emi_amount' type="text" name="emi_amount" className="form-control"
                        value={
                            loanFormData.payment_amount &&
                                loanFormData.term &&
                                loanFormData.payment_frequency
                                ? (() => {
                                    const principal = parseFloat(loanFormData.payment_amount);
                                    const term =
                                        loanFormData.payment_frequency === 'Weekly'
                                            ? parseFloat(loanFormData.term) * 4
                                            : parseFloat(loanFormData.term);

                                    if (isNaN(principal) || isNaN(term) || term === 0) {
                                        return '';
                                    }

                                    return (principal / term).toFixed(2);
                                })()
                                : ''
                        } onChange={handleChange} disabled />
                </div>
            </div>

            <div className='row mt-2'>
                <div className="col-4">
                    <label htmlFor='loan_date' className="form-label">Loan date</label>
                    <input id='loan_date' type="date" name="loan_date" className="form-control"
                        value={date.toISOString().split('T')[0] || ''}
                        disabled />
                </div>
                <div className="col-4">
                    <label htmlFor='next_payment_date' className="form-label">Next payment date</label>
                    <input id='next_payment_date' type="date" name="next_payment_date" className="form-control" min={today}
                        value={loanFormData.next_payment_date || ''} onChange={handleChange} required />
                </div>
            </div>

            <div className='row mt-2'>
                <div className="col-4">
                    <label htmlFor='advance_bal' className="form-label">Advance Balance</label>
                    <input id='advance_bal' type="text" name="advance_bal" className="form-control"
                        value={loanFormData.advance_bal || ''} onChange={handleChange} />
                </div>
                <div className="col-4">
                    <label htmlFor='advance_paydate' className="form-label">Advance pay date</label>
                    <input id='advance_paydate' type="date" name="advance_paydate" className="form-control" min={today}
                        value={loanFormData.advance_paydate || ''} onChange={handleChange} />
                </div>
            </div>
        </>
    );
}


function CustomerSelection({ searchCustomer, setSearchCustomer }) {
    const [customers, setCustomers] = useState([]);
    const [customerDropdown, setCustomerDropdown] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dropdownRef = UseClickOutside(() => setCustomerDropdown(false));


    useEffect(() => {
        axios.get('http://localhost:8000/get-customer-list/')
            .then((response) => {
                setCustomers(response.data);
                setLoading(false);
            }).catch((error) => {
                console.error('Error Getting Customers:', error);
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
                <div className="col col-md-4">
                    <label htmlFor='customer_name' className="form-label">Customer name</label>
                    <input id='customer_name' type="text" name="customer_name" className="form-control"
                        value={searchCustomer.customer_name || ''} onChange={handleCustomerChange} required autoFocus />
                </div>
                <div className="col col-md-4">
                    <label htmlFor='mph' className="form-label">Mobile number</label>
                    <input id='mph' type="text" name="mph" className="form-control"
                        value={searchCustomer.mph || ''} disabled />
                </div>
                <div className='col col-md-4 d-flex align-items-end' >
                    <button type='button' className="btn mx-1" style={{ backgroundColor: 'antiquewhite' }}
                        onClick={() => navigate('/customerData', { state: { from: '/createLoan' } })}>+ Add Customer</button>
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
                                customers?.length > 0 ? (
                                    loading ? (
                                        <tr><td colSpan='2' ><Loader size='sm' message='Fetching customers' /></td></tr>
                                    ) : (
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
                                    )
                                ) : (
                                    <tr><td colSpan="2" className="text-center">Customers not found</td></tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

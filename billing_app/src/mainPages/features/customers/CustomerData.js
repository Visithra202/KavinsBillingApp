import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';

export default function CustomerData() {
    const [reload, setReload] = useState(false);
    return (
        <div className='container'>
            <div className='row overflow-hidden'>
                <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
                    <CustomerList reload={reload} setReload={setReload} />
                </div>

                <div className='col h-75'>
                    <CustomerForm setReload={setReload} />
                </div>
            </div>
        </div>
    )
}

function CustomerForm({ setReload }) {
    const [formData, setFormData] = useState([]);
    const location=useLocation();
    const navigate=useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'mph' && !/^\d*$/.test(value)) {
            return;
        }
    
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const mph=formData.mph;
        if(!mph.startsWith('+91 '))
            formData.mph='+91 '+mph;

        try {
            await axios.post('http://localhost:8000/add-customer/', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setReload((prev) => !prev)
            handleReset();
            navigate(location.state?.from || '');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = error.response.data.errors || error.response.data;
                // console.log(errorMessages)
                // Show all errors in an alert
                let errorText = "Adding Customer Failed:\n";
                Object.entries(errorMessages).forEach(([field, messages]) => {
                    errorText += `${field}: ${messages.join(", ")}\n`;
                });
    
                alert(errorText);
            } else {
                alert.error("Error:", error.message);
            }
        }
    }

    const handleReset = () => {
        setFormData({
            customer_name: '',
            mph: '',
            address:''
        })
    }

    return (
        <div className='bg-white m-4  border rounded-5 shadow'>

            <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Customer</h5>


            <form onSubmit={handleSubmit} className='p-3 px-5'>
                <div className='d-flex flex-column'>
                    <label htmlFor='customer_name' className='form-label'>Customer name</label>
                    <input id='customer_name' type='text' className='form-control p-2' name='customer_name' value={formData?.customer_name||''}
                        onChange={handleChange}  required autoComplete='off'></input>
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='mph' className='form-label'>Mobile Number</label>
                    <input id='mph' type='text' className='form-control p-2' name='mph' value={formData?.mph||''}
                        onChange={handleChange} required autoComplete='off'></input>
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='address' className='form-label'>Address</label>
                    <input id='address' type='text' className='form-control p-2' name='address' value={formData?.address||''}
                        onChange={handleChange} required autoComplete='off'></input>
                </div>
                <div className='d-flex justify-content-center mt-4 '>
                    <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
                </div>

            </form>
        </div>
    )
}

function CustomerList({ reload, setReload }) {

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/get-customer-list/')
            .then((response) => {
                setCustomers(response.data)
                setLoading(false)
            })
            .catch((error) => {
                // console.error('Error Fetching Customers')
                setLoading(false)
            })
    }, [reload])

    const Loader = () => (
        <div className='text-center my-4'>
            <div className="spinner-border text-primary " role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className='mt-2'>Fetching Customers...</p>
        </div>
    );

    const handleDelete = (customer) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/delete-customer/${customer.customer_id}/`)
                .then((response) =>
                    setReload((prev) => !prev)
                ).catch((error) => {
                    alert('Error Deleting Customer')
                });
        }
    }

    return (
        <div className='container'  style={{ height: 'calc(100vh - 150px)' }}>
            <div className='d-flex justify-content-center pb-2' ><h5>Customer list</h5></div>
            <div className='scroll-bar' style={{  minHeight:'50%', maxHeight: '90%', overflowY: 'auto' }}>
                <table className="table table-light">
                    <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr>
                            <th>Customer Name</th>
                            <th>Mobile Number</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {loading ? (
                            <tr className="text-center">
                                <td colSpan="3">
                                    <Loader />
                                </td>
                            </tr>
                        ) : customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.customer_name}</td>
                                    <td>{customer.mph}</td>
                                    <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                                        onClick={() => handleDelete(customer)}></i></td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="3">Customer not found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
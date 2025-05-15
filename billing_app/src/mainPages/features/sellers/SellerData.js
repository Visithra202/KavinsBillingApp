import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';

export default function SellerData() {
    const [reload, setReload] = useState(false);
    return (
        <div className='container'>
            <div className='row overflow-hidden'>
                <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
                    <SellerList reload={reload} setReload={setReload} />
                </div>

                <div className='col h-75'>
                    <SellerForm setReload={setReload} />
                </div>
            </div>
        </div>
    )
}

function SellerForm({ setReload }) {
    const [sellerFormData, setSellerFormData] = useState([]);
    const location=useLocation();
    const navigate=useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'seller_mph' && !/^\d*$/.test(value)) {
            return;
        }
    
        setSellerFormData((prev) => ({ ...prev, [name]: value }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const seller_mph=sellerFormData.seller_mph;
        if(!seller_mph.startsWith('+91 '))
            sellerFormData.seller_mph='+91 '+seller_mph;

        try {
            await axios.post('http://localhost:8000/add-seller/', sellerFormData, {
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
                let errorText = "Adding Seller Failed:\n";
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
        setSellerFormData({
            seller_name: '',
            seller_mph: '',
            address:''
        })
    }

    return (
        <div className='bg-white m-4  border rounded-5 shadow'>

            <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Seller</h5>


            <form onSubmit={handleSubmit} className='p-3 px-5' >
                <div className='d-flex flex-column'>
                    <label htmlFor='seller_name' className='form-label'>Seller name</label>
                    <input id='seller_name' type='text' className='form-control p-2' name='seller_name' value={sellerFormData?.seller_name||''}
                        onChange={handleChange}  required autoComplete='off'/>
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='seller_mph' className='form-label'>Mobile Number</label>
                    <input id='seller_mph' type='text' className='form-control p-2' name='seller_mph' value={sellerFormData?.seller_mph||''}
                        onChange={handleChange} required autoComplete='off'/>
                </div>
                <div className='d-flex flex-column mt-3'>
                    <label htmlFor='address' className='form-label'>Address</label>
                    <input id='address' type='text' className='form-control p-2' name='address' value={sellerFormData?.address||''}
                        onChange={handleChange} required autoComplete='off'/>
                </div>
                <div className='d-flex justify-content-center mt-4 '>
                    <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
                </div>

            </form>
        </div>
    )
}

function SellerList({ reload, setReload }) {

    const [loading, setLoading] = useState(true);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/get-seller-list/')
            .then((response) => {
                setSellers(response.data)
                setLoading(false)
            })
            .catch((error) => {
                // console.error('Error Fetching Sellers')
                setLoading(false)
            })
    }, [reload])

    const Loader = () => (
        <div className='text-center my-4'>
            <div className="spinner-border text-primary " role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className='mt-2'>Fetching Sellers...</p>
        </div>
    );

    const handleDelete = (seller) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this seller?");
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/delete-seller/${seller.seller_id}/`)
                .then((response) =>
                    setReload((prev) => !prev)
                ).catch((error) => {
                    alert('Error Deleting seller')
                });
        }
    }

    return (
        <div className='container'  style={{ height: 'calc(100vh - 150px)' }}>
            <div className='d-flex justify-content-center pb-2' ><h5>Seller list</h5></div>
            <div className='scroll-bar' style={{minHeight:'50%', maxHeight: '90%', overflowY: 'auto' }}>
                <table className="table table-light">
                    <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr>
                            <th>Seller Name</th>
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
                        ) : sellers.length > 0 ? (
                            sellers.map((seller, index) => (
                                <tr key={index}>
                                    <td>{seller.seller_name}</td>
                                    <td>{seller.seller_mph}</td>
                                    <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                                        onClick={() => handleDelete(seller)}></i></td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="3">Seller not found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
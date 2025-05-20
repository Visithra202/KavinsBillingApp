import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ServiceEntry() {
    const date = new Date();

    const [serviceFormData, setServiceFormData] = useState({
        date: date.toISOString().split('T')[0],
        customer: '',
        mph: '',
        brand: '',
        model_name: '',
        issue_details: '',
        password: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target
        setServiceFormData({ ...serviceFormData, [name]: value })
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/add-service/', serviceFormData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            alert('Service added successfully')
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
        setServiceFormData({
            date: date.toISOString().split('T')[0],
            customer: '',
            mph: '',
            brand: '',
            model_name: '',
            issue_details: '',
            password: ''
        })
    }

    return (
        <div className='container w-75'>
            <form className='bg-white my-5 mx-4  rounded-5 shadow' autoComplete='off' onSubmit={handleSubmit}>

                <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Service entry</h5>

                <div className='p-3'>

                    <div className='row mt-1'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='service_date' className='form-label'>Date</label>
                            <input id='service_date' type='date' className='form-control p-2' name='service_date' value={date.toISOString().split('T')[0] || ''}
                                autoComplete="off" disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='customer' className='form-label'>Customer name</label>
                            <input id='customer' type='text' className='form-control p-2' name='customer' value={serviceFormData.customer}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='mph' className='form-label'>Contact number</label>
                            <input id='mph' type='text' className='form-control p-2' name='mph' value={serviceFormData.mph}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='brand' className='form-label'>Brand</label>
                            <input id='brand' type='text' className='form-control p-2' name='brand' value={serviceFormData.brand}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='model_name' className='form-label'>Model</label>
                            <input id='model_name' type='text' className='form-control p-2' name='model_name' value={serviceFormData.model_name}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input id='password' type='text' className='form-control p-2' name='password' value={serviceFormData.password}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col-6 d-flex flex-column'>
                            <label htmlFor='issue_details' className='form-label'>Issue details</label>
                            <input id='issue_details' type='text' className='form-control p-2' name='issue_details' value={serviceFormData.issue_details}
                                onChange={handleChange} autoComplete='off' required />
                        </div>
                    </div>

                    {/* Buttons Section */}
                    <div className='d-flex justify-content-center mt-5'>
                        <button type='submit' className="btn btn-success rounded-pill p-1 px-4 mx-2">Save</button>
                        <button type="button" className="btn btn-secondary rounded-pill p-1 px-4 mx-2" onClick={handleReset}>Reset</button>
                    </div>
                </div>

            </form >
        </div >
    )
}


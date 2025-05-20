import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';

export default function ServiceDetails() {
    const date = new Date();
    const location = useLocation();
    const navigate=useNavigate();

    const [service, setService] = useState(location.state?.service);

    useEffect(()=>{
        if(location.state)
            setService(location.state?.service)
        else
            navigate('/serviceList')
    },[location.state])

    const handlePay = () => {

    }

    const handleReceive = () => {

    }


    return (
        <div className='container w'>
            <form className='bg-white my-3 mx-4  rounded-5 shadow'>

                <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Service details</h5>

                <div className='p-3'>

                    <div className='row mt-1'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='service_date' className='form-label'>Date</label>
                            <input id='service_date' type='date' className='form-control p-2' value={service.date}
                                autoComplete="off" disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='customer' className='form-label'>Customer name</label>
                            <input id='customer' type='text' className='form-control p-2' value={service.customer}
                                disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='mph' className='form-label'>Contact number</label>
                            <input id='mph' type='text' className='form-control p-2' value={service.mph}
                                disabled />
                        </div>
                    </div>

                    <div className='row mt-2'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='brand' className='form-label'>Brand</label>
                            <input id='brand' type='text' className='form-control p-2' value={service.brand}
                                disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='model_name' className='form-label'>Model</label>
                            <input id='model_name' type='text' className='form-control p-2' value={service.model_name}
                                disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input id='password' type='text' className='form-control p-2' value={service.password}
                                disabled />
                        </div>
                    </div>

                    <div className='row mt-2'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='issue_details' className='form-label'>Issue details</label>
                            <input id='issue_details' type='text' className='form-control p-2' value={service.issue_details}
                                disabled />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='paid_amt' className='form-label'>Paid amount</label>
                            <input id='paid_amt' type='text' className='form-control p-2' value={service.paid_amt||''}
                                />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='paid_date' className='form-label'>Paid date</label>
                            <input id='paid_date' type='text' className='form-control p-2' value={service.paid_date||''}
                                />
                        </div>
                    </div>

                    <div className='row mt-2'>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='received_amt' className='form-label'>Received Amount</label>
                            <input id='received_amt' type='text' className='form-control p-2' value={service.received_amt||''}
                                />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='received_date' className='form-label'>Received Date</label>
                            <input id='received_date' type='text' className='form-control p-2' value={service.received_date||''}
                                />
                        </div>
                        <div className='col d-flex flex-column'>
                            <label htmlFor='balance' className='form-label'>Balance</label>
                            <input id='balance' type='text' className='form-control p-2' value={service.balance||''}
                                />
                        </div>

                    </div>

                    {/* Buttons Section */}
                    <div className='d-flex justify-content-center mt-5'>
                        <button className="btn btn-success rounded-pill p-1 px-4 mx-2" onClick={handlePay}>Pay amount</button>
                        <button className="btn btn-secondary rounded-pill p-1 px-4 mx-2" onClick={handleReceive}>Receive amount</button>
                    </div>
                </div>

            </form >
        </div >
    )
}


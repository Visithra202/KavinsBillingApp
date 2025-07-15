import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import UseClickOutside from '../../hooks/UseClickOutside';
import Loader from '../../components/Loader';

export default function ServiceDetails() {
    const date = new Date();
    const location = useLocation();
    const navigate = useNavigate();

    const [service, setService] = useState(location.state?.service);

    useEffect(() => {
        if (location.state?.service)
            setDetails(true)
    }, [location.state])

    const [details, setDetails] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [dropdown, setDropdown] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [filteredService, setFilteredService] = useState([]);

    const [loading, setLoading] = useState(true);

    const dropdownRef = UseClickOutside(() => setDropdown(false));

    useEffect(() => {
        axios.get('http://localhost:8000/get-service-list/')
            .then((response) => {
                setServiceList(response.data)
                setLoading(false);
            })
            .catch((error) => {
                // console.error('Error Fetching Service')
                setLoading(false);
            })
    }, [])

    const handleChange = (e) => {
        const search = e.target.value;
        setSearchTerm(search);
        setDropdown(true);
        const terms = search.toLowerCase().split(/\s+/); 

        const filtered = serviceList.filter((serviceData) => {
            const combinedString = `${serviceData.customer} ${serviceData.mph} ${serviceData.brand} ${serviceData.date}`.toLowerCase();

            return terms.every(term => combinedString.includes(term));
        });

        setFilteredService(filtered);

    };

    const handleDisplayService = (serviceData) => {
        setService(serviceData);
        setDetails(true);
        setFilteredService(false);
        setSearchTerm('');
    }



    return (
        <div className='container'>

            {/* Search */}
            <div className='row mt-2 mb-1 mx-0'>
                <input id='search_service' className='form-control border rounded px-2 ' type='text' placeholder='Search service' style={{ width: '300px' }}
                    value={searchTerm} onChange={handleChange} autoFocus autoComplete="off" />

                {dropdown && searchTerm.length > 0 && (
                    <div ref={dropdownRef} className='dropdown-menu show mt-5' style={{ maxHeight: '500px', overflowY: 'auto', width: '400px' }}>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer name</th>
                                    <th>Mobile</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <Loader message='Fetching services' />
                                ) :
                                    (
                                        serviceList.length > 0 ? (
                                            filteredService.length > 0 ? (
                                                filteredService.map((ser, index) => (
                                                    <tr key={index} onClick={() => handleDisplayService(ser)}>
                                                        <td>{ser.date}</td>
                                                        <td>{ser.customer}</td>
                                                        <td>{ser.mph}</td>
                                                        <td>{ser.brand}</td>
                                                        <th>{ser.model_name}</th>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className='text-center'><td colSpan='2'>Matches not found</td></tr>
                                            )
                                        ) : (
                                            <tr className='text-center'><td colSpan='2'>Service not found</td></tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!details &&
                <div className='text-center fs-5 mt-5'><i className='bi bi-search me-2'></i>Search service to display</div>
            }

            {details &&


                <div className='row bg-light mx-0 mt-3 p-3 border rounded shadow d-flex'>

                    <div className='row'>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Service id</span>
                            <span className='service-control'>{service.service_id || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Date</span>
                            <span className='service-control'>{service.date || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Customer name</span>
                            <span className='service-control'>{service.customer || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Customer no</span>
                            <span className='service-control'>{service.mph || ''}</span>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Brand</span>
                            <span className='service-control'>{service.brand || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Model</span>
                            <span className='service-control'>{service.model_name || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Password</span>
                            <span className='service-control'>{service.password || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Issue</span>
                            <span className='service-control'>{service.issue_details || ''}</span>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Paid date</span>
                            <span className='service-control'>{service.paid_date || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Paid amount</span>
                            <span className='service-control'>{service.paid_amt || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Received date</span>
                            <span className='service-control'>{service.received_date || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Received amount</span>
                            <span className='service-control'>{service.received_amt || ''}</span>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Paid payment</span>
                            <span className='service-control'>{service.paidpayment_type || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Received payment</span>
                            <span className='service-control'>{service.receivedpayment_type || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Discount</span>
                            <span className='service-control'>{service.discount || ''}</span>
                        </div>
                        <div className='col d-flex flex-column'>
                            <span className='form-label'>Balance</span>
                            <span className='service-control'>{service.balance || ''}</span>
                        </div>
                    </div>


                    <div className='row'>
                        <div className='col-3 d-flex flex-column'>
                            <span className='form-label'>Income</span>
                            <span className='service-control'>{service.income || ''}</span>
                        </div>
                        <div className='col-3 d-flex flex-column'>
                            <span className='form-label'>Receivable amount</span>
                            <span className='service-control'>{service.receivable_amt || ''}</span>
                        </div>
                        <div className='col-3 d-flex flex-column'>
                            <span className='form-label'>Status</span>
                            <span className='service-control'>{service.service_status || ''}</span>
                        </div>
                    </div>
                </div>
            }

        </div >
    )
}


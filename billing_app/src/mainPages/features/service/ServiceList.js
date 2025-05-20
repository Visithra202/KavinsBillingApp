import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function ServiceList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceList, setServiceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredServices, setFilteredServices] = useState([]);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    const [showPayModal, setShowPayModal] = useState(false);
    const [paidAmount, setPaidAmount] = useState('');
    const [receivableAmount, setReceivableAmount] = useState('');
    const [selectedPayService, setSelectedPayService] = useState(null);

    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const [selectedReceiveService, setSelectedReceiveService] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/get-service-list/')
            .then((response) => {
                setServiceList(response.data);
                setFilteredServices(response.data);
                setLoading(false);
            })
            .catch((error) => {
                // console.error('Error Fetching Services')
                setLoading(false);
            })
    }, [reload])

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredServices(serviceList);
        } else {
            const filtered = serviceList.filter((ser) => {
                const customer = ser.customer.toLowerCase();
                const mph = ser.mph;
                const brand = ser.brand.toLowerCase();
                const model = ser.model_name.toLowerCase();
                const issue_details = ser.issue_details.toLowerCase();

                const term = searchTerm.toLowerCase();
                return customer.includes(term) || brand.includes(term) || mph.includes(term) || model.includes(term) || issue_details.includes(term);
            });
            setFilteredServices(filtered);
        }
    }, [searchTerm, serviceList]);

    const handlePay = (service) => {
        setSelectedPayService(service);
        setPaidAmount('');
        setReceivableAmount('');
        setShowPayModal(true);
    };

    const handleReceive = (service) => {
        setSelectedReceiveService(service);
        setReceivedAmount('');
        setDiscount('');
        setShowReceiveModal(true);
    }


    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePayModalSubmit = async () => {
        if (!selectedPayService) return;

        if (!paidAmount || isNaN(paidAmount) || Number(paidAmount) <= 0) {
            alert('Enter valid paid  amount');
            return;
        }

        if (!receivableAmount || isNaN(receivableAmount) || Number(receivableAmount) <= 0) {
            alert('Enter valid service charge')
            return;
        }

        if (Number(paidAmount) > Number(receivableAmount)) {
            alert('Paid amount must be less than receivable amount')
            return;
        }

        const formData = {
            service_id: selectedPayService.service_id,
            paid_amt: Number(paidAmount),
            receivable_amt: Number(receivableAmount),

        };

        // console.log(selectedPayService)
        // console.log(formData);

        try {
            await axios.patch('http://localhost:8000/add-service-paid-amount/', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setReload((prev) => !prev)
            setShowPayModal(false);
        } catch (error) {
            // console.error('Payment submission failed:', error);
            alert('Failed to submit payment. Please try again.');
        }
    };

    const handleReceiveModalSubmit = async () => {
        if (!selectedReceiveService) return;

        if (Number(selectedReceiveService.paid_amt) === 0) {
            alert('Pay first')
            return;
        }

        if (isNaN(receivedAmount) || Number(receivedAmount) <= 0) {
            alert('Enter valid received amount');
            return;
        }

        if (discount && (isNaN(discount) || Number(discount) < 0)) {
            alert('Enter valid discount')
            return;
        }

        if (Number(receivedAmount) < Number(discount)) {
            alert('Discount must be less than the received amount')
            return;
        }

        if (Number(receivedAmount) + Number(discount) + Number(selectedReceiveService.received_amt) + Number(selectedReceiveService.discount)> Number(selectedReceiveService.receivable_amt)) {
            alert(`Receivable amount is ${selectedReceiveService.receivable_amt}`)
            return;
        }

        const formData = {
            service_id: selectedReceiveService.service_id,
            received_amt: Number(receivedAmount),
            discount: Number(discount)
        };

        try {
            await axios.patch('http://localhost:8000/add-service-receive-amount/', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setReload((prev) => !prev);
            setShowReceiveModal(false);
        } catch (error) {
            alert('Failed to submit payment. Please try again.');
        }
    };


    return (
        <div className='container' style={{ height: 'calc(100vh - 85px)' }}>

            <div>
                <input id='search'
                    className='form-control border rounded px-2 my-3'
                    type='text'
                    placeholder='Search...'
                    style={{ width: '300px' }}
                    value={searchTerm}
                    onChange={handleChange}
                    autoComplete="off"
                />
            </div>

            <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
                style={{ minHeight: '90%', maxHeight: '90%', overflowY: 'auto' }}>
                <table className='itmlst table table-hover'>
                    <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Password</th>
                            <th>Issue</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>

                    <tbody className='px-4 py-1'>
                        {loading ? (
                            <tr className='text-center'><td colSpan='9'><Loader message='Fetching Services' /></td>
                            </tr>
                        ) : (
                            filteredServices.length > 0 ? (
                                filteredServices.map((ser, index) => (
                                    <tr key={index}>
                                        <td>{ser.date}</td>
                                        <td onClick={() => navigate('/serviceDetails', { state: { service: ser } })}>{ser.customer}</td>
                                        <td>{ser.mph}</td>
                                        <td>{ser.brand}</td>
                                        <td>{ser.model_name}</td>
                                        <td>{ser.password}</td>
                                        <td>{ser.issue_details}</td>
                                        <td className='text-center'>
                                            {Number(ser.paid_amt) === 0 && <button className='btn btn-primary rounded-pill px-3 py-1 mx-1' onClick={() => handlePay(ser)}>Pay</button>}
                                            <button className='btn btn-secondary rounded-pill px-3 py-1 mx-1' onClick={() => handleReceive(ser)}>Receive</button>
                                        </td>
                                    </tr>
                                ))

                            ) : (
                                <tr className='text-center'><td colSpan='9'>No Services Found</td></tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {showPayModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title">Pay amount</h6>
                                <button type="button" className="btn-close btn-sm" style={{ width: '1rem', height: '1rem' }} onClick={() => setShowPayModal(false)} ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Paid Amount</label>
                                    <input type="number" className="form-control" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Service Charge</label>
                                    <input type="number" className="form-control" value={receivableAmount} onChange={(e) => setReceivableAmount(e.target.value)} required />
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={handlePayModalSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showReceiveModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title">Receive amount</h6>
                                <button type="button" className="btn-close btn-sm" style={{ width: '0.5rem', height: '0.5rem' }} onClick={() => setShowReceiveModal(false)} ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Received amount</label>
                                    <input type="text" className="form-control" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Discount</label>
                                    <input type="text" className="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={handleReceiveModalSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

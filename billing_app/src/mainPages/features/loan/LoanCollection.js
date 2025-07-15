import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function LoanCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totalDueSum, setTotalDueSum] = useState(0);
  const [todayCollection, setTodayCollection] = useState(0);
  const [info, setInfo] = useState(false);

  const [loans, setLoans] = useState([]);

  const [selectedLoan, setSelectedLoan] = useState({});
  const [days, setDays] = useState('');
  const [infoLoad, setInfoLoad] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/get-collection-list/')
      .then((response) => {
        const data = response.data.overdue_loans;
        setCollections(data);
        setFilteredCollections(data);
        setTotalDueSum(response.data.totalDueSum)
        setTodayCollection(response.data.today_collection);
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching collections');
        setLoading(false);
      });

    axios.get('http://localhost:8000/get-loan-list/')
      .then((response) => {
        setLoans(response.data)
      })
      .catch((error) => {
        // console.error('Error Fetching loans');
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCollections(collections);
    } else {

      const terms = searchTerm.toLowerCase().split(/\s+/);

      const filtered = collections.filter((collect) => {
        const name = collect.customer.customer_name.toLowerCase();
        const mph = collect.customer.mph.toLowerCase();
        const accno = collect.loan_accno.toLowerCase();

        return terms.every(term =>
           name.includes(term) || mph.includes(term) || accno.includes(term)
          );
      });
      setFilteredCollections(filtered);
    }
  }, [searchTerm, collections]);


  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNavigate = (accno) => {
    const loan = loans.find(loan => loan.loan_accno === accno);
    console.log(loan);
    navigate('/loanDetails', { state: { loan } })
  }

  const handleInfo = async (collect) => {
    setSelectedLoan(collect);
    setInfo(true);
    setInfoLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/get-loan-info/${collect.loan_accno}`);
      setCustomerInfo(response.data);
    } catch (error) {
      console.error('Error fetching loan info:', error);
    } finally {
      setInfoLoading(false);
    }
  };


  const handleInfoSubmit = async () => {

    if (Number(days) <= 0) {
      alert('Enter valid days')
      return;
    }

    try {
      setInfoLoad(true);
      await axios.post('http://localhost:8000/add-loan-info', {
        loan_accno: selectedLoan.loan_accno,
        days: Number(days)
      }).then(response => {
        alert(response.data.message);
      })
      setDays('');
      setSelectedLoan({});
      setInfo(false);
    } catch {
      alert('Error adding information');
    }
    finally {
      setInfoLoad(false);
    }
  }

  const handleChangeDays = (e) => {
    const val = e.target.value;
    if (val < 0)
      return;
    setDays(val);
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 65px)' }}>
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <input id='search'
            className='form-control border rounded px-2 my-2'
            type='text'
            placeholder='Search by name, number or acc no...'
            style={{ width: '300px' }}
            value={searchTerm}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className='d-flex' style={{ fontWeight: '600', fontSize: '14px' }}>
          <div>
            <span>Sum of total due : </span><span>{totalDueSum}</span>
          </div>
          <div>
            <span className='ms-4'>Count : </span><span>{collections.length}</span>
          </div>
          <div>
            <span className='ms-4'>Today collected : </span><span>{todayCollection}</span>
          </div>
        </div>

      </div>

      <div
        className='border border-secondary bg-white rounded-5 shadow mb-2 scroll-bar'
        style={{ minHeight: '90%', maxHeight: '90%', overflowY: 'auto' }}
      >
        <table className='itmlst table table-hover align-middle'>
          <thead
            className='rounded-top-5'
            style={{ position: 'sticky', top: '0', zIndex: '1' }}
          >
            <tr>
              <th>Loan Acc No</th>
              <th>Customer name</th>
              <th>Customer number</th>
              <th>Freq</th>
              <th>OD days</th>
              <th className='text-end'>Due amount</th>
              <th className='text-end'>Late fee</th>
              <th className='text-end'>Total due</th>
              <th className='text-center'>Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className='text-center'>
                <td colSpan='9'>Loading...</td>
              </tr>
            ) : filteredCollections.length > 0 ? (
              filteredCollections.map((collect, index) => (
                <tr key={index}>
                  <td className='text-primary' style={{ cursor: 'pointer' }} onClick={() => handleNavigate(collect.loan_accno)}>{collect.loan_accno}</td>
                  <td>{collect.customer.customer_name}</td>
                  <td>{collect.customer.mph}</td>
                  <td>{collect.frequency}</td>
                  <td>{collect.od_days}</td>
                  <td className='text-end'>{collect.due_amount}</td>
                  <td className='text-end'>{collect.late_fee}</td>
                  <td className='text-end'>
                    {(parseFloat(collect.due_amount) + parseFloat(collect.late_fee)).toFixed(2)}
                  </td>
                  <td className='text-center' style={{ cursor: 'pointer' }}>
                    <button className='btn py-0 px-2 border-0' type='button' title='Collect'
                      onClick={() => navigate('/addLoanPayment', { state: { collect } })}><i className="bi bi-cash-stack fs-5 text-primary"></i>
                    </button>
                    <button className='btn py-0 px-2 border-0' type='button' title='Info'
                      onClick={() => handleInfo(collect)} ><i className="bi bi-info-circle-fill text-success fs-5 "></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='text-center'>
                <td colSpan='9'>Collection not found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {info && (
        <div className='modal show fade d-block' tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog modal-dialog-centered modal-lg'>
            <div className='modal-content' >

              <div className="modal-header">
                <h6 className="modal-title">Add Information</h6>
                <button type="button" className="btn-close btn-sm" onClick={() => setInfo(false)} ></button>
              </div>

              <div className='container row'>
                <div className='col'>
                  <div className='modal-body'>
                    <div className="mb-3">
                      <label htmlFor='loan_id' className="form-label">Customer name</label>
                      <input id='loan_id' type='text' className="form-control" value={selectedLoan.customer.customer_name} disabled />
                    </div>
                    <div className="mb-3">
                      <label htmlFor='days' className="form-label">Commited in (days)</label>
                      <input id='days' type="number" className="form-control" value={days} onChange={handleChangeDays} required onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                      <button type="button" className="btn btn-primary" onClick={handleInfoSubmit} disabled={infoLoad}>Submit</button>
                    </div>
                  </div>
                </div>

                <div className='col px-0 py-0'>
                  <div className='modal-body' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className='table mt-0 text-center'>
                      <thead style={{ position: 'sticky', top: '-18px', zIndex: '1' }}>
                        <tr>
                          <th>Due date</th>
                          <th>Days</th>
                          <th>Extended date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          infoLoading ? (
                            <tr><td colSpan={3}><Loader message='' /></td></tr>
                          ) :
                            (customerInfo.length > 0 ? (
                              customerInfo.map((inf, index) => (
                                <tr key={index}>
                                  <td>{inf.date}</td>
                                  <td>{inf.commited_in}</td>
                                  <td>{inf.extended_date}</td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan={3}>Info not found</td></tr>
                            ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}


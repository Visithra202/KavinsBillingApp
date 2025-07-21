import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function LoanCollection() {

  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);

  const [info, setInfo] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  const [selectedLoan, setSelectedLoan] = useState({});
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/get-collection-list/?page=${page}`)
      .then((response) => {
        const data = response.data.results;
        setCollections(data);
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching collections');
        setLoading(false);
      });
  }, [page])


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

  return (
    <div className='container' style={{ height: 'calc(100vh - 65px)' }}>

      <div className='d-flex justify-content-between align-items-center'>
        <CollectionSummary collections={collections} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          page={page} setPage={setPage} totalPages={totalPages} />
      </div>

      <div
        className='border border-secondary bg-white rounded-5 shadow mb-2 scroll-bar'
        style={{ minHeight: '90%', maxHeight: '90%', overflowY: 'auto' }}>
        <CollectionTable collections={collections} handleInfo={handleInfo} setCollections={setCollections}
          loading={loading} />
      </div>

      {info && (
        <div className='modal show fade d-block' tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <CollectionInfo setInfo={setInfo} selectedLoan={selectedLoan} infoLoading={infoLoading} customerInfo={customerInfo} setCollections={setCollections} setSelectedLoan={setSelectedLoan} />
        </div>
      )}

    </div>
  )
}

function CollectionSummary({ collections, searchTerm, setSearchTerm, page, setPage, totalPages }) {
  const [totalDueSum, setTotalDueSum] = useState(0);
  const [todayCollection, setTodayCollection] = useState(0)
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/get-collection-data/')
      .then(response => {
        setTotalDueSum(response.data.totalDueSum)
        setTodayCollection(response.data.todayCollection)
        setTotalCount(response.data.totalCount)
      }).catch(error => {
        // console.log(error)
      })
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
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

      <div className='d-flex justify-content-center align-items-center' style={{ fontWeight: '600', fontSize: '14px' }}>
        <div>
          <span>Sum of total due : </span><span>{totalDueSum.toFixed(2)}</span>
        </div>

        <div>
          <span className='ms-4'>Count : </span><span>{totalCount}</span>
        </div>

        <div>
          <span className='ms-4'>Today collected : </span><span>{todayCollection.toFixed(2)}</span>
        </div>

        <div className='ms-4'>
          <button className='btn btn-sm border' disabled={page === 1} onClick={() => setPage(1)}>
            <i className="bi bi-caret-left-square-fill"></i>
          </button>
          <button className='btn btn-sm border' disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <i className='bi bi-caret-left-fill'></i>
          </button>
          <button className='btn btn-sm border' disabled>{page}/{totalPages}</button>
          <button className='btn btn-sm border' disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <i className='bi bi-caret-right-fill'></i>
          </button>
          <button className='btn btn-sm border' disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            <i className="bi bi-caret-right-square-fill"></i>
          </button>
        </div>

      </div>

    </>
  )
}


function CollectionTable({ loading, collections, handleInfo, setCollections }) {

  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [lockingLoanId, setLockingLoanId] = useState(null);


  const handleNavigate = (accno) => {
    const loan = loans.find(loan => loan.loan_accno === accno);
    navigate('/loanDetails', { state: { loan } })
  }

  useEffect(() => {
    axios.get('http://localhost:8000/get-loan-list/')
      .then((response) => {
        setLoans(response.data)
      })
      .catch((error) => {
        // console.error('Error Fetching loans');
      });
  }, []);

  const handleLock = async (loan) => {
    setLockingLoanId(loan.loan_accno);
    try {
      const response = await axios.post(`http://localhost:8000/lock-mobile/${loan.loan_accno}`);
      const updatedLockStatus = response.data.lock_sts;

      setCollections(prevList => prevList.map(item =>
        item.loan_accno === loan.loan_accno
          ? { ...item, lock_sts: updatedLockStatus }
          : item
      ));
    } catch (error) {
      alert('Error in lock or unlock: ' + error.message);
    } finally {
      setLockingLoanId(null);
    }
  };

  return (
    <>
      <table className='itmlst table table-hover align-middle'>
        <thead className='rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1' }}>
          <tr>
            <th>Loan Acc No</th>
            <th>Customer name</th>
            <th>Customer number</th>
            <th>Freq</th>
            <th>OD days</th>
            <th className='text-end'>Due amount</th>
            <th className='text-end'>Late fee</th>
            <th className='text-end'>Total due</th>
            <th className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className='text-center'>
              <td colSpan='9'>Loading...</td>
            </tr>
          ) : collections?.length > 0 ? (
            collections.map((collect, index) => {
              const rowClass = collect.extended_date && today < collect.extended_date
                ? 'table-warning'
                : collect.od_days > 10
                  ? 'table-danger'
                  : '';
              return (
                <tr key={index} className={rowClass}>
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
                    <button className='btn px-2 py-0 m-0 border-0' type='button' onClick={() => handleLock(collect)} disabled={lockingLoanId === collect.loan_accno}>
                      {collect.lock_sts
                        ? <i className="bi bi-lock-fill text-danger fs-5"></i>
                        : <i className="bi bi-unlock-fill fs-5"></i>}
                    </button>
                  </td>

                </tr >)
            })
          ) : (
            <tr className='text-center'>
              <td colSpan='9'>Collection not found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function CollectionInfo({ setInfo, selectedLoan, infoLoading, customerInfo, setCollections, setSelectedLoan }) {

  const [extendDate, setExtendDate] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [infoLoad, setInfoLoad] = useState(false);


  const handleInfoSubmit = async () => {

    if (new Date(extendDate) < new Date(today)) {
      alert('Enter valid Extend date');
      return;
    }

    const formattedDate = new Date(extendDate).toISOString().split('T')[0]

    try {
      setInfoLoad(true);
      const response = await axios.post('http://localhost:8000/add-loan-info', {
        loan_accno: selectedLoan.loan_accno,
        extended_date: formattedDate
      });


      setCollections(prev =>
        prev.map(loan =>
          loan.loan_accno === selectedLoan.loan_accno
            ? { ...loan, extended_date: formattedDate }
            : loan
        )
      );

      alert(response.data.message);
      setExtendDate('');
      setSelectedLoan({});
      setInfo(false);
    } catch {
      alert('Error adding information');
    } finally {
      setInfoLoad(false);
    }
  };


  const handleChangeDate = (e) => {
    setExtendDate(e.target.value);
  }


  return (
    <>
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
                  <input id='loan_id' type='text' className="form-control" value={selectedLoan?.customer?.customer_name} disabled />
                </div>
                <div className='mb-3'>
                  <label htmlFor='extend_date' className='form-label'>Extended date</label>
                  <input id='extend_date' type='date' className='form-control' value={extendDate} onChange={handleChangeDate} required min={today} />
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
                        <Loader message='' />
                      ) :
                        (customerInfo?.length > 0 ? (
                          customerInfo.map((inf, index) => (
                            <tr key={index}>
                              <td>{inf.date}</td>
                              <td>{inf.committed_in}</td>
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
    </>
  )
}
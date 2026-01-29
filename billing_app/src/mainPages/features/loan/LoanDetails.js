import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import UseClickOutside from '../../hooks/UseClickOutside';

export default function LoanDetails() {
  const location = useLocation();
  const [loan, setLoan] = useState(location.state?.loan || {});
  const [details, setDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [loanList, setLoanList] = useState([]);
  const [filteredLoan, setFilteredLoan] = useState([]);

  const [loanJournal, setLoanJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dropdownRef = UseClickOutside(() => setDropdown(false));

  const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const [reversing, setReversing] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/get-loan-list/')
      .then((res) => {
        setLoanList(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loan?.loan_accno) {
      setDetails(true);
      getJournals(loan.loan_accno);
    }
  }, [loan]);

  const getJournals = (accno) => {
    axios.get(`http://localhost:8000/get-loan-journal/${accno}/`)
      .then((res) => setLoanJournal(res.data));
  };

  const handleChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setDropdown(true);

    const terms = term.split(/\s+/);
    const filtered = loanList.filter(l =>
      terms.every(t =>
        `${l.loan_accno} ${l.customer?.customer_name || ''} ${l.loan_date}`.toLowerCase().includes(t)
      )
    );
    setFilteredLoan(filtered);
  };

  const handleDisplayLoan = (loanData) => {
    setLoan(loanData);
    setDetails(true);
    setSearchTerm('');
    setDropdown(false);
  };

  const handleEditClick = (fieldName, currentValue) => {
    setEditField(fieldName);
    setEditValue(currentValue || '');
    setShowModal(true);
  };

  const handleSaveField = async () => {
    try {
      if (['mph'].includes(editField)) {
        // update customer
        await axios.patch(`http://localhost:8000/update-customer/${loan.customer.customer_id}/`, {
          [editField]: editValue
        });
        setLoan(prev => ({
          ...prev,
          customer: {
            ...prev.customer,
            [editField]: editValue
          }
        }));
      } else {
        // update loan
        await axios.patch(`http://localhost:8000/update-loan/${loan.loan_accno}/`, {
          [editField]: editValue
        });
        console.log(editField + ':' + editValue)
        setLoan(prev => ({
          ...prev,
          [editField]: editValue
        }));
      }
    } catch (err) {
      alert('Failed to update. Try again.');
    } finally {
      setShowModal(false);
    }
  };


  const formatLabel = (field) => {
    const labels = {
      mph: 'Customer No',
      lock_id: 'Lock ID',
      ref_mph: 'Reference Contact',
    };
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleReverse = async () => {
    if (!loanJournal || loanJournal.length === 0) {
      alert("No transactions available to reverse.");
      return;
    }

    const lastjournal = loanJournal[loanJournal.length - 1];

    if (lastjournal.action_type !== 'PAYMENT') {
      alert('Reverse not allowed')
      return;
    }

    const confirm = window.confirm('Are you sure want to reverse?');

    if (confirm) {
      try {
        setReversing(true);
        const response = await axios.post(`http://localhost:8000/reverse-loan-payment/${loan.loan_accno}/`);
        alert(response.data.message);
        const loanRes = await axios.get(`http://localhost:8000/get-loan/${loan.loan_accno}/`);
        setLoan(loanRes.data);

        getJournals(loan.loan_accno);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error || "Server error");
        } else if (error.request) {
          alert("No response from server");
        } else {
          // Other errors
          alert("Error: " + error.message);
        }
      } finally {
        setReversing(false);
      }
    }
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 80px)' }}>

      {/* Search */}
      <div className='mt-2 mb-1 mx-0 d-flex justify-content-between'>
        <div>
          <input className='form-control border rounded px-2' type='text' style={{ width: '300px' }}
            placeholder='Search loan' value={searchTerm} onChange={handleChange} autoFocus autoComplete="off" />

          {dropdown && searchTerm.length > 0 && (
            <div ref={dropdownRef} className='dropdown-menu show mt-1' style={{ maxHeight: '300px', overflowY: 'auto', width: '300px' }}>
              <table className='table table-hover'>
                <thead>
                  <tr><th>Account no</th><th>Customer</th></tr>
                </thead>
                <tbody>
                  {loading ? <Loader message='Fetching loan' /> :
                    filteredLoan.length > 0 ? filteredLoan.map((l, i) => (
                      <tr key={i} onClick={() => handleDisplayLoan(l)}>
                        <td>{l.loan_accno}</td>
                        <td>{l.customer?.customer_name}</td>
                      </tr>
                    )) : <tr><td colSpan='2' className='text-center'>No matches</td></tr>
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <button className='btn btn-success' type='button' onClick={handleReverse} disabled={!(loan?.loan_accno) || reversing}>Reverse last bill</button>
        </div>
      </div>

      {!details && <div className='text-center fs-5 mt-5'><i className='bi bi-search me-2'></i>Search loan to display</div>}

      {details && <>
        <div className='row bg-light mx-0 pt-2 border rounded shadow'>
          {/* Basic Info */}
          <div className='row'>
            <Field label="Account no" value={loan.loan_accno} />
            <Field label="Customer name" value={loan.customer?.customer_name} />
            <Field label="Customer no" value={loan.customer?.mph} onEdit={() => handleEditClick('mph', loan.customer?.mph)} />
            <Field label="Loan date" value={loan.loan_date} />
            <Field label="Total payment" value={loan.total_payment} />
            <Field label="Payment amount" value={loan.payment_amount} />
            <Field label="Balance amount" value={loan.bal_amount} />
          </div>
          <div className='row'>
            <Field label="Loan amount" value={loan.loan_amount} />
            <Field label="Advance amount" value={loan.advance_amt} />
            <Field label="Selling price" value={loan.selling_price} />
            <Field label="Interest" value={loan.interest} />
            <Field label="Emi amount" value={loan.emi_amount} />
            <Field label="Payment frequency" value={loan.payment_freq} />
            <Field label="Loan type" value={loan.ln_typ === 'MOB' ? 'Mobile' : loan.ln_typ === 'ACC' ? 'Accessories' : loan.ln_typ === 'OLD' ? 'Old Loan' : 'Short loan'} />
          </div>
          <div className='row'>
            <Field label="Term" value={loan.term} />
            <Field label="Advance balance" value={loan.advance_bal} />
            <Field label="Advance paydate" value={loan.advance_paydate} />
            <Field label="Lock id" value={loan.lock_id} onEdit={() => handleEditClick('lock_id', loan.lock_id)} />
            <Field label="Reference contact" value={loan.ref_mph} onEdit={() => handleEditClick('ref_mph', loan.ref_mph)} />
            <Field label="Details" value={loan.details} />
            <div className='col d-flex align-items-center'>
              <button className='btn btn-primary rounded-pill px-3 py-1' onClick={() => navigate('/loanBills', { state: { loan } })}>show bills</button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className='row mt-3'>
          <h6>Transaction history</h6>
          <div className='px-3' style={{ height: 'calc( 100vh - 370px)', }}>
            <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
              <table className='table shadow py-2'>
                <thead className='table-light' style={{ position: 'sticky', top: '0', zIndex: 1 }}>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th className='text-end'>Debit</th>
                    <th className='text-end'>Credit</th>
                    <th className='text-end'>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loanJournal.length > 0 ? (
                    loanJournal.map((journal, index) => (
                      <tr key={journal.journal_id}>
                        <td>{journal.journal_seq}</td>
                        <td>{journal.journal_date}</td>
                        <td>{journal.description}</td>
                        <td className='text-end'>{!journal.crdr ? journal.trans_amt : ''}</td>
                        <td className='text-end'>{journal.crdr ? journal.trans_amt : ''}</td>
                        <td className='text-end'>{journal.balance_amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className='text-center'><td colSpan='6'>No Journal found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </>}

      {showModal && (
        <EditModal
          value={editValue}
          setValue={setEditValue}
          onClose={() => setShowModal(false)}
          onSave={handleSaveField}
          label={formatLabel(editField)}
        />
      )}
    </div>
  );
}

const Field = ({ label, value, onEdit }) => (
  <div className='col d-flex flex-column'>
    <span className='form-label'>
      {label}
    </span>
    <span className='loan-control'>{value}
      {onEdit && <i className='bi bi-pencil-square text-success ms-2' style={{ fontSize: '12px', cursor: 'pointer' }} onClick={onEdit}></i>}
    </span>
  </div>
);

const EditModal = ({ label, value, setValue, onClose, onSave }) => (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className="modal-title">Edit {label}</h6>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <label className="form-label">{label}</label>
          <input type="text" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  </div>
);


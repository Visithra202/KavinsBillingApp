import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoanBill() {
  const location = useLocation();
  const [loanBills, setLoanBills] = useState([]);
  const navigate = useNavigate()
  const loan = location.state?.loan || {}

  useEffect(() => {
    if (!location.state) {
      navigate('/loanList');
      return;
    }
    axios.get(`http://localhost:8000/get-acc-loan-bills/${loan?.loan_accno}`)
      .then((response) => {
        setLoanBills(response.data)
      }).catch((error) => {
        // console.error('Error fetching loan bills ' + error.response?.data)
      });

  }, [loan?.loan_accno, location.state, navigate]);


  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };



  return (
    <div className='container' style={{ height: 'calc(100vh - 85px)' }}>

      <div className='d-flex justify-content-end align-items-center mt-2'>
        <button className='btn btn-primary rounded-pill px-3 py-1' onClick={() => navigate('/payAdvanced', { state: { loan: loan, loanBills: loanBills} })}>Pay due</button>
      </div>

      <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
        style={{ minHeight: '93%', maxHeight: '93%', overflowY: 'auto' }}>
        <table className='itmlst table table-hover'>
          <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
            <tr>
              <th>#</th>
              <th>Bill date</th>
              <th>Due type</th>
              <th className='text-end'>Due amount</th>
              <th className='text-end'>Late fee</th>
              <th className='text-end'>Total due</th>
              <th className='text-center'>Paid date</th>
              <th className='text-end'>Paid amount</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loanBills.length > 0 ? (
              loanBills.map((bill, index) => (
                <tr key={index}>
                  <td>{bill.bill_seq}</td>
                  <td>{formatDate(bill.bill_date)}</td>
                  <td>{bill.due_type}</td>
                  <td className='text-end'>{bill.due_amount}</td>
                  <td className='text-end'>{bill.late_fee}</td>
                  <td className='text-end'>{bill.total_due}</td>
                  <td className='text-center'>{bill.paid_date}</td>
                  <td className='text-end'>{bill.paid_amount}</td>
                </tr>
              ))

            ) : (
              <tr className='text-center'><td colSpan='9'>bill not Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';


export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8000/get-loan-list/?page=${page}`)
      .then((response) => {
        setLoans(response.data.results)
        setTotalPages(Math.ceil(response.data.count / 12));
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        // console.error('Error fetching Loans ' + error.response.data)
      })
  }, [page])

  return (
    <div className='container' style={{ height: 'calc(100vh - 115px)' }}>

      <div className='d-flex justify-content-end mt-2'>
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


      <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
        style={{ minHeight: '100%', maxHeight: '100%', overflowY: 'auto' }}>
        <table className='itmlst table table-hover'>
          <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
            <tr>
              <th>Loan Account No</th>
              <th>Loan date</th>
              <th>Customer number</th>
              <th className='text-end'>Payment amount</th>
              <th className='text-end'>Loan amount</th>
              <th className='text-end'>EMI</th>
              <th>Term</th>
              <th>Payment frequency</th>
              <th>Next date</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loading ? <tr className='text-center'><td colSpan='9'><Loader message='fetching loans'/></td></tr> :
              loans.length > 0 ? (
                loans.map((loan, index) => (
                  <tr key={index}>
                    <td className='text-primary' style={{ cursor: 'pointer' }} onClick={() => navigate('/loanDetails', { state: { loan } })}>{loan.loan_accno}</td>
                    <td>{loan.loan_date}</td>
                    <td>
                      {loan.customer?.customer_name || ""}
                    </td>
                    <td className='text-end'>{loan.payment_amount}</td>
                    <td className='text-end'>{loan.loan_amount}</td>
                    <td className='text-end'>{loan.emi_amount}</td>
                    <td>{loan.term}</td>
                    <td>{loan.payment_freq}</td>
                    <td>{loan.next_pay_date}</td>
                  </tr>
                ))

              ) : (
                <tr className='text-center'><td colSpan='9'>Loan not Found</td></tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';


export default function LoanList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [filteredLoans, setFilteredLoans] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:8000/get-loan-list/')
      .then((response) => {
        setLoans(response.data);
        setFilteredLoans(response.data);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        // console.error('Error fetching Loans ' + error.response.data)
      })
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLoans(loans);
    } else {
      const terms = searchTerm.toLowerCase().split(/\s+/);
      const filtered = loans.filter((loan) => {
        const accno = loan.loan_accno;
        const name = loan.customer?.customer_name.toLowerCase();
        const mph = loan.customer?.mph.toLowerCase();
        return terms.every(term =>
          name.includes(term) || accno.includes(term) || mph.includes(term)
        );
      });
      setFilteredLoans(filtered);
    }
  }, [searchTerm, loans]);

  const handleChange = (e) => setSearchTerm(e.target.value);


  return (
    <div className='container' style={{ height: 'calc(100vh - 85px)' }}>
      <div className='d-flex justify-content-between align-items-center btnrow'>
        <input
          className='form-control border rounded px-2 my-2'
          type='text'
          placeholder='Search...'
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div className='border border-secondary bg-white rounded-5 shadow  my-1 scroll-bar'
        style={{ minHeight: '93%', maxHeight: '93%', overflowY: 'auto' }}>
        <table className='itmlst table table-hover'>
          <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
            <tr>
              <th>Loan Account No</th>
              <th>Loan date</th>
              <th>Customer name</th>
              <th className='text-center'>Phone</th>
              <th className='text-end'>Payment amount</th>
              <th className='text-end'>Loan amount</th>
              <th className='text-end'>EMI</th>
              <th>Term</th>
              <th>Payment frequency</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loading ? <tr className='text-center'><td colSpan='9'><Loader message='fetching loans' /></td></tr> :
              filteredLoans.length > 0 ? (
                filteredLoans.map((loan, index) => (
                  <tr key={index}>
                    <td className='text-primary' style={{ cursor: 'pointer' }} onClick={() => navigate('/loanDetails', { state: { loan } })}>{loan.loan_accno}</td>
                    <td>{loan.loan_date}</td>
                    <td>
                      {loan.customer?.customer_name || ""}
                    </td>
                    <td className='text-center'>
                      {loan.customer?.mph || ""}
                    </td>
                    <td className='text-end'>{loan.payment_amount}</td>
                    <td className='text-end'>{loan.loan_amount}</td>
                    <td className='text-end'>{loan.emi_amount}</td>
                    <td>{loan.term}</td>
                    <td>{loan.payment_freq}</td>
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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoanCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/get-collection-list/')
      .then((response) => {
        const data = response.data.overdue_loans;
        setCollections(data);
        setFilteredCollections(data); 
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching collections');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCollections(collections);
    } else {
      const filtered = collections.filter((collect) => {
        const name = collect.customer.customer_name.toLowerCase();
        const mph = collect.customer.mph.toLowerCase();
        const accno = collect.loan_accno.toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || mph.includes(term) || accno.includes(term);
      });
      setFilteredCollections(filtered);
    }
  }, [searchTerm, collections]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='container' style={{ height: 'calc(100vh - 85px)' }}>
      <div>
        <input id='search'
          className='form-control border rounded px-2 my-3'
          type='text'
          placeholder='Search by name, number or acc no...'
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div
        className='border border-secondary bg-white rounded-5 shadow my-2 scroll-bar'
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
              <th className='text-end'>Due amount</th>
              <th className='text-end'>Late fee</th>
              <th className='text-end'>Total due</th>
              <th className='text-center'>Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className='text-center'>
                <td colSpan='7'>Loading...</td>
              </tr>
            ) : filteredCollections.length > 0 ? (
              filteredCollections.map((collect, index) => (
                <tr key={index}>
                  <td>{collect.loan_accno}</td>
                  <td>{collect.customer.customer_name}</td>
                  <td>{collect.customer.mph}</td>
                  <td className='text-end'>{collect.due_amount}</td>
                  <td className='text-end'>{collect.late_fee}</td>
                  <td className='text-end'>
                    {(parseFloat(collect.due_amount) + parseFloat(collect.late_fee)).toFixed(2)}
                  </td>
                  <td
                    className='text-center'
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/addLoanPayment', { state: { collect } })}
                  >
                    <button className='btn btn-primary py-0 px-2 rounded-pill'>+collect</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='text-center'>
                <td colSpan='7'>Collection not found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


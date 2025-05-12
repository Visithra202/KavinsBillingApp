import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function CashReport() {
  const [cashList, setCashList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/get-report-cash/')
      .then((response) => {
        setCashList(response.data)
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching Cash report ' + error.response.data)
        setLoading(false);
      })
  }, [])

  return (
    <div className='container' style={{ height: 'calc(100vh - 85px)' }}>


      <div className='border border-secondary bg-white rounded-2 shadow  my-2 scroll-bar'
        style={{ minHeight: '100%', maxHeight: '100%', overflowY: 'auto' }}>
        <table className='cashreport itmlst table table-hover'>
          <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
            <tr>
              <th>Date</th>
              <th>Transaction comment</th>
              <th className='text-end'>Debit</th>
              <th className='text-end'>Credit</th>
              <th className='text-end'>Balance</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loading ?
              <tr className='text-center'><td colSpan='8' ><Loader message='fetching reports' /></td></tr>
              : cashList.length > 0 ? (
                cashList.map((cash, index) => (
                  <tr key={index}>
                    <td>{
                      (() => {
                        const d = new Date(cash.date);
                        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`
                      })()
                    }</td>
                    <td>{cash.trans_comt}</td>
                    <td className='text-end'>{cash.crdr === false ? cash.trans_amt : ''}</td>
                    <td className='text-end'>{cash.crdr === true ? cash.trans_amt : ''}</td>
                    <td className='text-end'>{cash.end_balance}</td>
                  </tr>
                ))

              ) : (
                <tr className='text-center'><td colSpan='9'>Cash report not Found</td></tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

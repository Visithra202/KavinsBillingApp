import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';


export default function AccountReport() {
  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/get-report-account/')
      .then((response) => {
        setAccountList(response.data)
        setLoading(false);
      }).catch((error) => {
        // console.error('Error fetching Cash report ' + error.response.data)
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
              <th>Transaction comment - Account report</th>
              <th className='text-end'>Debit</th>
              <th className='text-end'>Credit</th>
              <th className='text-end'>Balance</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loading ?
              <tr className='text-center'><td colSpan='8' ><Loader message='fetching reports' /></td></tr>
              : accountList.length > 0 ? (
                accountList.map((account, index) => (
                  <tr key={index}>
                    <td>{
                      (() => {
                        const d = new Date(account.date);
                        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`
                      })()
                    }</td>
                    <td>{account.trans_comt}</td>
                    <td className='text-end'>{account.crdr === false ? account.trans_amt : ''}</td>
                    <td className='text-end'>{account.crdr === true ? account.trans_amt : ''}</td>
                    <td className='text-end'>{account.end_balance}</td>
                  </tr>
                ))

              ) : (
                <tr className='text-center'><td colSpan='9'>Account report not Found</td></tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function BalanceSheetReport() {

  const [balanceList, setBalanceList] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/get-balance-sheet-report/')
      .then((response) => {
        setBalanceList(response.data)
        setLoading(false);
      }).catch((error) => {
        // console.log(error)
      })
  }, [])


  return (
    <div className='container d-flex justify-content-center align-items-center'>

      <div className='w-50 bg-light mx-0 mt-3 p-3 border rounded shadow d-flex flex-column'>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Cash Balance</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.cash_balance}</span>
          </div>
        </div>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Account Balance</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.account_balance}</span>
          </div>
        </div>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Mobile</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.mobile}</span>
          </div>
        </div>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Accessories</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.accessories}</span>
          </div>
        </div>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Loan</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.loan}</span>
          </div>
        </div>

        <div className='balance-report row d-flex justify-content-between'>
          <div className='col'>
            <span>Total</span>
          </div>
          <div className='col d-flex justify-content-end'>
            <span>{balanceList.cash_balance + balanceList.account_balance + balanceList.mobile + balanceList.accessories + balanceList.loan}.toFixed(2)</span>
          </div>
        </div>

      </div>

    </div>
  )
}

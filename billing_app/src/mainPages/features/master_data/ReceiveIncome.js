import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader';

export default function ReceiveIncome() {
  const [reload, setReload] = useState(false);
  const [mobileIncome, setMobileIncome] = useState(0);
  const [accIncome, setAccIncome] = useState(0);
  const [receiveAmt, setReceiveAmt] = useState(0);

  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <IncomeList reload={reload} setReload={setReload} setMobileIncome={setMobileIncome} setAccIncome={setAccIncome} />
        </div>

        <div className='col h-75 '>
          <ReceiveForm setReload={setReload} mobileIncome={mobileIncome} accIncome={accIncome} receiveAmt={receiveAmt} setReceiveAmt={setReceiveAmt} />
        </div>
      </div>
    </div>
  )
}

function ReceiveForm({ setReload, mobileIncome, accIncome, receiveAmt, setReceiveAmt }) {
  const [incomeType, setIncomeType] = useState('');
  const date = new Date();

  const handleChange = (e) => {
    const val = e.target.value;
    setIncomeType(val);
    if (val === 'Mobile') {
      setReceiveAmt(mobileIncome);
    } else {
      setReceiveAmt(accIncome);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (receiveAmt === 0)
      return;

    const confirmReceive = window.confirm("Are you sure want to receive the income?")

    if (confirmReceive) {
      const receiveData = {
        date: date.toISOString().split('T')[0],
        receive_amt: receiveAmt,
        income_type: incomeType
      }

      try {
        await axios.post('http://localhost:8000/receive-income/', receiveData, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        setReload((prev) => !prev)
        handleReset();
      } catch (error) {
        alert('Error Receiving Income');
      }
    }
  }

  const handleReset = () => {
    setIncomeType('');
    setReceiveAmt(0);
  }


  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Receive Income</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>
        <div className='d-flex flex-column'>
          <label htmlFor='receive_date' className='form-label'>Receive Date</label>
          <input id='receive_date' type='date' className='form-control p-2' name='date' value={date.toISOString().split('T')[0] || ''}
            autoComplete="off" disabled/>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='income_type' className='form-label'>Income type</label>
          <select id='income_type' name='income_type' className='form-select' value={incomeType || ''} onChange={handleChange} required>
            <option value="" disabled>Select type</option>
            <option value="Mobile">Mobile</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='receive_amt' className='form-label'>Receive Amount</label>
          <input id='receive_amt' type='number' className='form-control p-2' name='receive_amt' value={receiveAmt || ''}
            autoComplete='off' disabled/>
        </div>
        <div className='d-flex justify-content-center mt-4 '>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
        </div>

      </form>
    </div>
  )
}

function IncomeList({ reload, setReload, setMobileIncome, setAccIncome }) {
  const [loading, setLoading] = useState(true);
  const [mobIncomeList, setMobIncomeList] = useState([]);
  const [accIncomeList, setAccIncomeList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-income-list/')
      .then((response) => {
        setMobIncomeList(response.data.mobincome_list);
        setMobileIncome(response.data.mobile_income);
        setAccIncomeList(response.data.accincome_list);
        setAccIncome(response.data.acc_income);
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching Income List');
        setLoading(false);
      });
  }, [reload]);

  return (
    <div className='container' style={{ height: 'calc(100vh - 150px)' }}>
      <div className='d-flex justify-content-center pb-2'>
        <h5>Income List</h5>
      </div>
      <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
        <table className="table table-light">
          <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
            <tr>
              <th>Income Date</th>
              <th className='text-end'>Income Amount</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr className="text-center">
                <td colSpan="2"><Loader message='Fetching income' /></td>
              </tr>
            ) : (
              <>
                {mobIncomeList.length > 0 && (
                  <>
                    <tr className="table-secondary"><td colSpan="2">Mobile</td></tr>
                    {mobIncomeList.map((inc, index) => (
                      <tr key={`mob-${index}`}>
                        <td>{inc.income_date}</td>
                        <td className="text-end">{inc.income_amt}</td>
                      </tr>
                    ))}
                  </>
                )}
                {accIncomeList.length > 0 && (
                  <>
                    <tr className="table-secondary"><td colSpan="2">Accessories</td></tr>
                    {accIncomeList.map((inc, index) => (
                      <tr key={`acc-${index}`}>
                        <td>{inc.income_date}</td>
                        <td className="text-end">{inc.income_amt}</td>
                      </tr>
                    ))}
                  </>
                )}
                {mobIncomeList.length === 0 && accIncomeList.length === 0 && (
                  <tr className="text-center">
                    <td colSpan="2">Income not Found</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



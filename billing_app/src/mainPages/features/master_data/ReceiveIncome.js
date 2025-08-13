import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader';
import PaymentOption from '../payment/PaymentOption';

export default function ReceiveIncome() {
  const [reload, setReload] = useState(false);

  const [mobIncomeList, setMobIncomeList] = useState([]);
  const [accIncomeList, setAccIncomeList] = useState([]);
  const [serIncomeList, setSerIncomeList] = useState([]);
  const [penIncomeList, setPenIncomeList] = useState([]);
  const [intIncomeList, setIntIncomeList] = useState([]);

  const [mobInc, setMobInc] = useState(0);
  const [accInc, setAccInc] = useState(0);
  const [serInc, setSerInc] = useState(0);
  const [penInc, setPenInc] = useState(0);
  const [intInc, setIntInc] = useState(0);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get('http://localhost:8000/get-income-list/')
      .then((response) => {
        setMobIncomeList(response.data.mobincome_list);
        setAccIncomeList(response.data.accincome_list);
        setSerIncomeList(response.data.serincome_list);
        setIntIncomeList(response.data.intincome_list);
        setPenIncomeList(response.data.penincome_list);
        setMobInc(response.data.mobileInc);
        setAccInc(response.data.accInc);
        setSerInc(response.data.serviceInc);
        setIntInc(response.data.interestInc);
        setPenInc(response.data.penaltyInc);
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching Income List');
        setLoading(false);
      });
  }, [reload]);


  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <IncomeList mobIncomeList={mobIncomeList} accIncomeList={accIncomeList}
            serIncomeList={serIncomeList} penIncomeList={penIncomeList} intIncomeList={intIncomeList} loading={loading} />
        </div>

        <div className='col h-75 '>
          <ReceiveForm
            setReload={setReload} mobInc={mobInc} accInc={accInc} serInc={serInc}
            penInc={penInc} intInc={intInc} />
        </div>
      </div>
    </div>
  )
}

function ReceiveForm({ setReload, mobInc, accInc, serInc, penInc, intInc }) {
  const [incomeType, setIncomeType] = useState('');
  const [OutstandingAmt, setOutstandingAmt] = useState(0);
  const [payment, setPayment] = useState('');
  const [lastCashBal, setLastCashBal] = useState(0);
  const [lastAccBal, setLastAccBal] = useState(0);
  const [receiveAmt, setReceiveAmt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (e) => {
    setIncomeType(e.target.value);
  };

  useEffect(() => {
    console.log("Selected Type:", incomeType);
    console.log("mobInc:", mobInc, "accInc:", accInc, "serInc:", serInc, "penInc:", penInc, "intInc:", intInc);

    if (!incomeType) {
      setOutstandingAmt(0);
      return;
    }

    if (incomeType === 'Mobile') {
      setOutstandingAmt(mobInc);
    } else if (incomeType === 'Accessories') {
      setOutstandingAmt(accInc);
    } else if (incomeType === 'Service') {
      setOutstandingAmt(serInc);
    } else if (incomeType === 'Penalty') {
      setOutstandingAmt(penInc);
    } else if (incomeType === 'Interest') {
      setOutstandingAmt(intInc);
    }
  }, [incomeType, mobInc, accInc, serInc, penInc, intInc]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-last-balance/')
      .then((response) => {
        setLastCashBal(response.data.cash_bal);
        setLastAccBal(response.data.acc_bal);
      })
      .catch((error) => {
        // console.error('Error Fetching balance');
      });
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (parseFloat(receiveAmt) <= 0 || !incomeType || !payment) return;

    if (parseFloat(receiveAmt) > parseFloat(OutstandingAmt)) {
      alert('Entered amount is more');
      return;
    }

    if (payment === 'Cash' && lastCashBal < parseFloat(receiveAmt)) {
      alert("Insufficient cash balance")
      return;
    } else if (payment === 'Account' && lastAccBal < parseFloat(receiveAmt)) {
      alert('Insufficient account balance')
      return;
    }


    // const confirmReceive = window.confirm("Are you sure you want to receive the income?");
    // if (!confirmReceive) return;

    const receiveData = {
      receive_amt: parseFloat(receiveAmt),
      income_type: incomeType,
      payment: payment
    };

    try {
      await axios.post('http://localhost:8000/receive-income/', receiveData, {
        headers: { "Content-Type": "application/json" }
      });
      setReload(prev => !prev);
      handleReset();
    } catch (error) {
      alert('Error Receiving Income');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIncomeType('');
    setReceiveAmt('');
    setOutstandingAmt(0);
    setPayment('');
  };

  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Receive Income</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>

        <div className='d-flex flex-column mt-3'>
          <label htmlFor='income_type' className='form-label'>Income Type</label>
          <select id='income_type' className='form-select' value={incomeType} onChange={handleTypeChange} required>
            <option value="">Select Type</option>
            <option value="Mobile">Mobile</option>
            <option value="Accessories">Accessories</option>
            <option value="Service">Service</option>
            <option value="Penalty">Penalty</option>
            <option value="Interest">Interest</option>
          </select>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='outstanding_amt' className='form-label'>Outstanding Amount</label>
          <input id='outstanding_amt' type='number' className='form-control p-2' value={OutstandingAmt} disabled />
        </div>

        <div className='d-flex flex-column mt-3'>
          <label htmlFor='receive_amt' className='form-label'>Receive Amount</label>
          <input id='receive_amt' type='number' className='form-control p-2' value={receiveAmt} onChange={(e) => setReceiveAmt(e.target.value)} required />
        </div>

        <div className='d-flex flex-column mt-3'>
          <PaymentOption payment={payment} setPayment={setPayment} />
        </div>

        <div className='d-flex justify-content-center mt-4'>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4'>Submit</button>
        </div>
      </form>
    </div>
  );
}


function IncomeList({ loading, mobIncomeList, serIncomeList, accIncomeList, penIncomeList, intIncomeList }) {

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
                {serIncomeList.length > 0 && (
                  <>
                    <tr className="table-secondary"><td colSpan="2">Service</td></tr>
                    {serIncomeList.map((inc, index) => (
                      <tr key={`ser-${index}`}>
                        <td>{inc.income_date}</td>
                        <td className="text-end">{inc.income_amt}</td>
                      </tr>
                    ))}
                  </>
                )}
                {penIncomeList.length > 0 && (
                  <>
                    <tr className="table-secondary"><td colSpan="2">Penalty</td></tr>
                    {penIncomeList.map((inc, index) => (
                      <tr key={`pen-${index}`}>
                        <td>{inc.income_date}</td>
                        <td className="text-end">{inc.income_amt}</td>
                      </tr>
                    ))}
                  </>
                )}
                {intIncomeList.length > 0 && (
                  <>
                    <tr className="table-secondary"><td colSpan="2">Interest</td></tr>
                    {intIncomeList.map((inc, index) => (
                      <tr key={`int-${index}`}>
                        <td>{inc.income_date}</td>
                        <td className="text-end">{inc.income_amt}</td>
                      </tr>
                    ))}
                  </>
                )}
                {mobIncomeList.length === 0 && accIncomeList.length === 0 && serIncomeList.length === 0 && penIncomeList.length === 0 && intIncomeList.length === 0 && (
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





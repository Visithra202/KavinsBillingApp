import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader';
import PaymentOption from '../payment/PaymentOption';

export default function ReceiveIncome() {
  const [reload, setReload] = useState(false);
  const [receiveAmt, setReceiveAmt] = useState(0);

  const [mobIncomeList, setMobIncomeList] = useState([]);
  const [accIncomeList, setAccIncomeList] = useState([]);
  const [serIncomeList, setSerIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get('http://localhost:8000/get-income-list/')
      .then((response) => {
        setMobIncomeList(response.data.mobincome_list);
        setAccIncomeList(response.data.accincome_list);
        setSerIncomeList(response.data.serincome_list);
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
            serIncomeList={serIncomeList} loading={loading} />
        </div>

        <div className='col h-75 '>
          <ReceiveForm
            setReload={setReload} receiveAmt={receiveAmt} setReceiveAmt={setReceiveAmt}
            mobIncomeList={mobIncomeList} accIncomeList={accIncomeList} serIncomeList={serIncomeList} />
        </div>
      </div>
    </div>
  )
}

function ReceiveForm({ setReload, receiveAmt, setReceiveAmt, mobIncomeList, accIncomeList, serIncomeList }) {
  const [incomeType, setIncomeType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [incomeDates, setIncomeDates] = useState([]);
  const [payment, setPayment] = useState('');
  const [lastCashBal, setLastCashBal] = useState(0);
  const [lastAccBal, setLastAccBal] = useState(0);

  useEffect(() => {
    const allDates = [
      ...mobIncomeList.map(i => i.income_date),
      ...accIncomeList.map(i => i.income_date),
      ...serIncomeList.map(i => i.income_date)
    ];
    const uniqueDates = [...new Set(allDates)];
    setIncomeDates(uniqueDates);
  }, [mobIncomeList, accIncomeList, serIncomeList]);

  const handleTypeChange = (e) => {
    setIncomeType(e.target.value);
    updateReceiveAmt(e.target.value, selectedDate);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    updateReceiveAmt(incomeType, e.target.value);
  };

  const updateReceiveAmt = (type, date) => {
    if (!type || !date) return setReceiveAmt(0);

    let list = [];
    if (type === 'Mobile') list = mobIncomeList;
    else if (type === 'Accessories') list = accIncomeList;
    else if (type === 'Service') list = serIncomeList;

    const incomeItem = list.find(item => item.income_date === date);
    setReceiveAmt(incomeItem ? parseFloat(incomeItem.income_amt) : 0);
  };

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

    if (receiveAmt === 0 || !incomeType || !selectedDate || !payment) return;

    if (payment === 'Cash' && lastCashBal < receiveAmt) {
      alert("Insufficient cash balance")
      return;
    } else if (payment === 'Account' && lastAccBal < receiveAmt) {
      alert('Insufficient account balance')
      return;
    }


    const confirmReceive = window.confirm("Are you sure you want to receive the income?");
    if (!confirmReceive) return;

    const receiveData = {
      date: selectedDate,
      receive_amt: receiveAmt,
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
    }
  };

  const handleReset = () => {
    setIncomeType('');
    setSelectedDate('');
    setReceiveAmt(0);
    setPayment('');
  };

  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Receive Income</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>
        <div className='d-flex flex-column'>
          <label htmlFor='income_date' className='form-label'>Income Date</label>
          <select id='income_date' className='form-select' value={selectedDate} onChange={handleDateChange} required>
            <option value="">Select Date</option>
            {incomeDates.map((date, idx) => (
              <option key={idx} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className='d-flex flex-column mt-3'>
          <label htmlFor='income_type' className='form-label'>Income Type</label>
          <select id='income_type' className='form-select' value={incomeType} onChange={handleTypeChange} required>
            <option value="">Select Type</option>
            <option value="Mobile">Mobile</option>
            <option value="Accessories">Accessories</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className='d-flex flex-column mt-3'>
          <label htmlFor='receive_amt' className='form-label'>Receive Amount</label>
          <input id='receive_amt' type='number' className='form-control p-2' value={receiveAmt} disabled />
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


function IncomeList({ loading, mobIncomeList, serIncomeList, accIncomeList }) {

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
                {mobIncomeList.length === 0 && accIncomeList.length === 0 && serIncomeList.length === 0 && (
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





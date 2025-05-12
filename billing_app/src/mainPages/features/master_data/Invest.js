import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Invest() {
  const [reload, setReload] = useState(false);
  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <InvestList reload={reload} setReload={setReload}/>
        </div>

        <div className='col h-75 '>
          <InvestForm setReload={setReload} />
        </div>
      </div>
    </div>
  )
}

function InvestForm({ setReload }) {
  const [investFormData, setInvestFormData] = useState([]);
  const date = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'invest_amt' && !/^\d*$/.test(value)) {
        return;
    }
    
    setInvestFormData({ ...investFormData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const investData={
        date:date.toISOString().split('T')[0],
        invest_amt:investFormData.invest_amt,
        invest_desc:investFormData.invest_desc,
        source:investFormData.source
    }
    
    try {
      await axios.post('http://localhost:8000/add-invest/', investData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      setReload((prev) => !prev)
      handleReset();
    } catch (error) {
      alert('Error Adding Invest');
    }
  }

  const handleReset = () => {
    setInvestFormData({
      invest_date: date.toISOString().split('T')[0],
      source:'',
      invest_amt: '',
      invest_desc:''
    })
  }

  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Investment</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>
        <div className='d-flex flex-column'>
          <label htmlFor='invest_date' className='form-label'>Date</label>
          <input id='invest_date'  type='date' className='form-control p-2' name='date' value={date.toISOString().split('T')[0] }
            onChange={handleChange} autoComplete="off" disabled></input>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='source' className='form-label'>Source</label>
          <input id='source' type='text' className='form-control p-2' name='source' value={investFormData.source}
            onChange={handleChange} autoComplete='off' required></input>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='invest_amt' className='form-label'>Invest Amount</label>
          <input id='invest_amt' type='number' className='form-control p-2' name='invest_amt' value={investFormData.invest_amt}
            onChange={handleChange} autoComplete='off' required></input>
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='invest_desc' className='form-label'>Invest Description</label>
          <input id='invest_desc' type='text' className='form-control p-2' name='invest_desc' value={investFormData.invest_desc}
            onChange={handleChange} autoComplete='off' required></input>
        </div>
        <div className='d-flex justify-content-center mt-4 '>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
        </div>

      </form>
    </div>
  )
}

function InvestList({ reload, setReload }) {

  const [loading, setLoading] = useState(true);
  const [investList, setInvestList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-invest-list/')
      .then((response) => {
        setInvestList(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error Fetching Invest List')
        setLoading(false)
      })
  }, [reload])

  const Loader = () => (
    <div className='text-center my-4'>
      <div className="spinner-border text-primary " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className='mt-2'>Fetching Investments...</p>
    </div>
  );

  return (
    <div className='container' style={{ height: 'calc(100vh - 150px)'}}>
      <div className='d-flex justify-content-center pb-2' ><h5>Investments</h5></div>
      <div className='scroll-bar' style={{ minHeight:'50%', maxHeight: '90%', overflowY: 'auto' }}>
        <table className="table table-light">
          <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
            <tr>
              <th>Date</th>
              <th className='text-end'>Amount</th>
              <th className="text-center">Description</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr className="text-center">
                <td colSpan="3">
                  <Loader />
                </td>
              </tr>
            ) : investList.length > 0 ? (
              investList.map((inv, index) => (
                <tr key={index}>
                  <td>{inv.date}</td>
                  <td className='text-end'>{inv.invest_amt}</td>
                  <td >{inv.invest_desc}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3">No Invest Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
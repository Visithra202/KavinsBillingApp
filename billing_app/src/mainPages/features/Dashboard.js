import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Loader from '../components/Loader';

export default function Dashboard() {

  const formatRupees = (number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(number);
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 41vh)' }}>

      <div className='row my-3 mx-0 text-light' >
        {/* <CustomerBoard /> */}
        <SalesSummary formatRupees={formatRupees} />
        <PurchaseSummary formatRupees={formatRupees} />
        <IncomeSummary formatRupees={formatRupees}/>
        <StockSummary formatRupees={formatRupees} />
      </div>


      {/* recent transactions */}
      <h6 className='mt-2'>Recent sales</h6>

      <div className='row h-100'>
        <div className='col h-100'>
          <Recentsales />
        </div>
        <div className='col h-100'>
          <DashboardChart />
        </div>
      </div>
    </div>
  )
}


function IncomeSummary({ formatRupees }) {
  const [todayIncome, setTodayIncome] = useState('');
  const [lastWeek, setLastWeek] = useState('');
  const [lastMonth, setLastMonth] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-income-summary/')
      .then((response) => {
        setTodayIncome(response.data.today_income)
        setLastWeek(response.data.last_week_income)
        setLastMonth(response.data.last_month_income)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className='col shadow rounded-3 me-3 px-3 py-1' style={{ backgroundColor: 'rgb(65,139,202)' }}>
        <div className='d-flex align-items-center'>
        <i class="bi bi-cash-coin me-4" style={{ fontSize: '2.5rem' }}></i>
          <div className='mt-3'>
            <p className='fw-bold mb-0' style={{ fontSize: '14px' }}>INCOME</p>
            <h5 className='text-center'>{formatRupees(todayIncome)}</h5>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <p className='small mb-0'>LAST WEEK</p>
            <h6 className='text-center'>{formatRupees(lastWeek)}</h6>
          </div>
          <div>
            <p className='small mb-0'>LAST MONTH</p>
            <h6 className='text-center'>{formatRupees(lastMonth)}</h6>
          </div>
        </div>
      </div>
    </>
  )
}

function StockSummary({ formatRupees }) {
  const [totalStock, setTotalStock] = useState('');
  const [mobileStock, setMobileStock] = useState('');
  const [accessoriesStock, setAccessoriesStock] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-stock-summary/')
      .then((response) => {
        setTotalStock(response.data.total_stock)
        setMobileStock(response.data.mobile_stock)
        setAccessoriesStock(response.data.accessories_stock)
      }).catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <>
      <div className='col shadow rounded-3 px-3 py-1' style={{ backgroundColor: 'rgb(29,41,57)' }}>
        <div className='d-flex align-items-center'>
          <i className="bi bi-cart-fill me-4" style={{ fontSize: '2.5rem' }}></i>
          <div className='mt-3'>
            <p className='fw-bold mb-0' style={{ fontSize: '14px' }}>STOCKS</p>
            <h5 className='text-center'>{formatRupees(totalStock)}</h5>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <p className='small mb-0'>MOBILE</p>
            <h6 className='text-center'>{formatRupees(mobileStock)}</h6>
          </div>
          <div>
            <p className='small mb-0'>ACCESSORIES</p>
            <h6 className='text-center'>{formatRupees(accessoriesStock)}</h6>
          </div>
        </div>
      </div>
    </>
  )
}


function PurchaseSummary({ formatRupees }) {
  const [todayPurchase, setTodayPurchase] = useState('');
  const [lastWeek, setLastWeek] = useState('');
  const [lastMonth, setLastMonth] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-purchase-summary/')
      .then((response) => {
        setTodayPurchase(response.data.today_purchase_amount)
        setLastWeek(response.data.last_week_purchase)
        setLastMonth(response.data.last_month_purchase)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className='col shadow rounded-3 me-3 px-3 py-1' style={{ backgroundColor: 'rgb(28,176,154)' }}>
        <div className='d-flex align-items-center'>
          <i className="bi bi-bag-plus-fill me-4" style={{ fontSize: '2.5rem' }}></i>
          <div className='mt-3'>
            <p className='fw-bold mb-0' style={{ fontSize: '14px' }}>PURCHASE</p>
            <h5 className='text-center'>{formatRupees(todayPurchase)}</h5>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <p className='small mb-0'>LAST WEEK</p>
            <h6 className='text-center'>{formatRupees(lastWeek)}</h6>
          </div>
          <div>
            <p className='small mb-0'>LAST MONTH</p>
            <h6 className='text-center'>{formatRupees(lastMonth)}</h6>
          </div>
        </div>
      </div>
    </>
  )
}

function SalesSummary({ formatRupees }) {
  const [todaySales, setTodaySales] = useState('');
  const [lastWeek, setLastWeek] = useState('');
  const [lastMonth, setLastMonth] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-sales-summary/')
      .then((response) => {
        setTodaySales(response.data.today_sales_amount)
        setLastWeek(response.data.last_week_sales)
        setLastMonth(response.data.last_month_sales)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className='col shadow rounded-3 me-3 px-3 py-1' style={{ backgroundColor: 'rgb(223,116,114)' }}>
        <div className='d-flex align-items-center'>
          <i className="bi bi-bar-chart-fill me-4" style={{ fontSize: '2.5rem' }}></i>
          <div className='mt-3'>
            <p className='fw-bold mb-0' style={{ fontSize: '14px' }}>SALES</p>
            <h5 className='text-center'>{formatRupees(todaySales)}</h5>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <p className='small mb-0'>LAST WEEK</p>
            <h6 className='text-center'>{formatRupees(lastWeek)}</h6>
          </div>
          <div>
            <p className='small mb-0'>LAST MONTH</p>
            <h6 className='text-center'>{formatRupees(lastMonth)}</h6>
          </div>
        </div>
      </div>
    </>
  )
}


function CustomerBoard() {
  const [totalCustomers, setTotalCustomers] = useState('');
  const [lastWeek, setLastWeek] = useState('');
  const [lastMonth, setLastMonth] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-dashboard-customer-details/')
      .then((response) => {
        setTotalCustomers(response.data.total_customers)
        setLastWeek(response.data.last_week_customers)
        setLastMonth(response.data.last_month_customers)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className='col shadow rounded-3 me-3 px-3 py-1' style={{ backgroundColor: 'rgb(28,176,154)' }}>
        <div className='d-flex align-items-center'>
          <i className="bi bi-people-fill me-4" style={{ fontSize: '2.5rem' }}></i>
          <div className='mt-3'>
            <p className='fw-bold mb-0' style={{ fontSize: '14px' }}>CUSTOMERS</p>
            <h4 className='text-center'>{totalCustomers}</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <p className='small mb-0'>LAST WEEK</p>
            <h6 className='text-center'>{lastWeek}</h6>
          </div>
          <div>
            <p className='small mb-0'>LAST MONTH</p>
            <h6 className='text-center'>{lastMonth}</h6>
          </div>
        </div>
      </div>
    </>
  )
}

function Recentsales() {
  const [sale, setSale] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/recent-sales/')
      .then((response) => {
        setSale(response.data)
        setLoading(false)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (

    <div className='card shadow rounded p-3 pt-0 h-100' style={{ maxHeight: '100%', overflow: 'auto' }}>
      <table className='table'>
        <thead style={{ position: 'sticky', top: '0' }}>
          <tr>
            <th>#</th>
            <th>Sale date</th>
            <th>Bill no</th>
            <th>Customer</th>
            <th className='text-end'>Amount</th>
            <th className='text-center'>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? <tr className='text-center'><td colSpan={6}><Loader className='text-center' message='fetching sales' /></td></tr> : (
            sale.length > 0 ? sale.map((sale, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sale.sale_date}</td>
                <td>{sale.bill_no}</td>
                <td>{sale.customer__customer_name}</td>
                <td className='text-end'>{sale.total_amount}</td>
                <td className='text-center'>{sale.balance > 0 ? <span className='text-primary'>Pending</span> : <span className='text-success '>Paid</span>}</td>
              </tr>
            )) : (<tr className='text-center'><td colSpan={6}>Sale not found</td></tr>)
          )}
        </tbody>
      </table>
    </div>


  )
}


function DashboardChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/stats/last-10-days/')
      .then(res => {
        setChartData(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch chart data:', err);
      });
  }, []);
  return (
    <div className="card p-3 shadow rounded h-100">
      <h6 className="mb-3">Purchase & Sales (Last 10 Days)</h6>
      <ResponsiveContainer width="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#28a745" barSize={8} radius={[2, 2, 0, 0]} />
          <Bar dataKey="purchase" fill="#dc3545" barSize={8} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

  )
}
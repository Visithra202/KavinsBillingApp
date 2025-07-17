import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loader from '../../components/Loader';
import UseClickOutside from '../../hooks/UseClickOutside';


export default function SaleDetails() {

  const location = useLocation();
  const [sale, setSale] = useState(location.state?.sale || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [lastCashBal, setLastCashBal] = useState(0);
  const [lastAccBal, setLastAccBal] = useState(0);
  const [reload, setReload] = useState(false);

  const [loading, setLoading] = useState(true);

  const dropdownRef = UseClickOutside(() => setDropdown(false));


  useEffect(() => {
    axios.get('http://localhost:8000/get-sale-list/')
      .then((response) => {
        setSales(response.data)
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // console.error('Error Fetching Sales')
      })
  }, [reload])

  useEffect(() => {
    axios.get('http://localhost:8000/get-last-balance/')
      .then((response) => {
        setLastCashBal(response.data.cash_bal);
        setLastAccBal(response.data.acc_bal);
      })
      .catch((error) => {
        // console.error('Error Fetching balance');
      });
  }, [reload])

  const handleChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    setDropdown(true);
    const terms = search.toLowerCase().split(/\s+/);

    const filtered = sales.filter((sale) => {
      const combined = `${sale.bill_no} ${sale.customer?.customer_name || ''} ${sale.sale_date}`.toLowerCase();
      return terms.every(term => combined.includes(term));
    });

    setFilteredSales(filtered);

  };

  const handleDisplaySales = (sale) => {
    setSale(sale);
    setDropdown(false);
    setSearchTerm('');
  }

  const handleReverse = () => {

    if (sale.reversed === true) {
      alert('Sale already reversed');
      return;
    }

    if (parseFloat(sale.payment?.cash) > parseFloat(lastCashBal)) {
      alert('Insufficient cash balance');
      return;
    }

    if (parseFloat(sale.payment?.account) > parseFloat(lastAccBal)) {
      alert('Insufficient account balance');
      return;
    }

    const cnf = window.confirm('Are you sure want to reverse?');

    if (cnf) {
      axios.post(`http://localhost:8000/reverse-sale/${sale.bill_no}/`)
        .then(response => {
          alert(response.data.message);
          setReload(prev => (!prev));
          sale.reversed = true
        }).catch(error => {
          alert(error?.response?.data?.message || error?.response?.data?.error || 'An unknown error occurred');
        });

    }
  }

  return (
    <div className='container'>

      {/* Search */}
      <div className='row mt-2 mb-2 mx-0'>
        <div className='col p-0 m-0'>
          <input id='search' className='form-control border rounded px-2 ' type='text' placeholder='Search bill' style={{ width: '300px' }}
            value={searchTerm} onChange={handleChange} autoFocus autoComplete="off" />

          {dropdown && searchTerm.length > 0 && (
            <div ref={dropdownRef} className='dropdown-menu show' style={{ maxHeight: '200px', overflowY: 'auto', width: '300px', marginTop: '50px' }}>
              <table className='table table-hover' >
                <thead>
                  <tr>
                    <th>Bill no</th>
                    <th>Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <Loader message='Fetching sales' />
                  ) :
                    (
                      sales.length > 0 ? (
                        filteredSales.length > 0 ? (
                          filteredSales.map((sale, index) => (
                            <tr key={index} onClick={() => handleDisplaySales(sale)}>
                              <td>{sale.bill_no}</td>
                              <td>{sale.customer?.customer_name}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className='text-center'><td colSpan='2'>Matches not found</td></tr>
                        )
                      ) : (
                        <tr className='text-center'><td colSpan='2'>Sales not found</td></tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className='col d-flex justify-content-end'>
          <button className='btn btn-success rounded-pill p-0 px-3' type='button' onClick={handleReverse} disabled={!sale.bill_no || sale.reversed}>{sale.reversed ? 'Reversed' : 'Reverse'}</button>
        </div>

      </div>

      {/* Invoice and Customer */}
      <div className='row bg-light mt-1 mb-0 mx-0 p-2 border rounded shadow d-flex'>
        <div className='col'>
          <span className='form-label'>Bill no</span>
          <span className='form-control border rounded-pill px-2'>{sale.bill_no || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Sale date</span>
          <span className='form-control border rounded-pill px-2'>{sale.sale_date || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Customer name</span>
          <span className='form-control border rounded-pill px-2'>{sale.customer?.customer_name || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Customer number</span>
          <span className='form-control border rounded-pill px-2'>{sale.customer?.mph || ''}</span>
        </div>
      </div>

      {/* Products */}
      <div className='bg-white border rounded shadow p-3 mt-1'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Product name</th>
              <th className='text-end'>Unit price</th>
              <th className='text-end'>Quantity</th>
              <th className='text-end'>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {sale.sale_products?.length > 0 ? (
              sale.sale_products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product.item_name || ''}</td>
                  <td className='text-end'>{item.unit_price || ''}</td>
                  <td className='text-end'>{item.quantity || ''}</td>
                  <td className='text-end'>{item.total_price || ''}</td>
                </tr>
              ))
            ) : (
              <tr className='text-center'>
                <td colSpan='5'>Products not found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='row bg-light mt-1 mb-0 mx-0 p-2 border rounded shadow d-flex'>
        <div className='col'>
          <span className='form-label'>Cash</span>
          <span className='form-control border rounded-pill px-2'>{sale.payment?.cash || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Account</span>
          <span className='form-control border rounded-pill px-2'>{sale.payment?.account || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Credit</span>
          <span className='form-control border rounded-pill px-2'>{sale.payment?.credit || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Discount</span>
          <span className='form-control border rounded-pill px-2'>{sale.discount || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Total amount</span>
          <span className='form-control border rounded-pill px-2'>{sale.total_amount || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Balance</span>
          <span className='form-control border rounded-pill px-2'>{sale.balance || ''}</span>
        </div>
      </div>

    </div>
  )
}


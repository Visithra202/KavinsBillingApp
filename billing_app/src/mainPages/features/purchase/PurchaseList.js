import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function PurchaseList() {
  const [purchaseList, setPurchaseList] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/get-purchase-list/?page=${page}`)
      .then((response) => {
        setPurchaseList(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 12));
        setLoading(false);
      })
      .catch((error) => {
        // console.error('Error Fetching Purchase')
        setLoading(false);
      })
  }, [page])

  return (
    <div className='container' style={{ height: 'calc(100vh - 115px)' }}>

      <div className='d-flex justify-content-end mt-2'>
        <button className='btn btn-sm border' disabled={page === 1} onClick={() => setPage(1)}>
          <i className="bi bi-caret-left-square-fill"></i>
        </button>
        <button className='btn btn-sm border' disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          <i className='bi bi-caret-left-fill'></i>
        </button>
        <button className='btn btn-sm border' disabled>{page}/{totalPages}</button>
        <button className='btn btn-sm border' disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          <i className='bi bi-caret-right-fill'></i>
        </button>
        <button className='btn btn-sm border' disabled={page === totalPages} onClick={() => setPage(totalPages)}>
          <i className="bi bi-caret-right-square-fill"></i>
        </button>
      </div>

      <div className='border border-secondary bg-white rounded-5 shadow  my-2 scroll-bar'
        style={{ minHeight: '100%', maxHeight: '100%', overflowY: 'auto' }}>
        <table className='itmlst table table-hover'>
          <thead className='' style={{ position: 'sticky', top: '0', zIndex: '2', }}>
            <tr>
              <th>Purchase id</th>
              <th>Purchase date</th>
              <th>Seller</th>
              <th>Products</th>
              <th>Payment type</th>
              <th className='text-end'>Total amount</th>
              <th className='text-end'>Discount</th>
              <th className='text-end'>Balance</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {
              loading ? (
                <tr><td colSpan='9'><Loader message='Fetching Purchase Items' /></td></tr>
              ) : (
                purchaseList.length > 0 ? (
                  purchaseList.map((purchase, index) => (
                    <tr key={index}>
                      <td className='text-primary' onClick={() => navigate('/purchaseDetails', { state: { purchase } })} style={{ cursor: 'pointer' }}>{purchase?.purchase_id || ''}</td>
                      <td>{purchase?.purchase_date || ''}</td>
                      <td> {purchase?.seller?.seller_name || ''}</td>
                      <td>
                        {purchase?.purchase_products?.length}
                      </td>
                      <td>
                        {(() => {
                          let ans = '';
                          const payment = purchase?.purchase_payment;
                          if (!payment) return '-';
                          if (payment.cash > 0) ans += 'Cash';
                          if (payment.account > 0) ans += (ans ? ' & Account' : 'Account');
                          if (payment.credit > 0) ans += (ans ? ' & Credit' : 'Credit');
                          return ans || '-';
                        })()}
                      </td>
                      <td className='text-end'>{purchase?.total_amount || ''}</td>
                      <td className='text-end'>{purchase?.discount || ''}</td>
                      <td className='text-end'>{purchase?.balance || ''}</td>
                    </tr>
                  ))

                ) : (
                  <tr className='text-center'><td colSpan='9'>No purchase Found</td></tr>
                )
              )
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

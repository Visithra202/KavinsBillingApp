import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Loader from '../../../components/Loader';
import { useReactToPrint } from 'react-to-print';


export default function StockRequired() {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef();


  useEffect(() => {
    axios.get('http://localhost:8000/get-required-stock-list/')
      .then((response) => {
        setStockList(response.data.low_stock_categories)
        setLoading(false);
      }).catch((error) => {
        // console.error('Error fetching stock report ' + error.response.data)
        setLoading(false);
      })
  }, [])

  const handlePrint = useReactToPrint({
    contentRef
  });


  return (
    <div ref={contentRef} className='container print-area  ' style={{ height: 'calc(100vh - 85px)' }}>
      <div className='btnrow d-flex justify-content-between align-items-center mt-2'>
        <h6>Required stocks</h6>
        <button className='btn btn-primary ' onClick={handlePrint}>Print</button>
      </div>

      <div className='border border-secondary bg-white rounded-2 shadow  my-2 scroll-bar'
        style={{ minHeight: '93%', maxHeight: '93%', overflowY: 'auto' }}>
        <table className='cashreport itmlst table table-hover'>
          <thead className=' rounded-top-5' style={{ position: 'sticky', top: '0', zIndex: '1', }}>
            <tr>
              <th>Item name</th>
              <th>Category</th>
              <th className='text-center'>Quantity</th>
              <th className='text-center'>Minimum Stock</th>
            </tr>
          </thead>

          <tbody className='px-4 py-1'>
            {loading ?
              <tr className='text-center'><td colSpan='5' ><Loader message='fetching stocks' /></td></tr>
              : stockList.length > 0 ? (
                stockList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.category_name}</td>
                    <td className='text-center'>{item.total_quantity}</td>
                    <td className='text-center'>{item.min_stock}</td>
                  </tr>
                ))

              ) : (
                <tr className='text-center'><td colSpan='5'>Stock report not Found</td></tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

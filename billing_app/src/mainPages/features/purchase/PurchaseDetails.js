import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation} from 'react-router-dom';
import Loader from '../../components/Loader';
import UseClickOutside from '../../hooks/UseClickOutside';


export default function PurchaseDetails() {

  const location = useLocation();
  const [purchase, setPurchase] = useState(location.state?.purchase || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchase, setFilteredPurchase] = useState([]);

  const [loading, setLoading] = useState(true);

  const dropdownRef = UseClickOutside(() => setDropdown(false));


  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-purchase-list/')
      .then((response) => {
        setPurchases(response.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error Fetching purchases')
      })
  }, [])

  const handleChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    setDropdown(true);
    const filtered = purchases.filter((purch) =>
      (`${purch.purchase_id} ${purch.seller?.seller_name} ${purch.purchase_date} `.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredPurchase(filtered);
  };

  const handleDisplayPurchases = (purchase) => {
    setPurchase(purchase);
    setDropdown(false);
    setSearchTerm('');
  }

  return (
    <div className='container'>

      {/* Search */}
      <div className='row mt-2 mb-2 mx-0'>
        <input id='search' className='form-control border rounded px-2 ' type='text' placeholder='Search purchase' style={{ width: '300px' }}
          value={searchTerm} onChange={handleChange} autoFocus />

      {dropdown && searchTerm.length > 0 && (
        <div ref={dropdownRef} className='dropdown-menu show' style={{maxHeight:'35%', overflowY:'auto', width: '300px', marginTop:'50px'  }}>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Purchase Id</th>
                <th>Seller</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Loader message='Fetching purchases' />
              ) :
                (
                purchases.length>0?(
                  filteredPurchase.length>0?(
                    filteredPurchase.map((pur, index)=>(
                      <tr key={index} onClick={()=>handleDisplayPurchases(pur)}>
                        <td>{pur.purchase_id}</td>
                        <td>{pur.seller?.seller_name}</td>
                      </tr>
                    ))
                  ):(
                    <tr className='text-center'><td colSpan='2'>Matches not found</td></tr>
                  )
                ):(
                  <tr className='text-center'><td colSpan='2'>Purchase not found</td></tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
      
      {/* Invoice and Seller */}
      <div className='row bg-light mt-1 mb-0 mx-0 p-2 border rounded shadow d-flex'>
        <div className='col'>
          <span className='form-label'>Purchase Id</span>
          <span className='form-control border rounded-pill px-2'>{purchase.purchase_id || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Purchase date</span>
          <span className='form-control border rounded-pill px-2'>{purchase.purchase_date || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Seller name</span>
          <span className='form-control border rounded-pill px-2'>{purchase.seller?.seller_name || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Seller number</span>
          <span className='form-control border rounded-pill px-2'>{purchase.seller?.seller_mph || ''}</span>
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
            {purchase.purchase_products?.length > 0 ? (
              purchase.purchase_products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product.item_name||''}</td>
                  <td className='text-end'>{item.unit_price||''}</td>
                  <td className='text-end'>{item.quantity||''}</td>
                  <td className='text-end'>{item.total_price||''}</td>
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
          <span className='form-control border rounded-pill px-2'>{purchase.purchase_payment?.cash || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Account</span>
          <span className='form-control border rounded-pill px-2'>{purchase.purchase_payment?.account || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Credit</span>
          <span className='form-control border rounded-pill px-2'>{purchase.purchase_payment?.credit || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Discount</span>
          <span className='form-control border rounded-pill px-2'>{purchase.discount || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Total amount</span>
          <span className='form-control border rounded-pill px-2'>{purchase.total_amount || ''}</span>
        </div>
        <div className='col'>
          <span className='form-label'>Balance</span>
          <span className='form-control border rounded-pill px-2'>{purchase.balance || ''}</span>
        </div>
      </div>

    </div>
  )
}


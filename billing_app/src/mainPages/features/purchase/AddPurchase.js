import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import UseClickOutside from '../../hooks/UseClickOutside';

export default function AddPurchase() {
  const date = new Date();

  const [searchSeller, setSearchSeller] = useState('');
  const [selectedSeller, setSelectedSeller] = useState({});
  const [billNo, setBillNo] = useState('')

  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dropdown, setDropdown] = useState(null)

  const [cash, setCash] = useState(0);
  const [account, setAccount] = useState(0);
  const [credit, setCredit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const newTotal = selectedProducts.reduce((sum, product) => {
      const totalPrice = isNaN(product.total_price) ? 0 : product.total_price;
      return sum + totalPrice;
    }, 0);
    setTotalAmount(newTotal);
  }, [selectedProducts]);

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-purchase-bill-no/')
      .then((response) => {
        setBillNo(response.data.bill_no);
      })
      .catch((error) => {
        console.error('Error Fetching Bill No');
      });
  }, []);

  const handleSubmit = () => {

    if (!selectedSeller?.seller_id) {
      alert('Select a seller')
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Select atleast one product for purchase')
      return;
    }

    if ((cash + account + credit) > totalAmount) {
      alert('Entered Purchase Amount is more')
      return;
    }

    const purchaseData = {
      seller: selectedSeller,
      purchase_id: billNo,
      purchase_products: selectedProducts.map((item) => ({
        product: item.product,
        quantity: item.purchase_quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
      purchase_payment: {
        cash,
        account,
        credit
      },
      total_amount: totalAmount,
      paid_amount : cash+account+credit,
      balance: totalAmount - (cash + account + credit)

    };

    axios.post('http://192.168.1.23:8000/add-purchase/', purchaseData)
      .then(response => {
        alert('Purchase added successfully')
        handleReset();
        axios.get('http://192.168.1.23:8000/get-purchase-bill-no/')
          .then((response) => {
            setBillNo(response.data.bill_no);
          })
          .catch((error) => {
            console.error('Error Fetching Bill No');
          });
      })
      .catch(error => console.error('Error submitting purchase:', error));
  };

  const handleReset = () => {
    setSearchSeller('');
    setSelectedSeller('');
    setSelectedProducts([]);
    setCash(0);
    setAccount(0);
    setCredit(0);
    setTotalAmount(0);
  };


  return (
    <div className='container'>

      <div className='row bg-light mt-1 mb-0 mx-0 p-2 border rounded shadow d-flex'>

        <div className='col d-flex flex-column'>
          <SellerSelection dropdown={dropdown} setDropdown={setDropdown} searchSeller={searchSeller} setSearchSeller={setSearchSeller} setSelectedSeller={setSelectedSeller} />
        </div>

        <div className='col d-flex flex-column'>
          <ProductSelection dropdown={dropdown} setDropdown={setDropdown} searchProduct={searchProduct} setSearchProduct={setSearchProduct} setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts} />
        </div>

        {/* Date */}
        <div className='col d-flex flex-column'>
          <label htmlFor='purchase_date' className='form-label'>Date</label>
          <input  id='purchase_date' className='form-control border rounded-pill px-2' disabled value={date.toLocaleDateString()} style={{ width: '200px' }} />
        </div>

        {/* Bill No */}
        <div className='col d-flex flex-column'>
          <label htmlFor='bill_no' className='form-label'>Bill No</label>
          <input id='bill_no' className='form-control border rounded-pill px-2' disabled value={billNo} style={{ width: '200px' }} />
        </div>

      </div>

      {/* selected products */}
      <div className='bg-white border rounded shadow p-3 mt-1'>
        <PurchaseProducts selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
      </div>

      <div className='position-fixed bottom-0 d-flex flex-column justify-content-center align-items-center bg-light pt-2 pb-1 border rounded shadow'
        style={{ width: 'calc(100% - 250px)', left: '250px' }}>

        <div className='d-flex justify-content-between w-100 mx-5 px-4 '>
          <div className='d-flex rounded'>
            <PaymentMode cash={cash} setCash={setCash} credit={credit} setCredit={setCredit} account={account} setAccount={setAccount} />
          </div>

          <div className='d-flex'>
            <label htmlFor='total_amount' className='form-label d-flex align-items-end'>Total Amount</label>
            <input id='total_amount' className='payment border rounded ps-2 ms-2' style={{ width: '150px' }} value={totalAmount.toFixed(2)} disabled />
          </div>
        </div>

        <div>
          <button type='submit' className="btn btn-success rounded-pill p-1 px-4 mx-2" onClick={handleSubmit}>Save</button>
          <button className="btn btn-secondary rounded-pill p-1 px-4 mx-2" onClick={handleReset}>Reset</button>
        </div>
      </div>

    </div>
  )
}


// Payment Mode ---------------------------------------------------------------------------

function PaymentMode({ cash, setCash, credit, setCredit, account, setAccount }) {

  const handleCashChange = (e) => {
    if (isNaN(e.target.value)) return;
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setCash(value);
  };

  const handleAccountChange = (e) => {
    if (isNaN(e.target.value)) return;
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setAccount(value);
  };

  const handleCreditChange = (e) => {
    if (isNaN(e.target.value)) return;
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setCredit(value);
  };

  return (
    <>
      <div>
        <label htmlFor='cash' className='form-label'>Cash</label>
        <input id='cash'
          type="text" value={cash === 0 ? "" : cash} placeholder='0' className="payment border rounded ps-1 ms-2"
          style={{ width: '70px' }} onChange={handleCashChange}
        />
      </div>

      <div>
        <label htmlFor='account' className='form-label ms-2'>Account</label>
        <input id='account'
          type="text" value={account === 0 ? "" : account} placeholder='0' className="payment border rounded ms-2 ps-1"
          style={{ width: '70px' }} onChange={handleAccountChange}
        />
      </div>

      <div>
        <label htmlFor='credit' className='form-label ms-2'>Credit</label>
        <input id='credit'
          type="text" value={credit === 0 ? "" : credit} placeholder='0' className="payment border rounded ms-2 ps-1"
          style={{ width: '70px' }} onChange={handleCreditChange}
        />
      </div>
    </>
  )
}

// Purchase Products-------------------------------------------------------------------------------

function PurchaseProducts({ selectedProducts, setSelectedProducts }) {

  const handleQuantityChange = (index, newQuantity) => {
    if (isNaN(newQuantity)) return;

    const quantity = newQuantity === "" ? 0 : Number(newQuantity);

    const updatedProducts = [...selectedProducts];
    updatedProducts[index].purchase_quantity = quantity;
    updatedProducts[index].total_price = quantity * updatedProducts[index].unit_price;
    setSelectedProducts(updatedProducts);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  return (
    <>
      <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Product name</th>
            <th className='text-end'>Unit price</th>
            <th className='text-end'>Quantity</th>
            <th className='text-end'>Total Price</th>
            <th className='text-center'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.product.item_name}</td>
                <td className='text-end'>{item.unit_price}</td>
                <td className='text-end'>
                  <input type="text" value={item.purchase_quantity} className="text-end border rounded pe-2"
                    style={{ width: "60px" }} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                </td>
                <td className='text-end'>{item.total_price.toFixed(2)}</td>
                <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteProduct(index)}></i></td>
              </tr>
            ))
          ) : (
            <tr className='text-center'>
              <td colSpan='6'>No Products Added</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

// Product Search------------------------------------------------------------------------------------

function ProductSelection({ dropdown, setDropdown, searchProduct, setSearchProduct, setSelectedProducts, selectedProducts }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = UseClickOutside(() => setDropdown(null));


  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-stock-list/')
      .then((response) => {
        setProducts(response.data);
        // setLoading(false);
      })
      .catch((error) => {
        console.error('Error Fetching Items');
        // setLoading(false);
      });
  }, [])

  const handleProductChange = (e) => {
    const search = e.target.value;
    setSearchProduct(search);
    setDropdown(search.length > 0 ? 'products' : null);
    filterProducts(search);
  };

  const filterProducts = debounce((search) => {
    if (!products.length) {
      setLoading(false);
      return;
    }

    const filtered = products.filter((prod) =>
      (`${prod.item_name} ${prod.category} ${prod.brand}`.toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredProducts(filtered);
    setLoading(false);
  }, 300)

  const handleProduct = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const existingProductIndex = prevSelectedProducts.findIndex((prod) => prod.product.item_id === product.item_id);
      if (existingProductIndex !== -1) {
        const updatedProducts = [...prevSelectedProducts];

        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          purchase_quantity: updatedProducts[existingProductIndex].purchase_quantity + 1,
          total_price: (updatedProducts[existingProductIndex].purchase_quantity + 1) * updatedProducts[existingProductIndex].unit_price,
        }
        return updatedProducts;
      } else {
        return [
          ...prevSelectedProducts,
          { product, purchase_quantity: 1, unit_price: Number(product.purchase_price), total_price: Number(product.purchase_price) }
        ];
      }
    });

    setSearchProduct('');
    setDropdown(null);
  };


  return (
    <>
      <div>
        <label htmlFor='search_product' className='form-label'>Product</label>
        <input id='search_product' className='form-control border rounded-pill px-2' placeholder='Search Product'
          onChange={handleProductChange} value={searchProduct} style={{ width: '250px' }} />


        {dropdown === 'products' && searchProduct.length > 0 &&
          <div ref={dropdownRef} className='dropdown-menu show mt-2' style={{  maxHeight: '35%', overflowY: 'auto' }} >
            <table className='table table-hover' style={{ width: '250px' }}>
              <thead>
                <tr>
                  <th>ProductName</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>PP</th>
                  <th>SP</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.length > 0 ? (
                    loading ? (
                      <tr><td colSpan='4'><Loader size='sm' message='Fetching products' /></td></tr>
                    ) : (
                      filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                          <tr key={index} className='custom-hover' onClick={() => handleProduct(product)}>
                            <td>{product.item_name}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>{product.purchase_price}</td>
                            <td>{product.sale_price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No Matches Found</td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr><td colSpan="4" className="text-center">Products not found</td></tr>
                  )
                }
              </tbody>
            </table>
          </div>}
      </div>


    </>
  )
}

// Seller Selection
function SellerSelection({ dropdown, setDropdown, searchSeller, setSearchSeller, setSelectedSeller }) {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true)
  const dropdownRef = UseClickOutside(() => setDropdown(null));


  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-seller-list/')
      .then((response) => {
        setSellers(response.data);
      })
      .catch((error) => {
        console.error('Error Fetching Sellers');
      });
  }, [])

  const handleSeller = (seller) => {
    setSearchSeller(seller.seller_name)
    setSelectedSeller(seller);
    setDropdown(null)
  }

  const filterSellers = debounce((search) => {
    if (!sellers.length) {
      setLoading(false)
      return;
    }

    const filtered = sellers.filter((sell) =>
      (`${sell.seller_name} ${sell.seller_mph} ${sell.address}`.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredSellers(filtered);
    setLoading(false);
  }, 300);

  const handleSellerChange = (e) => {
    const search = e.target.value;
    setSearchSeller(search);
    setDropdown(search.length > 0 ? 'seller' : null);
    filterSellers(search);
  };

  return (
    <>
      <label htmlFor='search_seller' className='form-label'>Seller</label>
      <input id='search_seller' className='form-control border rounded-pill px-2' placeholder='Search seller'
        onChange={handleSellerChange} value={searchSeller} style={{ width: '250px' }} autoFocus/>

      {dropdown === 'seller' && searchSeller.length > 0 &&
        <div ref={dropdownRef} className='dropdown-menu show' style={{marginTop:'70px', width: '250px', maxHeight:'35%', overflowY:'auto' }} >
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Seller Name</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {
                sellers.length > 0 ? (
                  loading ? (
                    <tr><td colSpan='2' ><Loader size='sm' message='Fetching sellers' /></td></tr>
                  ) : (
                    filteredSellers.length > 0 ? (
                      filteredSellers.map((seller, index) => (
                        <tr key={index} className='custom-hover' onClick={() => handleSeller(seller)}>
                          <td>{seller.seller_name}</td>
                          <td>{seller.seller_mph}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">Matches not found</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr><td colSpan="2" className="text-center">Sellers not found</td></tr>
                  // ( No Customers)
                )
              }
            </tbody>
          </table>
        </div>
      }
    </>)
}
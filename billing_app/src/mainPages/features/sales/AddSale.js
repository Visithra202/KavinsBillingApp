import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Loader from '../../components/Loader';
import UseClickOutside from '../../hooks/UseClickOutside';


export default function AddSale() {
  const date = new Date();
  const [billNo, setBillNo] = useState('');

  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState({});

  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const [cash, setCash] = useState(0);
  const [account, setAccount] = useState(0);
  const [credit, setCredit] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totAmt, setTotAmt] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/get-sale-bill-no/')
      .then((response) => {
        setBillNo(response.data.bill_no);
      })
      .catch((error) => {
        // console.error('Error Fetching Bill No');
      });
  }, []);


  useEffect(() => {
    const newTotal = selectedProducts.reduce((sum, product) => {
      const totalPrice = isNaN(product.total_price) ? 0 : product.total_price;
      return sum + totalPrice;
    }, 0);
    setTotalAmount(newTotal);
    setTotAmt(newTotal);
  }, [selectedProducts]);



  const handleSubmit = () => {

    if (!selectedCustomer?.customer_id) {
      alert('Select a customer')
      return;
    }
    if (selectedProducts.length === 0) {
      alert('Select atleast one product for sale')
      return;
    }
    
    if((cash+account+credit)!==totalAmount){
      alert('Enter valid amount')
      return;
    }
    

    const saleData = {
      bill_no: billNo,
      customer: selectedCustomer,
      sale_products: selectedProducts.map((item) => ({
        product: item.product,
        quantity: item.sale_quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
      payment: {
        cash,
        account,
        credit
      },
      total_amount: totalAmount,
      balance: totalAmount - (cash + account + credit),
      paid_amount : cash+account+credit,
      discount : discount
    };
    // console.log(saleData)

    axios.post('http://localhost:8000/add-sale/', saleData)
      .then(response => {
        // console.log('Sale Submitted:', response.data);
        alert('Sale added successfully')
        handleReset();

        axios.get('http://localhost:8000/get-sale-bill-no/').then((response) => {
          setBillNo(response.data.bill_no);
        })
          .catch((error) => {
            // console.error('Error Fetching Bill No');
          });
      })
      .catch(error => {
        // console.error('Error submitting sale:', error)
      });
  };

  const handleReset = () => {
    setSearchCustomer('');
    setSelectedProducts([]);
    setCash(0);
    setAccount(0);
    setCredit(0);
    setTotalAmount(0);
    setTotAmt(0);
    setDiscount(0);
  };


  return (
    <div className='container'>
      <div className='row bg-light mt-1 mb-0 mx-0 p-2 border rounded shadow d-flex'>
        {/* Customer search*/}
        <div className='col d-flex flex-column'>
          <CustomerSelection activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} searchCustomer={searchCustomer} setSearchCustomer={setSearchCustomer} setSelectedCustomer={setSelectedCustomer} />
        </div>

        {/* Product search*/}
        <div className='col d-flex flex-column'>
          <ProductSelection activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} searchProduct={searchProduct} setSearchProduct={setSearchProduct} setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts} />
        </div>

        {/* Date */}
        <div className='col d-flex flex-column'>
          <label htmlFor='sale_date' className='form-label'>Date</label>
          <input id='sale_date' className='form-control border rounded-pill px-2' disabled value={date.toLocaleDateString()} style={{ width: '200px' }} />
        </div>

        {/* Bill No */}
        <div className='col d-flex flex-column'>
          <label htmlFor='bill_no' className='form-label'>Bill No</label>
          <input id='bill_no' className='form-control border rounded-pill px-2' disabled value={billNo} style={{ width: '200px' }} />
        </div>
      </div>

      <div className='bg-white border rounded shadow p-3 mt-1'>
        <SaleProducts selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
      </div>

      <div className='position-fixed bottom-0 d-flex flex-column justify-content-center align-items-center bg-light pt-2 pb-1 border rounded shadow'
        style={{ width: 'calc(100% - 250px)', left: '250px' }}>

        <div className='d-flex justify-content-between w-100 mx-5 px-4 '>
          <div className='d-flex rounded'>
            <PaymentMode cash={cash} setCash={setCash} credit={credit} setCredit={setCredit} account={account} setAccount={setAccount} 
            discount={discount} setDiscount={setDiscount} totalAmount={totalAmount} setTotalAmount={setTotalAmount} totAmt={totAmt}/>
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
  );
}

// Payment Mode ---------------------------------------------------------------------------

function PaymentMode({ cash, setCash, credit, setCredit, account, setAccount, discount, setDiscount, totalAmount, setTotalAmount, totAmt }) {

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

  const handleDiscountChange = (e) => {
    if (isNaN(e.target.value)) return;
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setDiscount(value);
    setTotalAmount(totAmt-value);
  };

  return (
    <>
      <div>
        <label htmlFor='cash' className='form-label'>Cash</label>
        <input id='cash' type="text" value={cash === 0 ? "" : cash} placeholder='0' className="payment border rounded ps-1 ms-2"
          style={{ width: '70px' }} onChange={handleCashChange}
        />
      </div>

      <div>
        <label htmlFor='account' className='form-label ms-2'>Account</label>
        <input id='account' type="text" value={account === 0 ? "" : account} placeholder='0' className="payment border rounded ms-2 ps-1"
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

      <div>
        <label htmlFor='discount' className='form-label ms-2'>Discount</label>
        <input id='discount'
          type="text" value={discount === 0 ? "" : discount} placeholder='0' className="payment border rounded ms-2 ps-1"
          style={{ width: '70px' }} onChange={handleDiscountChange}
        />
      </div>
    </>
  )
}

// Sale Products-------------------------------------------------------------------------------

function SaleProducts({ selectedProducts, setSelectedProducts }) {

  const handleQuantityChange = (index, newQuantity) => {
    if (isNaN(newQuantity)) return;

    const quantity = newQuantity === "" ? 0 : Number(newQuantity);
    if (quantity > selectedProducts[index].product.quantity) {
      alert(`Quantity must be less than or equal to ${selectedProducts[index].product.quantity}`);
      return;
    }

    const updatedProducts = [...selectedProducts];
    updatedProducts[index].sale_quantity = quantity;
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
                <td>{item.product.brand + " "+item.product.category+" "+item.product.item_name}</td>
                <td className='text-end'>{item.unit_price}</td>
                <td className='text-end'>
                  <input type="text" value={item.sale_quantity} className="text-end border rounded pe-2"
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

function ProductSelection({ activeDropdown, setActiveDropdown, searchProduct, setSearchProduct, setSelectedProducts, selectedProducts }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = UseClickOutside(() => setActiveDropdown(null));


  useEffect(() => {
    axios.get('http://localhost:8000/get-stock-list/')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        // console.error('Error Fetching Items');
      });
  }, [])

  const handleProductChange = (e) => {
    const search = e.target.value;
    setSearchProduct(search);
    setActiveDropdown(search.length > 0 ? 'product' : null);
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

        // Check stock availability before updating quantity
        if (updatedProducts[existingProductIndex].sale_quantity + 1 <= product.quantity) {
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            sale_quantity: updatedProducts[existingProductIndex].sale_quantity + 1,
            total_price: (updatedProducts[existingProductIndex].sale_quantity + 1) * updatedProducts[existingProductIndex].unit_price,
          };


        } else {
          alert(`Only ${product.quantity} items available in stock`);
        }

        return updatedProducts;
      } else {
        if (product.quantity >= 1) {
          return [
            ...prevSelectedProducts,
            { product, sale_quantity: 1, unit_price: Number(product.sale_price), total_price: Number(product.sale_price) }
          ];
        } else {
          alert(`No stock available for ${product.item_name}`);
          return prevSelectedProducts;
        }
      }
    });

    setSearchProduct('');
    setActiveDropdown(null);
  };


  return (
    <>
      <label htmlFor='search_product' className='form-label'>Product</label>
      <input id='search_product' className='form-control border rounded-pill px-2' placeholder='Search Product'
        onChange={handleProductChange} value={searchProduct} style={{ width: '250px' }} />

      {activeDropdown === 'product' && searchProduct.length > 0 &&
        <div ref={dropdownRef} className='dropdown-menu show' style={{ marginTop: '70px',  maxHeight: '35%', overflowY: 'auto'}} >
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>ProductName</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
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
        </div>
      }
    </>
  )
}


// Customer Search-------------------------------------------------------------------------------

function CustomerSelection({ activeDropdown, setActiveDropdown, searchCustomer, setSearchCustomer, setSelectedCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true)

  const dropdownRef = UseClickOutside(() => setActiveDropdown(null));

  useEffect(() => {
    axios.get('http://localhost:8000/get-customer-list/')
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        // console.error('Error Fetching Customers');
      });
  }, [])

  const handleCustomer = (customer) => {
    setSearchCustomer(customer.customer_name)
    setSelectedCustomer(customer);
    setActiveDropdown(null)
  }

  const filterCustomers = debounce((search) => {
    if (!customers.length) {
      setLoading(false)
      return;
    }

    const filtered = customers.filter((cust) =>
      (`${cust.customer_name} ${cust.mph} ${cust.address}`.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredCustomers(filtered);
    setLoading(false);
  }, 300);

  const handleCustomerChange = (e) => {
    const search = e.target.value;
    setSearchCustomer(search);
    setActiveDropdown(search.length > 0 ? 'customer' : null);
    filterCustomers(search);
  };

  return (
    <>
      <label htmlFor='customer' className='form-label'>Customer</label>
      <input id='customer' className='form-control border rounded-pill px-2' placeholder='Search Customer'
        onChange={handleCustomerChange} value={searchCustomer} style={{ width: '250px' }} autoFocus/>

      {activeDropdown === 'customer' && searchCustomer.length > 0 &&
        <div ref={dropdownRef} className='dropdown-menu show' style={{ marginTop: '70px', height: '100px' }} >
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {
                customers.length > 0 ? (
                  loading ? (
                    <tr><td colSpan='2' ><Loader size='sm' message='Fetching customers' /></td></tr>
                  ) : (
                    filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer, index) => (
                        <tr key={index} className='custom-hover' onClick={() => handleCustomer(customer)}>
                          <td>{customer.customer_name}</td>
                          <td>{customer.mph}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">Matches not found</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr><td colSpan="2" className="text-center">Customers not found</td></tr>
                  // ( No Customers)
                )
              }
            </tbody>
          </table>
        </div>
      }
    </>)
}
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AddItem() {

  const [itemFormData, setItemFormData] = useState({
    item_name: '',
    category: '',
    brand: '',
    purchase_price: '',
    sale_price: '',
    tax_option: '',
    mrp: '',
    discount_type: '',
    discount: '',
    quantity: '',
    min_stock: ''
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.23:8000/get-category-list/')
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.error('Error Fetching Categories')
      })

    axios.get('http://192.168.1.23:8000/get-brand-list/')
      .then((response) => {
        setBrands(response.data)
      })
      .catch((error) => {
        console.error('Error Fetching Brands')
      })

  }, [])

  const handleChange = (e) => {

    const { name, value } = e.target
    setItemFormData({ ...itemFormData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    // const trimmedData = {};
    // let hasEmptyField = false;

    // for (const key in itemFormData) {
    //   const trimmedValue = itemFormData[key].trim?.() || itemFormData[key]; // Use trim only on strings
    //   if (trimmedValue === '') {
    //     hasEmptyField = true;
    //   }
    //   trimmedData[key] = trimmedValue;
    // }

    // if (hasEmptyField) {
    //   alert("All fields must be filled properly and cannot contain only spaces.");
    //   return;
    // }

    try {
      await axios.post('http://192.168.1.23:8000/add-item/', itemFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      alert('Item added successfully')
      handleReset();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.non_field_errors);
      } else {
        alert("Something went wrong!");
      }
    }
  }

  const handleReset = () => {
    setItemFormData({
      item_name: '',
      category: '',
      brand: '',
      purchase_price: '',
      sale_price: '',
      // tax_option: '',
      mrp: '',
      // discount_type: '',
      // discount: '',
      quantity: '',
      min_stock: ''
    })
  }

  return (
    <div className='container'>
      <form className='bg-white my-2 mx-4  rounded-5 shadow' autoComplete='off' onSubmit={handleSubmit}>

        <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Item</h5>

        <div className='p-3'>
          {/* Add Item */}
          <div className='border rounded px-4 py-3 mt-3 position-relative'>
            <h5 className="item-title">Item details</h5>

            <div className='row '>
              <div className="col">
                <label htmlFor='item_name' className="form-label ">Item name</label>
                <input id='item_name' type="text" name="item_name" className="form-control"
                  value={itemFormData.item_name} onChange={handleChange} required autoFocus />
              </div>
              <div className='col'>
                <label htmlFor='category' className="form-label">Category</label>
                <select id='category' name="category" className="form-select" value={itemFormData.category} onChange={handleChange} required>
                  <option value="" disabled>Select Category</option>
                  {categories.length > 0 && (
                    <>
                      {categories.map((category, index) => (
                        <option key={index} value={category.category_name}>
                          {category.category_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className='col'>
                <label htmlFor="brand" className="form-label">Brand</label>
                <select id='brand' name="brand" className="form-select" value={itemFormData.brand} onChange={handleChange} required>
                  <option value="" disabled>Select Brand</option>
                  {brands.length > 0 && (
                    <>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand.brand_name}>
                          {brand.brand_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>

              </div>
            </div>
          </div>


          {/* Pricing Section */}
          <div className='border rounded px-4 py-3 mt-4 position-relative'>
            <h5 className="item-title">Pricing</h5>

            <div className='row '>
              <div className="col">
                <label htmlFor='purchase_price' className="form-label">Purchase Price</label>
                <input id='purchase_price' type="number" name="purchase_price" className="form-control"
                  value={itemFormData.purchase_price} onChange={handleChange} required />
              </div>
              <div className="col">
                <label htmlFor='sale_price' className="form-label">Sale Price</label>
                <input id='sale_price' type="number" name="sale_price" className="form-control"
                  value={itemFormData.sale_price} onChange={handleChange} required />
              </div>
              <div className="col">
                <label htmlFor='tax_option' className="form-label">Tax Option</label>
                <select id='tax_option' name="tax_option" className="form-select"
                  value={itemFormData.tax_option} onChange={handleChange}>
                  <option value=''>Select Tax </option>
                  <option value="With Tax">With Tax</option>
                  <option value="Without Tax">Without Tax</option>
                </select>
              </div>
            </div>



            <div className="row">
              <div className='col'>
                <label htmlFor='mrp' className="form-label">MRP</label>
                <input id='mrp' type="number" name="mrp" className="form-control"
                  value={itemFormData.mrp} onChange={handleChange} required />
              </div>
              <div className="col">
                <label htmlFor='discount_type' className="form-label">Discount type</label>
                <select id='discount_type' name="discount_type" className="form-select"
                  value={itemFormData.discount_type} onChange={handleChange}>
                  <option value=''>Select Discount Type</option>
                  <option value="Price">Price</option>
                  <option value="Percentage"> Percentage </option>
                  <option value='No Discount'>No Discount</option>
                </select>
              </div>
              <div className="col">
                <label htmlFor='discount' className="form-label">Discount</label>
                <input id='discount' type="number" name="discount" className="form-control"
                  value={itemFormData.discount} onChange={handleChange} />
              </div>
            </div>
          </div>


          {/* Stock Secction */}
          <div className='border rounded px-4 py-3 mt-4 position-relative'>
            <h5 className="item-title">Stock</h5>
            <div className='row'>
              <div className="col-4">
                <label htmlFor='quantity' className="form-label">Quantity</label>
                <input id='quantity' type="number" name="quantity" className="form-control"
                  value={itemFormData.quantity} onChange={handleChange} required />
              </div>
              <div className='col-4'>
                <label htmlFor='min_stock' className="form-label">Minimum Stock Required</label>
                <input id='min_stock' type="number" name="min_stock" className="form-control"
                  value={itemFormData.min_stock} onChange={handleChange} required />
              </div>
            </div>
          </div>



          {/* Buttons Section */}
          <div className='d-flex justify-content-center mt-3'>
            <button type='submit' className="btn btn-success rounded-pill p-1 px-4 mx-2">Save</button>
            <button type="button" className="btn btn-secondary rounded-pill p-1 px-4 mx-2" onClick={handleReset}>Reset</button>
          </div>
        </div>

      </form >
    </div >
  )
}


import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';

export default function EditItem() {

    const navigate = useNavigate();
    const location = useLocation();

    const [itemFormData, setItemFormData] = useState(location.state?.item || '');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const beforeEdit = JSON.stringify(location.state?.item || '')

    useEffect(() => {
        if (!location.state) {
            navigate('/stockList');
        }
    }, [location.state, navigate]);


    useEffect(() => {
        axios.get('http://localhost:8000/get-category-list/')
            .then((response) => {
                setCategories(response.data)
            })
            .catch((error) => {
                // console.error('Error Fetching Categories')
            })

        axios.get('http://localhost:8000/get-brand-list/')
            .then((response) => {
                setBrands(response.data)
            })
            .catch((error) => {
                // console.error('Error Fetching Brands')
            })

    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setItemFormData({ ...itemFormData, [name]: value })
    }


    const handleUpdate = async () => {
        const afterEdit = JSON.stringify(itemFormData)

        if (beforeEdit === afterEdit) {
            alert('None of the fields changed')
            return;
        }

        try {
            await axios.put(`http://localhost:8000/edit-item/${itemFormData.item_id}/`, itemFormData, {
                headers: { "Content-Type": "application/json" }
            });
            navigate('/stockList');
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.non_field_errors);
            } else {
                alert("Something went wrong!");
            }
        }
    }


    return (
        <div className='container'>
            <form className='bg-white my-2 mx-4  rounded-5 shadow' autoComplete='off'>

                <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Edit Item</h5>

                <div className='p-3'>
                    {/* Edit Item */}
                    <div className='border rounded px-4 py-3 mt-3 position-relative'>
                        <h5 className="item-title">Item details</h5>

                        <div className='row '>
                            <div className="col">
                                <label className="form-label ">Item name</label>
                                <input type="text" name="item_name" className="form-control"
                                    value={itemFormData.item_name} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className='col'>
                                <label htmlFor="category" className="form-label">Category</label>
                                <select name="category" className="form-select" value={itemFormData.category} onChange={handleChange} required>
                                    {categories.length > 0 && (
                                        <>
                                            <option value="">Select Category</option>
                                            {categories.map((category, index) => (
                                                <div className='option-items'>
                                                    <option className='option' key={index} value={category.category_name}>
                                                        {category.category_name}
                                                    </option>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </select>

                            </div>
                            <div className='col'>
                                <label htmlFor="brand" className="form-label">Brand</label>
                                <select name="brand" className="form-select" value={itemFormData.brand} onChange={handleChange} required>
                                    {brands.length > 0 && (
                                        <>
                                            <option value="">Select Brand</option>
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
                                <label className="form-label">Purchase Price</label>
                                <input type="number" name="purchase_price" className="form-control"
                                    value={itemFormData.purchase_price} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className="col">
                                <label className="form-label">Sale Price</label>
                                <input type="number" name="sale_price" className="form-control"
                                    value={itemFormData.sale_price} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className="col">
                                <label className="form-label">Tax Option</label>
                                <select name="tax_option" className="form-select"
                                    value={itemFormData.tax_option} onChange={handleChange}>
                                    <option value=''>Select Tax </option>
                                    <option value="With Tax">With Tax</option>
                                    <option value="Without Tax">Without Tax</option>
                                </select>
                            </div>
                        </div>



                        <div className="row">
                            <div className='col'>
                                <label className="form-label">MRP</label>
                                <input type="number" name="mrp" className="form-control"
                                    value={itemFormData.mrp} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className="col">
                                <label className="form-label">Discount type</label>
                                <select name="discount_type" className="form-select"
                                    value={itemFormData.discount_type} onChange={handleChange}>
                                    <option value=''>Select Discount Type</option>
                                    <option value="Price">Price</option>
                                    <option value="Percentage"> Percentage </option>
                                    <option value='No Discount'>No Discount</option>
                                </select>
                            </div>
                            <div className="col">
                                <label className="form-label">Discount</label>
                                <input type="number" name="discount" className="form-control"
                                    value={itemFormData.discount} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                    </div>


                    {/* Stock Secction */}
                    <div className='border rounded px-4 py-3 mt-4 position-relative'>
                        <h5 className="item-title">Stock</h5>
                        <div className='row'>
                            <div className="col-4">
                                <label className="form-label">Quantity</label>
                                <input type="number" name="quantity" className="form-control"
                                    value={itemFormData.quantity} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className='col-4'>
                                <label className="form-label">Minimum Stock Required</label>
                                <input type="number" id="min_stock" name="min_stock" className="form-control"
                                    value={itemFormData.min_stock} onChange={handleChange} required autoComplete="off" />
                            </div>
                        </div>
                    </div>



                    {/* Buttons Section */}
                    <div className='d-flex justify-content-center mt-3'>
                        <button type="button" className="btn btn-success rounded-pill p-1 px-4 mx-2" onClick={handleUpdate}>Update</button>
                        <button type='button' className="btn btn-secondary rounded-pill p-1 px-4 mx-2"
                            onClick={() => navigate('/stockList')} >Cancel</button>
                    </div>
                </div>

            </form >
        </div >
    )
}


import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Brands() {
  const [reload, setReload] = useState(false);

  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <BrandList reload={reload} setReload={setReload} />
        </div>

        <div className='col h-75 '>
          <BrandForm setReload={setReload} />
        </div>
      </div>
    </div>
  )
}

function BrandForm({ setReload }) {
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('http://localhost:8000/add-brand/', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      setReload((prev) => !prev)
      handleReset();
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.brand_name) {
          setError(data.brand_name[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('An unknown error occurred');
        }
      } else {
        setError('Server not responding');
      }
    }
  }

  const handleReset = () => {
    setFormData({
      brand_name: '',
      description: ''
    })
  }

  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Brand</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>
        <div className='d-flex flex-column'>
          <label htmlFor='brand_name' className='form-label'>Brand name</label>
          <input id='brand_name' type='text' className='form-control p-2' name='brand_name' value={formData.brand_name}
            onChange={handleChange} autoComplete="off" required/>
            {error && <p style={{ color: 'red', fontSize:'12px' }}>{error}</p>}
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='description' className='form-label'>Description</label>
          <input id='description' type='text' className='form-control p-2' name='description' value={formData.description}
            onChange={handleChange} autoComplete='off' required/>
        </div>
        <div className='d-flex justify-content-center mt-4 '>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
        </div>

      </form>
    </div>
  )
}

function BrandList({ reload, setReload }) {

  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-brand-list/')
      .then((response) => {
        setBrands(response.data)
        setLoading(false)
      })
      .catch((error) => {
        // console.error('Error Fetching Brands')
        setLoading(false)
      })
  }, [reload])

  const Loader = () => (
    <div className='text-center my-4'>
      <div className="spinner-border text-primary " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className='mt-2'>Fetching Brands...</p>
    </div>
  );

  const handleDelete = (brand) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this brand?");
    if (confirmDelete) {
      axios.delete(`http://localhost:8000/delete-brand/${brand.brand_id}/`)
        .then((response) =>
          setReload((prev) => !prev)
        ).catch((error) => {
          alert('Error Deleting Brand')
        });
    }
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 150px)' }}>
      <div className='d-flex justify-content-center pb-2' ><h5>Brand list</h5></div>
      <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
        <table className="table table-light">
          {/* <thead className="table-head"> */}
          <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
            <tr>
              <th>Brand Name</th>
              <th>Description</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr className="text-center">
                <td colSpan="3">
                  <Loader />
                </td>
              </tr>
            ) : brands.length > 0 ? (
              brands.map((brand, index) => (
                <tr key={index}>
                  <td>{brand.brand_name}</td>
                  <td>{brand.description}</td>
                  <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(brand)}></i></td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3">No Brand Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
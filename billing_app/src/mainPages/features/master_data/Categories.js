import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader';

export default function Categories() {
  const [reload, setReload] = useState(false);
  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <CategoryList reload={reload} setReload={setReload} />
        </div>

        <div className='col h-75'>
          <CategoryForm setReload={setReload} />
        </div>
      </div>
    </div>
  )
}

function CategoryForm({ setReload }) {
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/add-category/', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      setReload((prev) => !prev)
      handleReset();
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.category_name) {
          setError(data.category_name[0]);
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
      category_name: '',
      description: ''
    })
  }

  return (
    <div className='bg-white m-4 mt-4  border rounded-5 shadow'>
      {/* <div className='text-center text-light p-1  rounded-top-5 ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}><h5>Add Category</h5></div> */}

      <h5 className='text-center rounded-top-5 p-2  text-light ' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add Category</h5>


      <form onSubmit={handleSubmit} className='p-3 px-5'>
        <div className='d-flex flex-column'>
          <label htmlFor='category_name' className='form-label'>Category name</label>
          <input id='category_name' type='text' className='form-control p-2' name='category_name' value={formData.category_name}
            onChange={handleChange} autoComplete="off" required></input>
          {error && <p style={{ color: 'red', fontSize:'12px' }}>{error}</p>}
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='description' className='form-label'>Description</label>
          <input id='description' type='text' className='form-control p-2' name='description' value={formData.description}
            onChange={handleChange} autoComplete='off' required></input>
        </div>
        <div className='d-flex justify-content-center mt-4 '>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
        </div>

      </form>
    </div>
  )
}

function CategoryList({ reload, setReload }) {

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-category-list/')
      .then((response) => {
        setCategories(response.data)
        setLoading(false)
      })
      .catch((error) => {
        // console.error('Error Fetching Categories')
        setLoading(false)
      })
  }, [reload])

  const handleDelete = (category) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      axios.delete(`http://localhost:8000/delete-category/${category.category_id}/`)
        .then((response) =>
          setReload((prev) => !prev)
        ).catch((error) => {
          alert('Error Deleting Category')
        });
    }
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 150px)' }}>
      <div className='d-flex justify-content-center pb-2' ><h5>Category list</h5></div>
      <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
        <table className="table table-light">
          {/* <thead className="table-head"> */}
          <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr className="text-center">
                <td colSpan="3">
                  <Loader message='Fetching categories' />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={index}>
                  <td>{category.category_name}</td>
                  <td>{category.description}</td>
                  <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(category)}></i></td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3">No Category Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
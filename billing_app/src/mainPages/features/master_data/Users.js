import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Users() {
  const [reload, setReload] = useState(false);
  return (
    <div className='container'>
      <div className='row overflow-hidden'>
        <div className='col bg-light m-4 mt-4 me-0 p-3 px-5 border rounded-5 shadow ' >
          <UserList reload={reload} setReload={setReload} />
        </div>

        <div className='col h-75 '>
          <UserForm setReload={setReload} />
        </div>
      </div>
    </div>
  )
}

function UserForm({ setReload }) {
  const [userFormData, setUserFormData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserFormData({ ...userFormData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (userFormData.password !== userFormData.confirm_password) {
      alert('Password does not match')
      return;
    }

    try {
      await axios.post('http://localhost:8000/add-user/', userFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      setReload((prev) => !prev)
      handleReset();
    } catch (error) {
      alert('Error Adding User');
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setUserFormData({
      username: '',
      password: '',
      confirm_password: ''
    })
  }

  return (
    <div className='bg-white m-4 mt-4 border rounded-5 shadow'>
      <h5 className='text-center text-light p-2 rounded-top-5' style={{ backgroundColor: 'rgba(61, 60, 60, 0.73)' }}>Add user</h5>

      <form onSubmit={handleSubmit} className='py-3 px-4'>
        <div className='d-flex flex-column'>
          <label htmlFor='username' className='form-label'>Username</label>
          <input id='username' type='text' className='form-control p-2' name='username' value={userFormData.username}
            onChange={handleChange} autoComplete="off" required />
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='password' className='form-label'>Password</label>
          <input id='password' type='password' className='form-control p-2' name='password' value={userFormData.password}
            onChange={handleChange} autoComplete='off' required />
        </div>
        <div className='d-flex flex-column mt-3'>
          <label htmlFor='confirm_password' className='form-label'>Confirm password</label>
          <input id='confirm_password' type='password' className='form-control p-2' name='confirm_password' value={userFormData.confirm_password}
            onChange={handleChange} autoComplete='off' required />
        </div>
        <div className='d-flex justify-content-center mt-4 '>
          <button type='submit' className='btn btn-success rounded-pill p-1 px-4 '>Submit</button>
        </div>

      </form>
    </div>
  )
}

function UserList({ reload, setReload }) {

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/get-user-list/')
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        // console.error('Error Fetching Users')
        setLoading(false)
      })
  }, [reload])

  const Loader = () => (
    <div className='text-center my-4'>
      <div className="spinner-border text-primary " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className='mt-2'>Fetching Users...</p>
    </div>
  );

  const handleDelete = (user) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      axios.delete(`http://localhost:8000/delete-user/${user.user_id}/`)
        .then((response) =>
          setReload((prev) => !prev)
        ).catch((error) => {
          alert('Error Deleting User')
        });
    }
  }

  return (
    <div className='container' style={{ height: 'calc(100vh - 150px)' }}>
      <div className='d-flex justify-content-center pb-2' ><h5>User list</h5></div>
      <div className='scroll-bar' style={{ minHeight: '50%', maxHeight: '90%', overflowY: 'auto' }}>
        <table className="table table-light">
          {/* <thead className="table-head"> */}
          <thead className="table-head" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
            <tr>
              <th>Username</th>
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
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td className='text-center'><i className="bi bi-trash-fill text-danger" style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(user)}></i></td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3">No User Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
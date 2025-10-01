import { useRegisterUserMutation } from '../../redux/api/authApi';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData.jsx"
function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })


  const [register, { isLoading, error, data }] = useRegisterUserMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);



  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
    if (data) {
      console.log("✅ Login successful. Token received:");
      console.log(data.token); // Or data?.token, depending on your backend
    }
    if (error) {
      toast.error(error?.data?.message)
    }
  }, [data, error, isAuthenticated, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    const signUpData = {
      name: user.name,
      email: user.email,
      password: user.password,
    }
    register(signUpData)
  }

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  return (
    <>
      <MetaData title={"Register"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Register</h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={user.name}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={user.email}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={user.password}
                onChange={onChange}
              />
            </div>

            <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? "Creating..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
export default Register;
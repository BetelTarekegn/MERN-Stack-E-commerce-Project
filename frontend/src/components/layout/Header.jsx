import React, { useEffect, useState } from 'react';
import Search from "./Search";
import { useGetUserProfileQuery } from '../../redux/api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyLogoutQuery } from '../../redux/api/authApi';
import { clearUser } from '../../redux/features/userSlice.js';
import { toast } from 'react-hot-toast';

function Header() {
    const navigate = useNavigate();
    const { isLoading } = useGetUserProfileQuery();
    const [logout] = useLazyLogoutQuery();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    // 🌓 Dark mode state
    const [darkMode, setDarkMode] = useState(false);

    // 🌓 Apply/remove dark class to body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const logoutHandler = async () => {
        try {
            await logout().unwrap();
            dispatch(clearUser());
            toast.success("Logged out!");
            navigate("/login");
        } catch (err) {
            toast.error("Logout failed!");
        }
    };

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3 ps-5 d-flex align-items-center">
                <div className="navbar-brand me-3">
                    <a href="/">
                        <img src="/images/utopia.jpg" alt="UTOPIA Logo" style={{ width: '50px' }} />
                    </a>
                </div>

                {/* 🌗 Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="btn btn-sm theme-toggle-btn"
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
                <Search />
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center justify-content-end">
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <span id="cart" className="ms-3">Cart</span>
                    <span className="ms-1" id="cart_count">{cartItems?.length || 0}</span>
                </Link>

                {user ? (
                    <div className="ms-4 dropdown">
                        <button
                            className="btn dropdown-toggle text-white"
                            type="button"
                            id="dropDownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <figure className="avatar avatar-nav">
                                <img
                                    src={user?.avatar ? user?.avatar?.url : "/images/default_avator.jpg"}
                                    alt="User Avatar"
                                    className="rounded-circle"
                                />
                            </figure>
                            <span>{user.name}</span>
                        </button>

                        <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
                            {user?.role==="admin" && 
                            (<Link className="dropdown-item" to="/admin/dashboard">{""}Dashboard{""}</Link>)
                            
                            }
                            
                            <Link className="dropdown-item" to="/me/orders">Orders</Link>
                            <Link className="dropdown-item" to="/me/profile">Profile</Link>
                            <button className="dropdown-item text-danger" onClick={logoutHandler}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    !isLoading && (
                        <Link to="/login" className="btn ms-4" id="login_btn">
                            Login
                        </Link>
                    )
                )}
            </div>
        </nav>
    );
}

export default Header;

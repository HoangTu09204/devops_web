import { useContext, useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaShoppingCart, FaBars, FaSearch } from 'react-icons/fa';
import CategoryDropdown from '../pages/CategoryDropdown';
import { AuthContext } from '../context/AuthContext';
import '../css/Navbar.css';

function Navbar() {
  const [showCategory, setShowCategory] = useState(false);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const userDropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cập nhật cartCount mỗi khi localStorage thay đổi
  const updateCartCount = () => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount(); // Cập nhật ngay khi mount

    // Lắng nghe event storage
    const handleStorage = () => updateCartCount();
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  // Dropdown Danh Mục
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setShowCategory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dropdown User
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeywordClick = (keyword) => {
    navigate(`/search?query=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        TR PC
      </div>

      {/* Dropdown Danh Mục */}
      <div className="category-wrapper" ref={menuRef}>
        <button className="category-btn" ref={buttonRef} onClick={() => setShowCategory(!showCategory)}>
          <FaBars className="icon" />
          Danh mục sản phẩm
        </button>
        {showCategory && (
          <div className="category-dropdown">
            <CategoryDropdown />
          </div>
        )}
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch
            className="search-icon"
            onClick={handleSearch}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="text"
            placeholder="Nhập từ khoá cần tìm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </div>
        <div className="quick-keywords">
          {['RTX 5060', 'RTX 5060 Ti', 'PC GAMING', 'Màn Hình', 'Build PC'].map(keyword => (
            <span key={keyword} onClick={() => handleKeywordClick(keyword)}>
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <div className="nav-item" onClick={() => setShowUserDropdown(!showUserDropdown)} ref={userDropdownRef}>
          <FaUserCircle />
          {user ? (
            <>
              <span
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/user');
                }}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Xin chào, {user.name}
              </span>

              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  {user.role === 'admin' && (
                    <div className="admin-link" onClick={() => { setShowUserDropdown(false); navigate('/admin/dashboard'); }}>
                      Admin
                    </div>
                  )}
                  <button onClick={() => { logout(); navigate('/'); }}>Đăng xuất</button>
                </div>
              )}
            </>
          ) : (
            showUserDropdown && (
              <div className="user-dropdown">
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
              </div>
            )
          )}
        </div>

        <div className="nav-item">
          <FaBell />
        </div>

        <div className="nav-item" onClick={() => navigate('/cart')}>
          <FaShoppingCart />
          <span>
            Giỏ hàng của bạn<br />({cartCount}) sản phẩm
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

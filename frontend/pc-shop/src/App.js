import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import UserManagementPage from './pages/UserManagementPage';
import Dashboard from './pages/Dashboard';
import UserPage from './pages/UserPage';
import PaymentReturn from "./pages/PaymentReturn";


function App() {
  // ✅ Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // ✅ Kiểm tra xem user có phải admin không
  const isAdmin = user && user.role === 'admin' && token;

  return (
    <Router>
      <Routes>
        {/* Các route public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
        {/* ✅ Route admin được bảo vệ */}
        <Route
            path="/user"
            element={token ? <UserPage /> : <Navigate to="/login" replace />}
          />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <UserManagementPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={isAdmin ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

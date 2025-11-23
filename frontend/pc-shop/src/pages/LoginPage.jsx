import { useState, useContext } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });

      const { user, token } = res.data; // ✅ Backend trả về user + token

      // ✅ Lưu thông tin vào localStorage để axios interceptor dùng
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));

      // ✅ Cập nhật context
      login(user, token);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        // ✅ Nếu là admin → vào dashboard
        if (user.role === 'admin') {
          navigate('/');
        } else {
          navigate('/');
        }
      }, 1200);
    } catch (err) {
      console.error('❌ Lỗi đăng nhập:', err);
      setError(err.response?.data?.message || 'Sai email hoặc mật khẩu');
    }
  };

  const handleCloseDialog = () => setError('');

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Đăng nhập</button>
          <div className="register-link">
            Bạn chưa có tài khoản?{' '}
            <span onClick={() => navigate('/register')}>Đăng ký</span>
          </div>
        </form>
      </div>

      {error && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <div className="dialog-title">Đăng nhập thất bại</div>
            <div className="dialog-message">{error}</div>
            <button className="dialog-close" onClick={handleCloseDialog}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <div className="dialog-success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#4caf50" />
                <path
                  d="M15 25L22 32L34 18"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className="dialog-title"
              style={{ color: '#4caf50' }}
            >
              Đăng nhập thành công
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default LoginPage;

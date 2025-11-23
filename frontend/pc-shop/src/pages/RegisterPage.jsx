import { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      alert('Đăng ký thành công! Mời bạn đăng nhập.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-box">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Họ tên" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Mật khẩu" onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit">Đăng ký</button>
        </form>
        <div className="register-link">
          Đã có tài khoản?{' '}
          <span onClick={() => navigate('/login')}>Đăng nhập</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;

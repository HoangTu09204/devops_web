import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/AdminPage.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // ✅ Kiểm tra quyền admin
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('❌ Bạn không có quyền truy cập trang này!');
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Lấy danh sách người dùng
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth`)
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Lỗi khi tải danh sách người dùng'));
  };

  // ✅ Xử lý khi chỉnh sửa thông tin user
  const handleChange = (id, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === id ? { ...u, [field]: value } : u))
    );
  };

  // ✅ Cập nhật user
  const handleUpdate = (user) => {
    const updatedUser = {
      name: user.name,
      email: user.email,
    };

    if (user.password && user.password.trim() !== '') {
      updatedUser.password = user.password;
    }

    axios
      .put(`${process.env.REACT_APP_API_URL}/auth/${user._id}`, updatedUser)
      .then(() => {
        toast.success('✅ Cập nhật người dùng thành công');
        fetchUsers();
      })
      .catch(() => toast.error('❌ Cập nhật thất bại'));
  };

  // ✅ Xóa user
  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/auth/${id}`)
      .then(() => {
        toast.success('🗑️ Xóa người dùng thành công');
        fetchUsers();
      })
      .catch(() => toast.error('❌ Xóa thất bại'));
  };

  // ✅ Thêm user mới
  const handleAdd = () => {
    const { name, email, password } = newUser;
    if (!name || !email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register`, newUser)
      .then(() => {
        toast.success('🎉 Thêm người dùng thành công');
        setNewUser({ name: '', email: '', password: '' });
        fetchUsers();
      })
      .catch(() => toast.error('❌ Thêm thất bại'));
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h2 className="admin-title">Quản lý người dùng</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Mật khẩu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <input
                    className="admin-input"
                    value={u.name}
                    onChange={(e) => handleChange(u._id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    value={u.email}
                    onChange={(e) => handleChange(u._id, 'email', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    type="password"
                    placeholder="Để trống nếu không đổi"
                    value={u.password || ''}
                    onChange={(e) => handleChange(u._id, 'password', e.target.value)}
                  />
                </td>
                <td>
                  <button className="admin-btn update" onClick={() => handleUpdate(u)}>
                    Cập nhật
                  </button>
                  <button className="admin-btn delete" onClick={() => handleDelete(u._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="admin-subtitle">Thêm người dùng mới</h3>
        <div className="admin-add-form">
          <input
            className="admin-input"
            placeholder="Tên"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Mật khẩu"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button className="admin-btn add" onClick={handleAdd}>
            Thêm
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
      <Footer />
    </>
  );
}

export default UserManagementPage;

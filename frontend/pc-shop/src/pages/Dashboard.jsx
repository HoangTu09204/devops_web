import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/AdminPage.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const navigate = useNavigate();

  // ⭐ Kiểm tra quyền admin — CHỈ kiểm tra khi userInfo có dữ liệu
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) return; // Đợi AuthContext load

    if (userInfo.role !== "admin") {
      toast.error("❌ Bạn không có quyền truy cập trang này!");
      navigate("/login");
    }
  }, [navigate]);

  // ⭐ Lấy dữ liệu dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("/auth"),
          axios.get("/products"),
          axios.get("/orders"),
        ]);

        const totalUsers = usersRes.data.length;
        const totalProducts = productsRes.data.length;
        const totalOrders = ordersRes.data.length;

        const totalRevenue = ordersRes.data.reduce(
          (sum, o) => sum + (o.total || 0),
          0
        );

        const recentOrders = ordersRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setSummary({
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          recentOrders,
        });
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);

        if (err.response?.status === 401) {
          toast.error("⚠️ Token hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          navigate("/login");
        } else {
          toast.error("Không thể tải dữ liệu Dashboard!");
        }
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div className="admin-container">
        <h2 className="admin-title">📊 Tổng quan hệ thống</h2>

        {/* Thống kê nhanh */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div className="admin-card">
            <h3>👥 Người dùng</h3>
            <p>{summary.totalUsers}</p>
          </div>

          <div className="admin-card">
            <h3>📦 Sản phẩm</h3>
            <p>{summary.totalProducts}</p>
          </div>

          <div className="admin-card">
            <h3>🧾 Đơn hàng</h3>
            <p>{summary.totalOrders}</p>
          </div>

          <div className="admin-card">
            <h3>💰 Doanh thu</h3>
            <p>{summary.totalRevenue.toLocaleString()} VND</p>
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <h3 className="admin-subtitle">🕒 Đơn hàng gần đây</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người đặt</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
            </tr>
          </thead>

          <tbody>
            {summary.recentOrders.length > 0 ? (
              summary.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.name || "Khách hàng"}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>
                  <td>{o.total.toLocaleString()} VND</td>
                  <td>{o.payment}</td>
                  <td
                    style={{
                      color:
                        o.status === "completed"
                          ? "green"
                          : o.status === "cancelled"
                          ? "red"
                          : "#555",
                    }}
                  >
                    {o.status}
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Nút chuyển nhanh */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            className="admin-btn"
            onClick={() => navigate("/admin/users")}
            style={{ marginRight: 12 }}
          >
            👤 Quản lý người dùng
          </button>

          <button className="admin-btn" onClick={() => navigate("/admin")}>
            🛒 Quản lý sản phẩm
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" />
      <Footer />
    </>
  );
}

export default Dashboard;

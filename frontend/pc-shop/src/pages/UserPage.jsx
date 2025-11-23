import { useEffect, useState } from "react";
import axios from "../services/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/UserPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.id) {
      toast.error("Vui lòng đăng nhập để xem hồ sơ!");
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        // 🧍‍♂️ Lấy thông tin người dùng
        const { data: userData } = await axios.get(`/auth/${userInfo.id}`);
        setUser(userData);

        // 🧾 Lấy danh sách đơn hàng theo userId
        const { data: orderData } = await axios.get(`/orders/user/${userInfo.id}`);

        // 🔹 Lọc đơn COD + VNPAY
        const filteredOrders = orderData.filter(
          (order) => order.payment === "cod" || order.payment === "vnpay"
        );
        setOrders(filteredOrders);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err.response?.data || err.message);
        toast.error("Không thể tải thông tin tài khoản hoặc đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Đang tải dữ liệu...</p>;
  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/auth/${user._id}`, {
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      toast.error("Không thể cập nhật hồ sơ!");
    }
  };

  const handleReorder = (order) => {
    const newCartItems = order.items.map((item) => ({
      id: item.productId?._id,
      name: item.productId?.name,
      price: item.productId?.price,
      image: item.productId?.image,
      quantity: item.quantity,
    }));

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, ...newCartItems];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  return (
    <div>
      <Navbar />
      <div className="user-page">
        <h2>👤 Hồ sơ tài khoản</h2>
        <div className="user-info">
          <p><b>Họ tên:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Số điện thoại:</b> {user.phone || "Chưa cập nhật"}</p>
          <p><b>Địa chỉ:</b> {user.address || "Chưa cập nhật"}</p>
        </div>

        <h3>Cập nhật hồ sơ</h3>
        <form onSubmit={handleUpdateProfile} className="user-edit-form">
          <label>Họ tên</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <label>Số điện thoại</label>
          <input
            type="text"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
          <label>Địa chỉ</label>
          <input
            type="text"
            value={user.address || ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
          />
          <button type="submit" className="save-btn">Lưu thay đổi</button>
        </form>

        <h3>🛍️ Đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="order-list">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hình thức</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const firstItem = order.items?.[0];
                  return (
                    <tr key={order._id}>
                      <td>
                        <img
                          src={firstItem?.productId?.image || "/no-image.jpg"}
                          alt={firstItem?.productId?.name || "Sản phẩm"}
                          className="order-thumb"
                        />
                      </td>
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td>{order.total?.toLocaleString() || 0} VND</td>
                      <td>{order.status || "Đang xử lý"}</td>
                      <td>{order.payment?.toUpperCase() || "COD"}</td>
                      <td>
                        <button
                          className="reorder-btn"
                          onClick={() => handleReorder(order)}
                        >
                          🛒 Mua lại
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default UserPage;

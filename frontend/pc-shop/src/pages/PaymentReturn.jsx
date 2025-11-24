import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/PaymentReturn.css';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác minh giao dịch...");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pendingOrder = JSON.parse(localStorage.getItem("vnpay_pending"));
        if (!pendingOrder) {
          setStatus("error");
          setMessage("Không tìm thấy thông tin đơn hàng.");
          return;
        }

        const queryString = window.location.search;
        const vnp_Params = Object.fromEntries(new URLSearchParams(queryString).entries());

        const vnp_ResponseCode = vnp_Params.vnp_ResponseCode;
        const vnp_TxnRef = vnp_Params.vnp_TxnRef;

        if (!vnp_ResponseCode || !vnp_TxnRef) {
          setStatus("error");
          setMessage("Thiếu thông tin thanh toán.");
          return;
        }

        setOrderId(vnp_TxnRef);

        const response = await axios.post(
          "https://devops-api-2.onrender.com/api/orders/vnpay/confirm",
          {
            orderData: pendingOrder.orderData,
            vnp_Params,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success && vnp_ResponseCode === "00") {
          setStatus("success");
          setMessage("Thanh toán thành công!");
          localStorage.removeItem("vnpay_pending");
          const user = JSON.parse(localStorage.getItem("userInfo"));
            if (user) {
              localStorage.removeItem(`cart_${user.id}`);
            } else {
              localStorage.removeItem("cart_guest");
            }

            localStorage.setItem("vnpay_success", "true");

            // Cập nhật UI toàn site
            window.dispatchEvent(new Event("storage"));

        } else {
          setStatus("error");
          setMessage(response.data.message || "Thanh toán thất bại.");
        }
      } catch (err) {
        console.error("💥 Lỗi xác minh thanh toán:", err);
        setStatus("error");
        setMessage("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setTimeout(() => navigate("/"), 5000);
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="payment-return-container">
      <div className="payment-return-card">
        {status === "loading" && (
          <>
            <div className="payment-return-spin"></div>
            <h2 className="payment-return-title">{message}</h2>
          </>
        )}

        {status === "success" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="Success"
              className="payment-return-success-img"
            />
            <h2 className="payment-return-title payment-return-success-title">
              Thanh toán thành công!
            </h2>
            <p className="payment-return-message">Mã giao dịch: {orderId}</p>
            <p className="payment-return-message">Cảm ơn bạn đã mua hàng</p>
          </>
        )}

        {status === "error" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
              alt="Error"
              className="payment-return-error-img"
            />
            <h2 className="payment-return-title payment-return-error-title">{message}</h2>
            {orderId && <p className="payment-return-message">Mã giao dịch: {orderId}</p>}
          </>
        )}

        <p className="payment-return-footer">Đang chuyển về trang chủ...</p>
      </div>
    </div>
  );
};

export default PaymentReturn;

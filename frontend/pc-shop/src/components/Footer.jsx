// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTiktok, FaYoutube, FaUsers } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import '../css/Footer.css'; // CSS riêng cho footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div>
          <h4>VỀ TR</h4>
          <p>Giới thiệu</p>
          <p>Tuyển dụng</p>
          <p>Liên hệ</p>
        </div>
        <div>
          <h4>CHÍNH SÁCH</h4>
          <p>Chính sách bảo hành</p>
          <p>Chính sách giao hàng</p>
          <p>Chính sách bảo mật</p>
        </div>
        <div>
          <h4>THÔNG TIN</h4>
          <p>Hệ thống cửa hàng</p>
          <p>Hướng dẫn mua hàng</p>
          <p>Hướng dẫn thanh toán</p>
          <p>Hướng dẫn trả góp</p>
          <p>Tra cứu địa chỉ bảo hành</p>
          <p>Build PC</p>
        </div>
        <div>
          <h4>TỔNG ĐÀI HỖ TRỢ <span>(8:00 - 21:00)</span></h4>
          <p>Mua hàng: <a href="tel:19005301">1900.5301</a></p>
          <p>Bảo hành: <a href="tel:19005325">1900.5325</a></p>
          <p>Khiếu nại: <a href="tel:18006173">1800.6173</a></p>
          <p>Email: <a href="mailto:cskh@gearvn.com">tr@gmail.com</a></p>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <span>KẾT NỐI VỚI CHÚNG TÔI</span>
        <div className="social-icons">
          <FaFacebook />
          <FaTiktok />
          <FaYoutube />
          <SiZalo />
          <FaUsers />
        </div>
      </div>
    </footer>
  );
}

export default Footer;

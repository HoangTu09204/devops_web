import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/axios';
import '../css/ProductDetailPage.css'; 
import Navbar from '../components/Navbar'; // ⬅️ Import Navbar
import Footer from '../components/Footer'; // ⬅️ Import Footer

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  return (
    <>
      <Navbar /> {/* ⬅️ Chèn Navbar */}
      
      <div className="product-detail-container">
        <div className="product-detail-card">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <p><b>Thương hiệu:</b> {product.brand}</p>
            <p><b>Giá:</b> <span className="product-detail-price">{Number(product.price).toLocaleString()} VND</span></p>
            <p className="product-detail-desc">{product.description}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(item => item._id === product._id);
                if (existing) {
                  existing.quantity += 1;
                } else {
                  cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Đã thêm vào giỏ hàng!');
              }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <Footer /> {/* ⬅️ Chèn Footer */}
    </>
  );
}

export default ProductDetailPage;

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/SearchResults.css';

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`https://devops-api-2.onrender.com/api/products?search=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error('Lỗi khi tìm sản phẩm:', error);
      }
    };
    if (query) fetchResults();
  }, [query]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <div>
      <Navbar />

      <div className="search-results-container">
        <h2 className="search-title">
          Kết quả tìm kiếm cho: <strong>{query}</strong>
        </h2>

        {results.length > 0 ? (
          <div className="product-list">
            {results.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p><b>Hãng:</b> {product.brand}</p>
                <p className="price"><b>Giá:</b> {Number(product.price).toLocaleString()} VND</p>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  🛒 Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-result">Không tìm thấy sản phẩm nào phù hợp.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SearchResults;

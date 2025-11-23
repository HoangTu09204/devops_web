import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CategoryPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products?category=${categoryName}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [categoryName]);

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h2 className="category-title">Danh mục: {categoryName}</h2>
        <div className="product-list">
          {products.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.price.toLocaleString()} ₫</p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;

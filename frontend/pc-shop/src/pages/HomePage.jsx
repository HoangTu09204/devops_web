import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = [
  'Laptop',
  'PC - Máy tính bàn',
  'Màn hình máy tính',
  'Linh kiện máy tính',
  'PC Gameming',
  'Phụ kiện'
];

function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [visibleIndexes, setVisibleIndexes] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showAllLinhKien, setShowAllLinhKien] = useState(false);
  const productSectionRef = useRef(null);
  const linhKienRef = useRef(null);

  const mainBanners = [
    {
      img: "https://www.cougar-extreme.co.uk/image/cache/catalog/slider/banner-choose-your-sytsem-1920x750.jpg",
      showroom: "",
    },
  ];

  const subBanners = [
    {
      img: "https://mtcomputer.vn/wp-content/uploads/2024/06/3834x1834.png",
      alt: ""
    },
    {
      img: "https://img.freepik.com/premium-psd/black-friday-sale-desktop-computers-banner-template-3d-render_444361-45.jpg",
      alt: ""
    },
    {
      img: "https://dgc.com.vn/wp-content/uploads/2021/05/web-banner-msi-02-800x419.jpg",
      alt: ""
    }
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then(res => setAllProducts(res.data))
      .catch(err => console.error(err));

    CATEGORIES.forEach(category => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/products?category=${category}`)
        .then(res => {
          setCategoryProducts(prev => ({
            ...prev,
            [category]: res.data
          }));
          setVisibleIndexes(prev => ({
            ...prev,
            [category]: 0
          }));
        })
        .catch(err => console.error(`Lỗi lấy sản phẩm ${category}:`, err));
    });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('✅ Đã thêm vào giỏ hàng!', {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  };

  const handleNext = (category) => {
    setVisibleIndexes(prev => {
      const newIndex = prev[category] + 4;
      const maxIndex = categoryProducts[category]?.length - 4;
      return {
        ...prev,
        [category]: newIndex > maxIndex ? maxIndex : newIndex
      };
    });
  };

  const handlePrev = (category) => {
    setVisibleIndexes(prev => ({
      ...prev,
      [category]: Math.max(prev[category] - 4, 0)
    }));
  };

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
    setTimeout(() => {
      productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleShowAllLinhKien = () => {
    setShowAllLinhKien(prev => !prev);
    setTimeout(() => {
      linhKienRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderProductCarousel = (title, products, category) => {
    if (!products || products.length === 0) return null;

    const isLinhKien = category === 'Linh kiện máy tính';

    if (isLinhKien && showAllLinhKien) {
      return (
        <div className="homepage-container" key={category} ref={linhKienRef}>
          <div className="carousel-header">
            <h2 className="homepage-title">{title}</h2>
            <button className="view-all-link" onClick={toggleShowAllLinhKien}>Thu gọn ▲</button>
          </div>
          <div className="product-list">
            {products.map(p => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`} className="product-link">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p><b>Hãng:</b> {p.brand}</p>
                  <p className="price"><b>Giá:</b> {Number(p.price).toLocaleString()} VND</p>
                </Link>
                <button className="add-to-cart-btn" onClick={() => addToCart(p)}>🛒 Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const startIndex = visibleIndexes[category] || 0;
    const visibleItems = products.slice(startIndex, startIndex + 4);

    return (
      <div className="homepage-container" key={category} ref={isLinhKien ? linhKienRef : null}>
        <div className="carousel-header">
          <h2 className="homepage-title">{title}</h2>
          {isLinhKien ? (
            <button className="view-all-link" onClick={toggleShowAllLinhKien}>Xem tất cả ›</button>
          ) : (
            <Link to={`/category/${encodeURIComponent(category)}`} className="view-all-link">Xem tất cả ›</Link>
          )}
        </div>

        <div className="carousel-container">
          <button className="carousel-btn" onClick={() => handlePrev(category)} disabled={startIndex === 0}>
            <FaChevronLeft />
          </button>

          <div className="carousel-products">
            {visibleItems.map(p => (
              <div key={p._id} className="product-card horizontal">
                <Link to={`/product/${p._id}`} className="product-link">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p><b>Hãng:</b> {p.brand}</p>
                  <p className="price"><b>Giá:</b> {Number(p.price).toLocaleString()} VND</p>
                </Link>
                <button className="add-to-cart-btn" onClick={() => addToCart(p)}>🛒 Thêm vào giỏ</button>
              </div>
            ))}
          </div>

          <button className="carousel-btn" onClick={() => handleNext(category)} disabled={startIndex + 4 >= products.length}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      {/* MAIN BANNER */}
      <div className="banner-carousel">
        {mainBanners.map((banner, index) => (
          <div key={index} className="banner-slide">
            <img src={banner.img} alt={`Banner ${index + 1}`} />
            <div className="showroom-label">{banner.showroom}</div>
          </div>
        ))}
      </div>

      {/* SUB BANNERS */}
      <div className="sub-banners">
        {subBanners.map((b, idx) => (
          <div key={idx} className="sub-banner-item">
            <img src={b.img} alt={b.alt} />
          </div>
        ))}
      </div>

      {/* SẢN PHẨM TỔNG HỢP */}
      <div className="homepage-container" ref={productSectionRef}>
        <div className="homepage-header">
          <h1 className="homepage-title">Các sản phẩm máy tính</h1>
          <button className="toggle-view-btn" onClick={toggleShowAll}>
            {showAll ? 'Thu gọn ▲' : 'Xem tất cả ▼'}
          </button>
        </div>

        <div className="product-list">
          {(showAll ? allProducts : allProducts.slice(0, 8)).map(p => (
            <div key={p._id} className="product-card">
              <Link to={`/product/${p._id}`} className="product-link">
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p><b>Hãng:</b> {p.brand}</p>
                <p className="price"><b>Giá:</b> {Number(p.price).toLocaleString()} VND</p>
              </Link>
              <button className="add-to-cart-btn" onClick={() => addToCart(p)}>🛒 Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </div>

      {/* CÁC DANH MỤC */}
      {CATEGORIES.map(category =>
  renderProductCarousel(category, categoryProducts[category], category)
)}


      <Footer />
    </div>
  );
}

export default HomePage;

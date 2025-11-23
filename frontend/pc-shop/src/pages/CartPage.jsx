import { useEffect, useState, useContext } from 'react';
import '../css/CartPage.css';
import { FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getCartKey = (userId) => `cart_${userId}`;

  // Load giỏ hàng khi user login, merge cart cũ hoặc cart_guest
  useEffect(() => {
    if (!user) {
      toast.warning('⚠️ Vui lòng đăng nhập để xem giỏ hàng!', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      const oldCart = JSON.parse(localStorage.getItem('cart')) || [];
      const guestCart = JSON.parse(localStorage.getItem('cart_guest')) || [];
      const userCart = JSON.parse(localStorage.getItem(getCartKey(user.id))) || [];

      // Merge oldCart và guestCart vào userCart
      const mergedCart = [...userCart];

      [...oldCart, ...guestCart].forEach(item => {
        const index = mergedCart.findIndex(ci => ci._id === item._id);
        if (index > -1) {
          mergedCart[index].quantity += item.quantity;
        } else {
          mergedCart.push(item);
        }
      });

      setCart(mergedCart);
      localStorage.setItem(getCartKey(user.id), JSON.stringify(mergedCart));

      // Xóa giỏ hàng cũ
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_guest');
    }
  }, [user, navigate]);

  // Lưu giỏ hàng vào localStorage và state
  const saveCart = (updatedCart) => {
  setCart(updatedCart);
  const cartKey = user ? getCartKey(user.id) : 'cart_guest';
  localStorage.setItem(cartKey, JSON.stringify(updatedCart));

  // ⭐ Trigger event storage để Navbar cập nhật ngay
  window.dispatchEvent(new Event('storage'));
};


  const addToCart = (product) => {
    const cartKey = user ? getCartKey(user.id) : 'cart_guest';
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existIndex = storedCart.findIndex(item => item._id === product._id);
    if (existIndex > -1) {
      storedCart[existIndex].quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    saveCart(storedCart);
    toast.success('✅ Thêm sản phẩm vào giỏ hàng thành công', {
      position: 'top-center',
      autoClose: 1500,
    });
  };

  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 1 ? newQty : 1 };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    saveCart(updatedCart);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.warning('⚠️ Vui lòng đăng nhập để thanh toán!', { position: 'top-center', autoClose: 3000 });
    } else {
      navigate('/checkout');
    }
  };

  if (!user) return <ToastContainer />;

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h1>Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <p>Không có sản phẩm nào trong giỏ hàng.</p>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Hãng: {item.brand}</p>
                  <p className="price">{Number(item.price).toLocaleString()} VND</p>
                  <div className="cart-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      title="Xoá sản phẩm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <h2>Tổng cộng: {totalPrice.toLocaleString()} VND</h2>
              <button onClick={handleCheckout}>Thanh toán</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default CartPage;

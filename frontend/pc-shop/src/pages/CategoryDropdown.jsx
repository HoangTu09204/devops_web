import '../css/CategoryDropdown.css';
import {
  FaLaptop, FaDesktop, FaRegImages,
  FaMicrochip, FaPlug
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

function CategoryDropdown() {
  const navigate = useNavigate();

  const categories = [
    { icon: <FaLaptop />, name: 'Laptop' },
    { icon: <FaDesktop />, name: 'PC - Máy tính bàn' },
    { icon: <FaRegImages />, name: 'Màn hình máy tính' },
    { icon: <FaMicrochip />, name: 'Linh kiện máy tính' },
    { icon: <FaPlug />, name: 'Phụ kiện' },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="category-dropdown">
      {categories.map((cat, idx) => (
        <div
          className="category-item"
          key={idx}
          onClick={() => handleCategoryClick(cat.name)}
        >
          <span className="category-icon">{cat.icon}</span>
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryDropdown;

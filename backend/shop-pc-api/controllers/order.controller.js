const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const {
      items, total, name, email, phone,
      address, province, note, payment
    } = req.body;

    const order = new Order({
      userId: req.user.id || req.user.userId,
      items,
      total,
      name,
      email,
      phone,
      address,
      province,
      note,
      payment
    });

    await order.save();

    const populatedOrder = await order.populate([
      { path: 'items.productId' },
      { path: 'userId' }
    ]);
    req.app.get('io').emit('new-order', populatedOrder);

    res.status(201).json(order);
  } catch (err) {
    console.error('Lỗi tạo đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .populate('items.productId userId');
    res.json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng theo userId:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng người dùng' });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }) // ✅ sửa ở đây
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng cá nhân:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng cá nhân' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId userId');
    res.json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy tất cả đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy tất cả đơn hàng' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái đơn hàng' });
  }
};

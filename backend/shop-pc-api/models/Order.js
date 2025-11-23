const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],

  total: Number,
  name: String,
  email: String,
  phone: String,
  address: String,
  province: String,
  note: String,

  // Hình thức thanh toán (COD, VNPAY, v.v.)
  payment: { type: String, default: 'COD' },

  // ✅ Trạng thái đơn hàng
  status: { type: String, default: 'pending' }, // pending | paid | failed | cancelled

  // ✅ Thông tin VNPAY (bổ sung thêm)
  paymentInfo: {
    transactionNo: { type: String },   // vnp_TransactionNo
    bankCode: { type: String },        // vnp_BankCode
    cardType: { type: String },        // vnp_CardType
    responseCode: { type: String },    // vnp_ResponseCode
    payDate: { type: String },         // vnp_PayDate (YYYYMMDDHHmmss)
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

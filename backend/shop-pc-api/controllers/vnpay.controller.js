require('dotenv').config();
const { VNPay } = require('vnpay');
const Order = require('../models/Order');

// === CẤU HÌNH .env ===
const TMN_CODE = process.env.VNP_TMNCODE;
const HASH_SECRET = process.env.VNP_HASHSECRET;
const VNP_HOST = process.env.VNP_URL;
const RETURN_URL = process.env.VNP_RETURNURL;

// === KHỞI TẠO VNPAY ===
const vnpay = new VNPay({
  tmnCode: TMN_CODE,
  secureSecret: HASH_SECRET,
  vnpayHost: VNP_HOST,
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
});

/**
 * 🧾 TẠO URL THANH TOÁN (Frontend sẽ redirect tới URL này)
 */
exports.createPaymentUrl = async (req, res) => {
  try {
    const { items, total, name, email, phone, address, province, note } = req.body;

    const roundedTotal = Math.round(total);
    if (roundedTotal <= 0) {
      return res.status(400).json({ message: 'Tổng tiền không hợp lệ' });
    }

    const txnRef = Date.now().toString().slice(-10);
    const ipAddr =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1';

    // Tạo link thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: roundedTotal,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
    });

    res.json({
      paymentUrl,
      txnRef,
      orderData: { items, total: roundedTotal, name, email, phone, address, province, note },
    });
  } catch (err) {
    console.error('💥 Lỗi tạo URL VNPAY:', err);
    res.status(500).json({ message: 'Lỗi tạo thanh toán', error: err.message });
  }
};

/**
 * ✅ XÁC NHẬN THANH TOÁN TỪ FRONTEND (VNPAY RETURN)
 */
exports.confirmVnpayReturn = async (req, res) => {
  try {
    const { vnp_Params, orderData } = req.body;

    console.log("🔍 Nhận từ frontend:", { vnp_Params, orderData });

    if (!vnp_Params || !orderData) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu xác minh" });
    }

    // ✅ Kiểm tra chữ ký trả về từ VNPAY
    const result = vnpay.verifyReturnUrl(vnp_Params);
    console.log("✅ Kết quả verifyReturnUrl:", result);

    if (!result.isVerified) {
      return res.status(400).json({ success: false, message: "Sai chữ ký VNPAY" });
    }

    if (result.vnp_ResponseCode !== "00" && result.vnp_TransactionStatus !== "00") {
      return res.status(400).json({ success: false, message: "Giao dịch thất bại" });
    }

    // ✅ Lưu đơn hàng khi thanh toán thành công
    const order = await Order.create({
      userId: req.user?.id || null,
      items: orderData.items,
      total: orderData.total,
      name: orderData.name?.trim(),
      email: orderData.email?.trim(),
      phone: orderData.phone?.trim(),
      address: orderData.address?.trim(),
      province: orderData.province?.trim(),
      note: orderData.note?.trim(),
      payment: "VNPAY",
      status: "paid",
      paymentInfo: {
        transactionNo: result.vnp_TransactionNo,
        bankCode: result.vnp_BankCode,
        responseCode: result.vnp_ResponseCode,
        payDate: result.vnp_PayDate,
        txnRef: result.vnp_TxnRef,
      },
    });

    console.log("✅ Đơn hàng đã lưu:", order._id);
    res.json({ success: true, message: "Thanh toán thành công", order });
  } catch (err) {
    console.error("💥 Lỗi xác nhận VNPAY:", err);
    res.status(500).json({ success: false, message: "Lỗi server khi xác nhận thanh toán" });
  }
};

/**
 * 🔁 XỬ LÝ IPN (VNPAY GỌI TRỰC TIẾP TỚI SERVER)
 */
exports.vnpayIPN = async (req, res) => {
  try {
    const query = req.query;

    const result = vnpay.verifyReturnUrl(query);

    if (!result.isVerified) {
      return res.status(400).send('Sai chữ ký');
    }

    // TODO: cập nhật trạng thái đơn hàng trong DB theo txnRef
    res.send('IPN OK');
  } catch (err) {
    console.error('💥 Lỗi IPN VNPAY:', err);
    res.status(500).send('Lỗi server');
  }
};

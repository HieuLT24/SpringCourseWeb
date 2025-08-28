import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function PaymentResult() {
  const query = useQuery();
  const successParam = query.get('success');
  const method = (query.get('method') || '').toUpperCase();
  const orderId = query.get('orderId') || query.get('transactionId');
  const amount = query.get('amount');

  const isSuccess = successParam === 'true' || successParam === '1' || successParam === '00';

  const brand = method === 'MOMO' ? {
    name: 'MoMo',
    color: '#A50064',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'
  } : {
    name: 'VNPay',
    color: '#0B5ED7',
    logo: 'https://vnpay.vn/assets/images/logo.svg'
  };

  return (
    <div className="content-wrapper py-5" style={{background: '#f6f9fc'}}>
      <div className="container" style={{maxWidth: 820}}>
        <div className="bg-white rounded-4 shadow p-4 p-md-5 text-center position-relative overflow-hidden">
          <div className="position-absolute top-0 start-50 translate-middle-x" style={{opacity:.05, fontSize: 280}}>
            <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
            <img src={brand.logo} alt={brand.name} style={{height: 40}} />
            <span className="badge" style={{background: brand.color}}>{brand.name}</span>
          </div>
          <h1 className="fw-bold mb-2" style={{color: isSuccess ? '#198754' : '#dc3545'}}>
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán chưa thành công'}
          </h1>
          <p className="text-muted mb-4">Cảm ơn bạn đã tin tưởng CourseWeb.</p>

          <div className="row g-3 justify-content-center mb-4">
            {orderId && (
              <div className="col-md-4">
                <div className="border rounded-3 p-3">
                  <div className="text-muted">Mã giao dịch</div>
                  <div className="fw-semibold">{orderId}</div>
                </div>
              </div>
            )}
            {amount && (
              <div className="col-md-4">
                <div className="border rounded-3 p-3">
                  <div className="text-muted">Số tiền</div>
                  <div className="fw-semibold">{Number(amount).toLocaleString('vi-VN')} VNĐ</div>
                </div>
              </div>
            )}
            <div className="col-md-4">
              <div className="border rounded-3 p-3">
                <div className="text-muted">Trạng thái</div>
                <div className={`fw-semibold ${isSuccess ? 'text-success' : 'text-danger'}`}>
                  {isSuccess ? 'Thành công' : 'Thất bại/Đã hủy'}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home me-2"></i>Về trang chủ
            </Link>
            <Link to="/learning" className="btn btn-success">
              <i className="fas fa-graduation-cap me-2"></i>Tới trang học
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentResult;



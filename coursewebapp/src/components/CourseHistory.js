import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentHistoryService } from '../services/paymentHistoryService';
import { useAuth } from '../contexts/AuthContext';

function CourseHistory() {
    const { isAuthenticated } = useAuth();
    const [courseHistory, setCourseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            loadCourseHistory();
        }
    }, [isAuthenticated]);

    const loadCourseHistory = async () => {
        try {
            setLoading(true);
            setError('');
            
            const result = await paymentHistoryService.getCourseHistory();
            
            if (result.success) {
                setCourseHistory(result.data);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải lịch sử khóa học');
            console.error('Error loading course history:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getPaymentMethodIcon = (method) => {
        switch (method?.toUpperCase()) {
            case 'MOMO':
                return 'fas fa-mobile-alt text-danger';
            case 'VNPAY':
                return 'fas fa-credit-card text-primary';
            default:
                return 'fas fa-money-bill-wave text-success';
        }
    };

    const getPaymentMethodName = (method) => {
        switch (method?.toUpperCase()) {
            case 'MOMO':
                return 'MoMo';
            case 'VNPAY':
                return 'VNPay';
            default:
                return method || 'N/A';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="content-wrapper py-5">
                <div className="container text-center">
                    <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Bạn cần đăng nhập để xem lịch sử khóa học
                    </div>
                    <Link to="/login" className="btn btn-primary">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="content-wrapper py-5">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải lịch sử khóa học...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-wrapper py-5">
                <div className="container text-center">
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                    </div>
                    <button className="btn btn-primary" onClick={loadCourseHistory}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="content-wrapper py-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <h2 className="mb-3">
                            <i className="fas fa-history me-2 text-primary"></i>
                            Lịch sử khóa học đã thanh toán
                        </h2>
                        <p className="text-muted">
                            Danh sách các khóa học bạn đã thanh toán thành công
                        </p>
                    </div>
                </div>

                {courseHistory.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-cart text-muted" style={{ fontSize: '4rem' }}></i>
                        <h4 className="mt-3 text-muted">Chưa có khóa học nào</h4>
                        <p className="text-muted">Bạn chưa thanh toán thành công khóa học nào</p>
                        <Link to="/courses" className="btn btn-primary">
                            <i className="fas fa-search me-2"></i>
                            Khám phá khóa học
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        {courseHistory.map((course) => (
                            <div key={`${course.courseId}-${course.transactionId}`} className="col-lg-6 col-xl-4 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="position-relative">
                                        {course.courseImage ? (
                                            <img 
                                                src={course.courseImage} 
                                                className="card-img-top" 
                                                alt={course.courseName}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div 
                                                className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                                style={{ height: '200px' }}
                                            >
                                                <i className="fas fa-book text-muted" style={{ fontSize: '3rem' }}></i>
                                            </div>
                                        )}
                                        <div className="position-absolute top-0 end-0 m-2">
                                            <span className="badge bg-success">
                                                <i className="fas fa-check me-1"></i>
                                                Đã thanh toán
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-truncate" title={course.courseName}>
                                            {course.courseName}
                                        </h5>
                                        
                                        <p className="card-text text-muted small flex-grow-1">
                                            {course.courseDescription ? 
                                                (course.courseDescription.length > 100 ? 
                                                    course.courseDescription.substring(0, 100) + '...' : 
                                                    course.courseDescription
                                                ) : 'Không có mô tả'
                                            }
                                        </p>

                                        <div className="mt-auto">
                                            <div className="row g-2 mb-3">
                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        <i className="fas fa-calendar-alt me-1"></i>
                                                        Ngày đăng ký
                                                    </small>
                                                    <small className="fw-bold">
                                                        {formatDate(course.enrollmentDate)}
                                                    </small>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        <i className="fas fa-clock me-1"></i>
                                                        Ngày thanh toán
                                                    </small>
                                                    <small className="fw-bold">
                                                        {formatDate(course.paymentDate)}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="row g-2 mb-3">
                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        <i className="fas fa-credit-card me-1"></i>
                                                        Phương thức
                                                    </small>
                                                    <small className="fw-bold">
                                                        <i className={`${getPaymentMethodIcon(course.paymentMethod)} me-1`}></i>
                                                        {getPaymentMethodName(course.paymentMethod)}
                                                    </small>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        <i className="fas fa-money-bill-wave me-1"></i>
                                                        Số tiền
                                                    </small>
                                                    <small className="fw-bold text-success">
                                                        {formatCurrency(course.amountPaid)}
                                                    </small>
                                                </div>
                                            </div>

                                            {course.transactionId && (
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">
                                                        <i className="fas fa-hashtag me-1"></i>
                                                        Mã giao dịch
                                                    </small>
                                                    <small className="fw-bold font-monospace">
                                                        {course.transactionId}
                                                    </small>
                                                </div>
                                            )}

                                            <div className="d-grid gap-2">
                                                <Link 
                                                    to={`/learning/course/${course.courseId}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="fas fa-play me-1"></i>
                                                    Tiếp tục học
                                                </Link>
                                                <Link 
                                                    to={`/courses/${course.courseId}`}
                                                    className="btn btn-outline-secondary btn-sm"
                                                >
                                                    <i className="fas fa-eye me-1"></i>
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {courseHistory.length > 0 && (
                    <div className="row mt-4">
                        <div className="col text-center">
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Tổng cộng <strong>{courseHistory.length}</strong> khóa học đã thanh toán thành công
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseHistory;

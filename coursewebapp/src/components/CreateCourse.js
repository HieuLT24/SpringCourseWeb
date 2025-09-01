import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { authService } from '../services/authService';

const CreateCourse = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryName: '',
    image: null
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'TEACHER') {
          navigate('/unauthorized', { 
            state: { message: 'Chỉ giáo viên mới có thể tạo khóa học' }
          });
        }
      } catch (error) {
        navigate('/login', { 
          state: { message: 'Vui lòng đăng nhập để tiếp tục' }
        });
      }
    };

    checkAccess();
  }, [navigate]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await courseService.getListCategories();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Kích thước file không được vượt quá 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Chỉ chấp nhận file hình ảnh'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleCategorySelect = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'new') {
      setShowNewCategoryInput(true);
      setFormData(prev => ({
        ...prev,
        categoryName: ''
      }));
    } else {
      setShowNewCategoryInput(false);
      setFormData(prev => ({
        ...prev,
        categoryName: selectedCategory
      }));
    }
  };

  const handleNewCategory = () => {
    setShowNewCategoryInput(true);
    setFormData(prev => ({
      ...prev,
      categoryName: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề khóa học không được để trống';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Tiêu đề khóa học không được vượt quá 200 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả khóa học không được để trống';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Mô tả khóa học không được vượt quá 1000 ký tự';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá khóa học phải là số dương';
    }

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Vui lòng chọn hoặc nhập danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('Submitting form data:', formData);
      const currentUser = await authService.getCurrentUser();
      console.log('Current user:', currentUser);
      
      const result = await courseService.createCourse(formData);
      console.log('Course creation result:', result);
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      categoryName: '',
      image: null
    });
    setImagePreview(null);
    setShowNewCategoryInput(false);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (submitSuccess) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem'
        }}
      >
        <div 
          className="bg-white p-5 rounded-4 shadow-lg text-center"
          style={{maxWidth: '500px', width: '100%'}}
        >
          <div 
            className="text-success mb-4"
            style={{fontSize: '4rem'}}
          >
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-success fw-bold mb-3">Thành Công!</h2>
          <p className="text-muted fs-5 mb-4">Khóa học đã được tạo thành công và đang chờ admin duyệt.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button 
              className="btn btn-primary fw-bold px-4 py-2"
              onClick={() => setSubmitSuccess(false)}
              style={{borderRadius: '10px'}}
            >
              Tạo Khóa Học Mới
            </button>
            <button 
              className="btn btn-outline-primary fw-bold px-4 py-2"
              onClick={() => navigate('/learning')}
              style={{borderRadius: '10px'}}
            >
              Xem Khóa Học Của Tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div 
          className="text-center mb-5 p-4 rounded-4 shadow"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <h1 className="display-4 fw-bold mb-3">
            <i className="fas fa-plus-circle me-3 text-warning"></i>
            Tạo Khóa Học Mới
          </h1>
          <p className="fs-5 opacity-75 mb-0">
            Điền thông tin để tạo khóa học mới. Khóa học sẽ được admin duyệt trước khi xuất bản.
          </p>
        </div>

        {/* Alert Messages */}
        {errors.submit && (
          <div className="alert alert-danger border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errors.submit}
          </div>
        )}

        <div className="row g-4">
          {/* Form Section */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div 
                className="card-header border-0 text-white text-center py-3"
                style={{
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                  borderRadius: '12px 12px 0 0'
                }}
              >
                <h3 className="mb-0 fw-bold">
                  <i className="fas fa-edit me-2"></i>
                  Thông Tin Khóa Học
                </h3>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label fw-bold text-dark">
                      <i className="fas fa-heading me-2 text-primary"></i>
                      Tiêu đề khóa học <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Nhập tiêu đề khóa học"
                      maxLength="200"
                      required
                      style={{borderRadius: '10px', border: '2px solid #e9ecef'}}
                    />
                    <small className="form-text text-muted mt-1">
                      {formData.title.length}/200 ký tự
                    </small>
                    {errors.title && (
                      <div className="invalid-feedback fw-bold">{errors.title}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-bold text-dark">
                      <i className="fas fa-align-left me-2 text-primary"></i>
                      Mô tả khóa học <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Mô tả chi tiết về khóa học"
                      maxLength="1000"
                      required
                      style={{
                        borderRadius: '10px', 
                        border: '2px solid #e9ecef',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                    <small className="form-text text-muted mt-1">
                      {formData.description.length}/1000 ký tự
                    </small>
                    {errors.description && (
                      <div className="invalid-feedback fw-bold">{errors.description}</div>
                    )}
                  </div>

                  {/* Price and Category Row */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label fw-bold text-dark">
                        <i className="fas fa-tag me-2 text-primary"></i>
                        Giá khóa học <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                          required
                          style={{borderRadius: '10px 0 0 10px', border: '2px solid #e9ecef'}}
                        />
                        <span 
                          className="input-group-text fw-bold"
                          style={{
                            borderRadius: '0 10px 10px 0',
                            border: '2px solid #e9ecef',
                            borderLeft: 'none',
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          VNĐ
                        </span>
                      </div>
                      {errors.price && (
                        <div className="invalid-feedback fw-bold">{errors.price}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label fw-bold text-dark">
                        <i className="fas fa-folder me-2 text-primary"></i>
                        Danh mục <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-2">
                        {!showNewCategoryInput ? (
                          <>
                            <select
                              className="form-select form-select-lg flex-grow-1"
                              value=""
                              onChange={handleCategorySelect}
                              style={{borderRadius: '10px', border: '2px solid #e9ecef'}}
                            >
                              <option value="">Chọn danh mục có sẵn</option>
                              {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                              <option value="new">+ Tạo danh mục mới</option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-outline-secondary fw-bold"
                              onClick={handleNewCategory}
                              style={{
                                borderRadius: '10px',
                                border: '2px solid #6c757d',
                                padding: '12px 16px'
                              }}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </>
                        ) : (
                          <input
                            type="text"
                            name="categoryName"
                            className={`form-control form-control-lg ${errors.categoryName ? 'is-invalid' : ''}`}
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            placeholder="Nhập tên danh mục mới"
                            required
                            style={{borderRadius: '10px', border: '2px solid #e9ecef'}}
                          />
                        )}
                      </div>
                      {errors.categoryName && (
                        <div className="invalid-feedback fw-bold">{errors.categoryName}</div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label htmlFor="image" className="form-label fw-bold text-dark">
                      <i className="fas fa-image me-2 text-primary"></i>
                      Hình ảnh khóa học
                    </label>
                    <div className="position-relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        name="image"
                        className="form-control form-control-lg"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e9ecef',
                          padding: '12px'
                        }}
                      />
                      {imagePreview && (
                        <div className="position-relative mt-3 text-center">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid rounded-3 shadow-sm"
                            style={{
                              maxHeight: '200px',
                              maxWidth: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            style={{
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <div className="text-danger fw-bold mt-1">{errors.image}</div>
                    )}
                    <small className="form-text text-muted mt-2 d-block">
                      <i className="fas fa-info-circle me-1"></i>
                      Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB
                    </small>
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-3 pt-3 border-top">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-bold flex-grow-1"
                      disabled={loading}
                      style={{
                        borderRadius: '12px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
                      }}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Tạo Khóa Học
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-lg fw-bold"
                      onClick={handleReset}
                      disabled={loading}
                      style={{
                        borderRadius: '12px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                        border: 'none'
                      }}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Làm Mới
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{position: 'sticky', top: '2rem'}}>
              <div 
                className="card-header border-0 text-white text-center py-3"
                style={{
                  background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
                  borderRadius: '12px 12px 0 0'
                }}
              >
                <h3 className="mb-0 fw-bold">
                  <i className="fas fa-eye me-2"></i>
                  Xem Trước
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="text-center">
                  {imagePreview ? (
                    <div className="mb-3">
                      <img 
                        src={imagePreview} 
                        alt="Course preview" 
                        className="img-fluid rounded-3 shadow-sm"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded-3 p-4 mb-3"
                      style={{
                        borderColor: '#dee2e6',
                        backgroundColor: '#f8f9fa',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i 
                        className="fas fa-image text-muted mb-2"
                        style={{fontSize: '3rem', opacity: 0.5}}
                      ></i>
                      <p className="text-muted mb-0 small">Hình ảnh khóa học sẽ hiển thị ở đây</p>
                    </div>
                  )}
                  
                  <div className="text-start">
                    <h4 
                      className="fw-bold text-dark mb-3"
                      style={{fontSize: '1.25rem', lineHeight: '1.3'}}
                    >
                      {formData.title || 'Tiêu đề khóa học'}
                    </h4>
                    <p 
                      className="text-muted mb-3"
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {formData.description || 'Mô tả khóa học sẽ hiển thị ở đây'}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span 
                        className="badge text-white px-3 py-2 fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                          borderRadius: '8px'
                        }}
                      >
                        {formData.categoryName || 'Danh mục'}
                      </span>
                      <span 
                        className="fw-bold fs-5"
                        style={{color: '#28a745'}}
                      >
                        {formData.price ? formatPrice(formData.price) : '0 VNĐ'}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <span 
                        className="badge px-3 py-2 fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                          color: '#212529',
                          borderRadius: '8px'
                        }}
                      >
                        <i className="fas fa-clock me-1"></i>
                        Chờ duyệt
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

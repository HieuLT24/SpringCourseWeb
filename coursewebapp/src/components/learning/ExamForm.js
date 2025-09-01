import React, { useState, useEffect } from 'react';
import { learningService } from '../../services/learningService';

const ExamForm = ({ courseId, exam = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz',
    startDate: '',
    endDate: '',
    durationMinutes: 30,
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        type: exam.type || 'quiz',
        startDate: exam.startDate ? new Date(exam.startDate).toISOString().slice(0, 16) : '',
        endDate: exam.endDate ? new Date(exam.endDate).toISOString().slice(0, 16) : '',
        durationMinutes: exam.durationMinutes || 30,
        isActive: exam.isActive !== undefined ? exam.isActive : true
      });
    }
  }, [exam]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const examData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).getTime() : null,
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : null
      };

      let result;
      if (exam) {
        result = await learningService.updateExam(courseId, exam.id, examData);
      } else {
        result = await learningService.createExam(courseId, examData);
      }

      if (result.success) {
        onSave(result.exam || exam);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      marginBottom: '20px',
      color: '#333',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      border: '1px solid #f5c6cb'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontWeight: '500',
      color: '#555',
      fontSize: '0.9rem'
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    textarea: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '80px',
      transition: 'border-color 0.2s'
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      margin: 0
    },
    formActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    btn: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      backgroundColor: '#007bff',
      color: '#fff'
    },
    btnSecondary: {
      backgroundColor: '#6c757d',
      color: '#fff'
    },
    btnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{exam ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}</h3>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Tiêu đề bài kiểm tra *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề bài kiểm tra"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Nhập mô tả bài kiểm tra"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="type" style={styles.label}>Loại bài kiểm tra</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="quiz">Quiz</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
              <option value="assignment">Bài tập</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="durationMinutes" style={styles.label}>Thời gian làm bài (phút)</label>
            <input
              type="number"
              id="durationMinutes"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
              max="480"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="startDate" style={styles.label}>Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="endDate" style={styles.label}>Thời gian kết thúc</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={styles.checkbox}
            />
            Kích hoạt bài kiểm tra
          </label>
        </div>

        <div style={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              ...(loading && styles.btnDisabled)
            }}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(loading && styles.btnDisabled)
            }}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (exam ? 'Cập nhật' : 'Tạo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;

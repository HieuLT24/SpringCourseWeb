import React, { useState, useEffect } from 'react';
import { learningService } from '../../services/learningService';

const AnswerForm = ({ courseId, examId, questionId, answer = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    content: '',
    isTrue: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (answer) {
      setFormData({
        content: answer.content || '',
        isTrue: answer.isTrue === 1
      });
    }
  }, [answer]);

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
      const answerData = {
        ...formData,
        isTrue: formData.isTrue ? 1 : 0
      };

      let result;
      if (answer) {
        result = await learningService.updateAnswer(courseId, examId, questionId, answer.id, answerData);
      } else {
        result = await learningService.createAnswer(courseId, examId, questionId, answerData);
      }

      if (result.success) {
        onSave(result.answer || answer);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu đáp án');
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
      fontSize: '1.1rem',
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
      minHeight: '60px',
      transition: 'border-color 0.2s'
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
      <h5 style={styles.title}>{answer ? 'Chỉnh sửa đáp án' : 'Thêm đáp án mới'}</h5>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="content" style={styles.label}>Nội dung đáp án *</label>
          <input
            type="text"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Nhập nội dung đáp án"
            style={styles.input}
          />
        </div>

        {/* Loại bỏ explanation */}

        <div style={styles.formGroup}>
          <label style={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="isTrue"
              checked={formData.isTrue}
              onChange={handleChange}
              style={styles.checkbox}
            />
            Đáp án đúng
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
            {loading ? 'Đang lưu...' : (answer ? 'Cập nhật' : 'Thêm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;

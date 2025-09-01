import React, { useState, useEffect } from 'react';
import { learningService } from '../../services/learningService';

const QuestionForm = ({ courseId, examId, question = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    content: '',
    points: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        content: question.content || '',
        points: question.points || 1
      });
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (question) {
        result = await learningService.updateQuestion(courseId, examId, question.id, formData);
      } else {
        result = await learningService.createQuestion(courseId, examId, formData);
      }

      if (result.success) {
        onSave(result.question || question);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu câu hỏi');
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
      fontSize: '1.25rem',
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
    input: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
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
      <h4 style={styles.title}>{question ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</h4>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="content" style={styles.label}>Nội dung câu hỏi *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Nhập nội dung câu hỏi"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="points" style={styles.label}>Điểm</label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleChange}
            min="1"
            max="10"
            style={styles.input}
          />
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
            {loading ? 'Đang lưu...' : (question ? 'Cập nhật' : 'Thêm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;

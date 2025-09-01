import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';
import ExamForm from './ExamForm';
import QuestionForm from './QuestionForm';
import AnswerForm from './AnswerForm';
import QuestionList from './QuestionList';

const ExamManager = () => {
  const { id } = useParams();
  const courseId = parseInt(id);
  
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [showExamForm, setShowExamForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);

  useEffect(() => {
    loadExams();
  }, [courseId]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await learningService.getExams(courseId);
      if (res.success) {
        setExams(res.data || []);
      } else {
        setError(res.message || 'Không thể tải danh sách bài kiểm tra');
      }
    } catch (err) {
      console.error('Load exams error:', err);
      setError('Không thể tải danh sách bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const handleExamSave = (exam) => {
    if (editingExam) {
      setExams(prev => prev.map(e => e.id === exam.id ? exam : e));
    } else {
      setExams(prev => [...prev, exam]);
    }
    setShowExamForm(false);
    setEditingExam(null);
    loadExams(); // Reload để lấy dữ liệu mới nhất
  };

  const handleQuestionSave = (question) => {
    if (editingQuestion) {
      setSelectedExam(prev => ({
        ...prev,
        questions: prev.questions.map(q => q.id === question.id ? question : q)
      }));
    } else {
      setSelectedExam(prev => ({
        ...prev,
        questions: [...(prev.questions || []), question]
      }));
    }
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleAnswerSave = (answer) => {
    if (editingAnswer) {
      setSelectedQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(a => a.id === answer.id ? answer : a)
      }));
    } else {
      setSelectedQuestion(prev => ({
        ...prev,
        answers: [...(prev.answers || []), answer]
      }));
    }
    setShowAnswerForm(false);
    setEditingAnswer(null);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?')) {
      try {
        const result = await learningService.deleteExam(courseId, examId);
        if (result.success) {
          setExams(prev => prev.filter(e => e.id !== examId));
          if (selectedExam?.id === examId) {
            setSelectedExam(null);
            setSelectedQuestion(null);
            setSelectedAnswer(null);
          }
        } else {
          alert(result.message || 'Xóa bài kiểm tra thất bại');
        }
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa bài kiểm tra');
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const result = await learningService.deleteQuestion(courseId, selectedExam.id, questionId);
        if (result.success) {
          setSelectedExam(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
          }));
          if (selectedQuestion?.id === questionId) {
            setSelectedQuestion(null);
            setSelectedAnswer(null);
          }
        } else {
          alert(result.message || 'Xóa câu hỏi thất bại');
        }
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa câu hỏi');
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đáp án này?')) {
      try {
        const result = await learningService.deleteAnswer(courseId, selectedExam.id, selectedQuestion.id, answerId);
        if (result.success) {
          setSelectedQuestion(prev => ({
            ...prev,
            answers: prev.answers.filter(a => a.id !== answerId)
          }));
          if (selectedAnswer?.id === answerId) {
            setSelectedAnswer(null);
          }
        } else {
          alert(result.message || 'Xóa đáp án thất bại');
        }
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa đáp án');
      }
    }
  };

  const openExamForm = (exam = null) => {
    setEditingExam(exam);
    setShowExamForm(true);
  };

  const openQuestionForm = (question = null) => {
    if (!selectedExam) {
      alert('Vui lòng chọn một bài kiểm tra trước');
      return;
    }
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      margin: 0,
      color: '#333',
      fontSize: '1.75rem',
      fontWeight: '600'
    },
    btnPrimary: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    row: {
      display: 'flex',
      gap: '20px'
    },
    col4: {
      flex: '0 0 33.333%'
    },
    col8: {
      flex: '0 0 66.667%'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
      border: '1px solid rgba(0, 0, 0, 0.125)',
      marginBottom: '20px'
    },
    cardHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid rgba(0, 0, 0, 0.125)',
      padding: '15px 20px',
      borderRadius: '8px 8px 0 0'
    },
    cardHeaderTitle: {
      margin: 0,
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#333'
    },
    cardBody: {
      padding: '20px'
    },
    listGroup: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listGroupItem: {
      padding: '15px 20px',
      borderBottom: '1px solid #dee2e6',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    listGroupItemActive: {
      backgroundColor: '#007bff',
      color: '#fff',
      borderColor: '#007bff'
    },
    listGroupItemContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    listGroupItemText: {
      flex: 1
    },
    listGroupItemTitle: {
      margin: '0 0 5px 0',
      fontSize: '1rem',
      fontWeight: '600'
    },
    listGroupItemSubtitle: {
      fontSize: '0.875rem',
      opacity: 0.8
    },
    btnGroup: {
      display: 'flex',
      gap: '5px'
    },
    btnOutline: {
      backgroundColor: 'transparent',
      border: '1px solid #6c757d',
      color: '#6c757d',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    questionItem: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '16px'
    },
    questionContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    questionText: {
      flex: 1
    },
    questionTitle: {
      fontWeight: '600',
      marginBottom: '8px',
      color: '#333'
    },
    questionMeta: {
      fontSize: '0.875rem',
      color: '#6c757d'
    },
    answersList: {
      marginLeft: '20px',
      marginTop: '12px'
    },
    answerItem: {
      backgroundColor: '#fff',
      border: '1px solid #e9ecef',
      borderRadius: '4px',
      padding: '8px 12px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    answerText: {
      flex: 1
    },
    answerCorrect: {
      color: '#198754',
      fontWeight: '700'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    emptyState: {
      textAlign: 'center',
      color: '#6c757d',
      padding: '40px 20px'
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px 20px'
    },
    errorAlert: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '4px',
      border: '1px solid #f5c6cb',
      textAlign: 'center'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorAlert} role="alert">{error}</div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <i className="fas fa-edit" style={{ marginRight: '8px' }}></i>
          Quản lý bài kiểm tra
        </h3>
        <button 
          style={styles.btnPrimary}
          onClick={() => openExamForm()}
        >
          <i className="fas fa-plus"></i>
          Tạo bài kiểm tra
        </button>
      </div>

      <div style={styles.row}>
        {/* Danh sách bài kiểm tra */}
        <div style={styles.col4}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h5 style={styles.cardHeaderTitle}>Danh sách bài kiểm tra</h5>
            </div>
            <div style={{ padding: 0 }}>
              <div style={styles.listGroup}>
                {exams.map(exam => (
                  <div 
                    key={exam.id}
                    style={{
                      ...styles.listGroupItem,
                      ...(selectedExam?.id === exam.id ? styles.listGroupItemActive : {})
                    }}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div style={styles.listGroupItemContent}>
                      <div style={styles.listGroupItemText}>
                        <h6 style={styles.listGroupItemTitle}>
                          {exam.title || `Bài kiểm tra ${exam.id}`}
                        </h6>
                        <small style={styles.listGroupItemSubtitle}>
                          {exam.type} • {exam.durationMinutes} phút
                        </small>
                      </div>
                      <div style={styles.btnGroup}>
                        <button 
                          style={styles.btnOutline}
                          onClick={(e) => {
                            e.stopPropagation();
                            openExamForm(exam);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          style={styles.btnOutline}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExam(exam.id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết bài kiểm tra */}
        <div style={styles.col8}>
          {selectedExam ? (
            <div style={styles.card}>
              <div style={{
                ...styles.cardHeader,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h5 style={styles.cardHeaderTitle}>{selectedExam.title}</h5>
                <div style={styles.btnGroup}>
                  <button 
                    style={{
                      ...styles.btnOutline,
                      borderColor: '#0d6efd',
                      color: '#0d6efd',
                      marginRight: '8px'
                    }}
                    onClick={() => handleQuestionListSelect()}
                  >
                    <i className="fas fa-list" style={{ marginRight: '4px' }}></i>
                    Xem danh sách câu hỏi
                  </button>
                  <button 
                    style={{
                      ...styles.btnOutline,
                      borderColor: '#198754',
                      color: '#198754'
                    }}
                    onClick={() => openQuestionForm()}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '4px' }}></i>
                    Thêm câu hỏi
                  </button>
                </div>
              </div>
              <div style={styles.cardBody}>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Mô tả:</strong> {selectedExam.description || 'Không có mô tả'}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Loại:</strong> {selectedExam.type} • <strong>Thời gian:</strong> {selectedExam.durationMinutes} phút
                </div>
                
                {/* Danh sách câu hỏi - hiển thị trực tiếp */}
                <QuestionList
                  courseId={courseId}
                  examId={selectedExam.id}
                  onQuestionSelect={() => openQuestionForm()}
                  onQuestionEdit={(q) => openQuestionForm(q)}
                  onQuestionDelete={(qid) => handleDeleteQuestion(qid)}
                  onAnswerEdit={(a) => openAnswerForm(a)}
                  onAnswerDelete={(aid) => handleDeleteAnswer(aid)}
                  onAddAnswer={(q) => {
                    setSelectedQuestion(q);
                    openAnswerForm();
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={styles.card}>
              <div style={styles.emptyState}>
                <i className="fas fa-clipboard-list" style={styles.emptyStateIcon}></i>
                <p>Chọn một bài kiểm tra để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forms */}
      {showExamForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <ExamForm
              courseId={courseId}
              exam={editingExam}
              onSave={handleExamSave}
              onCancel={() => {
                setShowExamForm(false);
                setEditingExam(null);
              }}
            />
          </div>
        </div>
      )}

      {showQuestionForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <QuestionForm
              courseId={courseId}
              examId={selectedExam.id}
              question={editingQuestion}
              onSave={handleQuestionSave}
              onCancel={() => {
                setShowQuestionForm(false);
                setEditingQuestion(null);
              }}
            />
          </div>
        </div>
      )}

      {showAnswerForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <AnswerForm
              courseId={courseId}
              examId={selectedExam.id}
              questionId={selectedQuestion.id}
              answer={editingAnswer}
              onSave={handleAnswerSave}
              onCancel={() => {
                setShowAnswerForm(false);
                setEditingAnswer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManager;

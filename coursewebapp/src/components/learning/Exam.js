import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';
import ExamForm from './ExamForm';
import QuestionForm from './QuestionForm';
import AnswerForm from './AnswerForm';

function Exam({ courseId: propCourseId, isTeacher = false }) {
  const { id } = useParams();
  const courseId = propCourseId || parseInt(id);
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const timerRef = useRef(null);

  // States cho ExamManager
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
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
        // Lấy thông tin điểm cao nhất cho mỗi bài thi
        const examsWithScores = await Promise.all(
          (res.data || []).map(async (exam) => {
            try {
              const examDetail = await learningService.takeExam(courseId, exam.id);
              if (examDetail.success) {
                return {
                  ...exam,
                  bestScore: examDetail.data?.bestScore || null
                };
              }
            } catch (err) {
              console.error(`Error loading exam ${exam.id}:`, err);
            }
            return { ...exam, bestScore: null };
          })
        );
        setExams(examsWithScores);
      }
    } catch (err) {
      console.error('Load exams error:', err);
      setError('Không thể tải bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const startExam = async (examId) => {
    try {
      setLoading(true);
      // Lấy thông tin bài thi và câu hỏi khi bắt đầu làm bài
      const examDetail = await learningService.takeExam(courseId, examId);
      if (examDetail.success) {
        const exam = examDetail.data;
        const questionsRes = await learningService.getExamQuestions(courseId, examId);
        if (questionsRes.success) {
          setCurrentExam({
            ...exam,
            id: examId,
            durationMinutes: questionsRes.data?.exam?.durationMinutes || exam.durationMinutes || 0,
            questions: questionsRes.data?.questions || []
          });
          setStarted(true);
          setPage(1);
          setAnswers({});
        }
      }
    } catch (err) {
      console.error('Start exam error:', err);
      alert('Không thể bắt đầu bài thi');
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const totalPages = useMemo(() => {
    const total = currentExam?.questions?.length || 0;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [currentExam]);

  useEffect(() => {
    if (!started) return;
    if (!currentExam?.durationMinutes) return;
    setRemainingSec(currentExam.durationMinutes * 60);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [started, currentExam]);

  const handleSubmit = async (auto = false) => {
    if (!currentExam) return;
    if (!auto) setShowConfirm(true);
    if (!auto) return;
    try {
      const res = await learningService.submitExam(courseId, currentExam.id, { answers });
      if (res.success) {
        const score = res.data?.score ?? null;
        setResultScore(score);
        setShowResult(true);
        setStarted(false);
        // Reload exams để cập nhật điểm cao nhất
        loadExams();
      } else {
        alert('Nộp bài thất bại');
      }
    } catch (err) {
      console.error('Submit exam error:', err);
      alert('Có lỗi xảy ra');
    }
  };

  const resetExam = () => {
    setStarted(false);
    setCurrentExam(null);
    setAnswers({});
    setPage(1);
    setRemainingSec(0);
    timerRef.current && clearInterval(timerRef.current);
  };

  // Functions cho ExamManager
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
    setSelectedQuestion(prev => {
      if (!prev) return prev;
      const updated = editingAnswer
        ? { ...prev, answers: (prev.answers || []).map(a => a.id === answer.id ? answer : a) }
        : { ...prev, answers: [...(prev.answers || []), answer] };
      return updated;
    });

    setSelectedExam(prev => {
      if (!prev) return prev;
      const updatedQuestions = (prev.questions || []).map(q => {
        if (q.id !== selectedQuestion?.id) return q;
        const qAnswers = q.answers || q.answerSet || [];
        const newAnswers = editingAnswer
          ? qAnswers.map(a => a.id === answer.id ? answer : a)
          : [...qAnswers, answer];
        return { ...q, answers: newAnswers };
      });
      return { ...prev, questions: updatedQuestions };
    });

    setShowAnswerForm(false);
    setEditingAnswer(null);
  };

  const openAnswerForm = (answer = null) => {
    if (!selectedQuestion) {
      alert('Vui lòng chọn một câu hỏi trước');
      return;
    }
    setEditingAnswer(answer);
    setShowAnswerForm(true);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?\n\nLưu ý: Tất cả câu hỏi, đáp án và lịch sử làm bài sẽ bị xóa vĩnh viễn!')) {
      try {
        const result = await learningService.deleteExam(courseId, examId);
        if (result.success) {
          setExams(prev => prev.filter(e => e.id !== examId));
          if (selectedExam?.id === examId) {
            setSelectedExam(null);
            setSelectedQuestion(null);
            setSelectedAnswer(null);
          }
          alert('Xóa bài kiểm tra thành công!');
        } else {
          alert(result.message || 'Xóa bài kiểm tra thất bại');
        }
      } catch (err) {
        console.error('Delete exam error:', err);
        let errorMessage = 'Có lỗi xảy ra khi xóa bài kiểm tra';
        
        // Xử lý lỗi cụ thể
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`Lỗi: ${errorMessage}\n\nVui lòng thử lại sau hoặc liên hệ quản trị viên.`);
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?\n\nLưu ý: Tất cả đáp án sẽ bị xóa vĩnh viễn!')) {
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
          alert('Xóa câu hỏi thành công!');
        } else {
          alert(result.message || 'Xóa câu hỏi thất bại');
        }
      } catch (err) {
        console.error('Delete question error:', err);
        let errorMessage = 'Có lỗi xảy ra khi xóa câu hỏi';
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`Lỗi: ${errorMessage}\n\nVui lòng thử lại sau hoặc liên hệ quản trị viên.`);
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
          alert('Xóa đáp án thành công!');
        } else {
          alert(result.message || 'Xóa đáp án thất bại');
        }
      } catch (err) {
        console.error('Delete answer error:', err);
        let errorMessage = 'Có lỗi xảy ra khi xóa đáp án';
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`Lỗi: ${errorMessage}\n\nVui lòng thử lại sau hoặc liên hệ quản trị viên.`);
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


  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;

  const questions = currentExam?.questions || [];
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageQuestions = questions.slice(startIdx, startIdx + PAGE_SIZE);

  // Nếu đang làm bài thi, hiển thị giao diện làm bài
  if (started) {
    return (
      <div className="bg-white p-4 rounded-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="mb-1">{currentExam.type || `Bài thi ${currentExam.id}`}</h6>
            <small className="text-muted">Trang {page}/{totalPages}</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm" onClick={resetExam}>
              <i className="fas fa-times me-1"></i>Thoát
            </button>
            <div className="badge bg-danger fs-6">⏱ {minutes}:{seconds.toString().padStart(2,'0')}</div>
          </div>
        </div>
        {pageQuestions.map((q, i) => (
          <div className="mb-3" key={q.id}>
            <strong>Câu {startIdx + i + 1}. {q.content}</strong>
            <div className="mt-2">
              {[...(q.answerSet || q.answers || [])]
                .sort((a,b)=>{
                  const la = (a.label || a.optionLabel || '').toString();
                  const lb = (b.label || b.optionLabel || '').toString();
                  if (la && lb) return la.localeCompare(lb);
                  const oa = (a.order ?? a.sequence ?? a.ordinal ?? a.id) || 0;
                  const ob = (b.order ?? b.sequence ?? b.ordinal ?? b.id) || 0;
                  return oa - ob;
                })
                .map((a,idxOpt) => (
                <div className="form-check" key={a.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`q_${q.id}`}
                    id={`q${q.id}_a${a.id}`}
                    checked={answers[q.id] === a.id}
                    onChange={() => handleChoose(q.id, a.id)}
                  />
                  <label className="form-check-label" htmlFor={`q${q.id}_a${a.id}`}>
                    {String.fromCharCode(65 + idxOpt)}. {a.content}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-outline-secondary" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Trang trước</button>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Trang sau</button>
            <button className="btn btn-success" onClick={()=>handleSubmit(false)}>Nộp bài</button>
          </div>
        </div>
      </div>
    );
  }

  // Styles cho ExamManager
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
    }
  };

  return (
    <>
      {/* Header với tiêu đề và nút tạo bài kiểm tra (chỉ cho giáo viên) */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          <i className="fas fa-file-alt me-2"></i>
          {isTeacher ? 'Quản lý bài kiểm tra' : 'Bài kiểm tra'}
        </h3>
        {isTeacher && (
          <button 
            style={styles.btnPrimary}
            onClick={() => openExamForm()}
          >
            <i className="fas fa-plus"></i>
            Tạo bài kiểm tra
          </button>
        )}
      </div>

      {isTeacher ? (
        // Giao diện quản lý cho giáo viên
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
                      onClick={async () => {
                        setSelectedExam({ ...exam, questions: [] });
                        setSelectedQuestion(null);
                        try {
                          const res = await learningService.getExamQuestions(courseId, exam.id, 1, 5);
                          if (res.success) {
                            const questions = (res.data?.questions || []).map(q => ({
                              ...q,
                              answers: q.answers || q.answerSet || []
                            }));
                            setSelectedExam(prev => ({ ...(prev || exam), questions }));
                          }
                        } catch (e) {
                          console.error('Load questions error:', e);
                        }
                      }}
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
                <div style={styles.cardBody}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Mô tả:</strong> {selectedExam.description || 'Không có mô tả'}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Loại:</strong> {selectedExam.type} • <strong>Thời gian:</strong> {selectedExam.durationMinutes} phút
                  </div>
                  
                  {/* Danh sách câu hỏi */}
                  <h6>Câu hỏi ({selectedExam.questions?.length || 0})</h6>
                  {selectedExam.questions?.map(question => (
                    <div key={question.id} style={styles.questionItem}>
                      <div style={styles.questionContent}>
                        <div style={styles.questionText}>
                          <strong style={styles.questionTitle}>{question.content}</strong>
                          <div style={styles.questionMeta}>
                            Loại: {question.questionType} • Điểm: {question.points}
                          </div>
                          
                          {/* Danh sách đáp án */}
                          <div style={styles.answersList}>
                            {(question.answers || question.answerSet || []).map(answer => (
                              <div key={answer.id} style={styles.answerItem}>
                                <span style={answer.isTrue ? styles.answerCorrect : {}}>
                                  {answer.content}
                                </span>
                                <div style={styles.btnGroup}>
                                  <button 
                                    style={styles.btnOutline}
                                    onClick={() => { setSelectedQuestion(question); openAnswerForm(answer); }}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    style={styles.btnOutline}
                                    onClick={() => handleDeleteAnswer(answer.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button 
                              style={{
                                ...styles.btnOutline,
                                borderColor: '#0d6efd',
                                color: '#0d6efd',
                                marginTop: '8px'
                              }}
                              onClick={() => { setSelectedQuestion(question); openAnswerForm(); }}
                            >
                              <i className="fas fa-plus" style={{ marginRight: '4px' }}></i>
                              Thêm đáp án
                            </button>
                          </div>
                        </div>
                        
                        <div style={styles.btnGroup}>
                          <button 
                            style={styles.btnOutline}
                            onClick={() => openQuestionForm(question)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            style={styles.btnOutline}
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
      ) : (
        // Giao diện làm bài cho học viên
        <div className="bg-white p-4 rounded-3 shadow-sm">
          {exams.length === 0 ? (
            <p className="text-muted">Chưa có bài kiểm tra nào.</p>
          ) : (
            <div className="row g-3">
              {exams.map((exam) => (
                <div className="col-md-6 col-lg-4" key={exam.id}>
                  <div className="border rounded-3 p-3 h-100">
                    <h6 className="mb-2">{exam.type || `Bài thi ${exam.id}`}</h6>
                    <div className="mb-2">
                      <small className="text-muted">Thời gian: {exam.durationMinutes || 0} phút</small>
                    </div>
                    {exam.bestScore !== null && (
                      <div className="mb-3">
                        <span className="badge bg-success">
                          Điểm cao nhất: {exam.bestScore}/10
                        </span>
                      </div>
                    )}
                    <button 
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => startExam(exam.id)}
                    >
                      {exam.bestScore !== null ? 'Làm lại' : 'Bắt đầu làm bài'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Forms cho ExamManager */}
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

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,.5)'}}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="fas fa-paper-plane me-2"></i>Xác nhận nộp bài</h5>
                <button type="button" className="btn-close" onClick={()=>setShowConfirm(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể chỉnh sửa.
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={()=>setShowConfirm(false)}>Hủy</button>
                <button className="btn btn-success" onClick={()=>{ setShowConfirm(false); handleSubmit(true); }}>Nộp bài</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResult && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,.5)'}}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-success"><i className="fas fa-check-circle me-2"></i>Kết quả bài thi</h5>
                <button type="button" className="btn-close" onClick={()=>setShowResult(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body text-center">
                <div className="display-5 fw-bold text-success">{resultScore}</div>
                <div className="text-muted">Điểm trên thang 10</div>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button className="btn btn-primary" onClick={()=>setShowResult(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Exam;

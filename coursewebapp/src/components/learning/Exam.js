import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function Exam() {
  const { id } = useParams();
  const courseId = parseInt(id);
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

  if (loading) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">{error}</div>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;

  const questions = currentExam?.questions || [];
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageQuestions = questions.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <>
    <div className="content-wrapper py-5">
      <div className="container">
        <h3 className="mb-4"><i className="fas fa-pen-to-square me-2"></i>Bài kiểm tra</h3>

        {!started ? (
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
        ) : (
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
        )}
      </div>
    </div>
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



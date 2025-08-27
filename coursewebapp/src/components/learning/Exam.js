import React from 'react';

function Exam() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h3 className="mb-4"><i className="fas fa-pen-to-square me-2"></i>Bài kiểm tra</h3>
        <div className="bg-white p-4 rounded-3 shadow-sm">
          <div className="mb-3">
            <strong>Câu 1:</strong> React là gì?
            <div className="mt-2">
              {["Thư viện JS","Framework","Ngôn ngữ","Trình duyệt"].map((opt,idx)=> (
                <div className="form-check" key={idx}>
                  <input className="form-check-input" type="radio" name="q1" id={`q1_${idx}`} />
                  <label className="form-check-label" htmlFor={`q1_${idx}`}>{opt}</label>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary">Nộp bài</button>
        </div>
      </div>
    </div>
  );
}

export default Exam;



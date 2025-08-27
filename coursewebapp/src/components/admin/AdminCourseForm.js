import React from 'react';

function AdminCourseForm() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h1 className="text-center text-info mt-2">QUẢN LÝ KHÓA HỌC</h1>
        <form>
          <div className="form-floating mb-3 mt-3">
            <input type="text" className="form-control" id="title" placeholder="Tên sản phẩm" />
            <label htmlFor="title">Tên sản phẩm</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input type="text" className="form-control" id="price" />
            <label htmlFor="price">Gía sản phẩm</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <select className="form-select" id="category">
              <option>Lap trinh</option>
              <option>Thiet ke</option>
            </select>
            <label htmlFor="category" className="form-label">Danh mục</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input type="file" className="form-control" id="image" />
            <label htmlFor="image">Ảnh sản phẩm</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <button className="btn btn-success" type="button">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCourseForm;



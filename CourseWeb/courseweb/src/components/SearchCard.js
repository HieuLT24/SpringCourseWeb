import React, { useState } from 'react';

const SearchCard = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    fromPrice: '',
    toPrice: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="search-card mb-5">
      <h4 className="mb-4">
        <i className="fas fa-search me-2"></i>Tìm kiếm khóa học
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-4 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên khóa học..."
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-3 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Từ giá"
              name="fromPrice"
              value={searchData.fromPrice}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-3 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Đến giá"
              name="toPrice"
              value={searchData.toPrice}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-2 mb-3">
            <button type="submit" className="btn btn-primary w-100 btn-modern">
              <i className="fas fa-search me-1"></i>Tìm kiếm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchCard;

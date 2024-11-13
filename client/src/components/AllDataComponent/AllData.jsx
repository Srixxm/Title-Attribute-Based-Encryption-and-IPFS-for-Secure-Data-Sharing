import { BrowserRouter as Router , Route , Routes, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './AllData.css';

const AllData = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

 
  const totalPages = Math.ceil(data.length / itemsPerPage);


  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='app'>
      <h3 className='head'>Company Name and Churn Status</h3>
      <ul className='card-container'>
        {currentData.map((item, index) => (
          <li className='card' key={index}>
            <Link to={`/company/${item.Company_Details.CompanyName}`}><strong className='name'>{item.Company_Details.CompanyName}</strong> </Link>
            <div className='churn-status'>Churn Status: {item.ChurnStatus ? 'Churned' : 'Active'}</div>
            
          </li>
        ))}
      </ul>

     
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllData;

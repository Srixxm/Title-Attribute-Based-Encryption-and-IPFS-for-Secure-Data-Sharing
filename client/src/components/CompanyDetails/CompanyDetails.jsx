import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Company.css'

const CompanyDetails = () => {
  const { companyName } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/company/${companyName}`)
      .then(response => response.json())
      .then(data => setCompany(data))
      .catch(error => console.error('Error fetching company details:', error));
  }, [companyName]);

  if (!company) return <p>Loading company details...</p>;


  return (
    <div className='App'>
      <h2>{company.Company_Details.CompanyName} Details</h2>
      <p><strong>Contract Length:</strong> {company.Company_Details.ContractLength}</p>
      <p><strong>Months Since Signup:</strong> {company.Company_Details.MonthsSinceSignup}</p>
      <p><strong>Total Transactions:</strong> {company.Company_Details.TotalTransactions}</p>
      <p><strong>Average Transaction Value:</strong> {company.Company_Details.AvgTransactionValue}</p>
      <p><strong>Total Revenue:</strong> {company.Company_Details.TotalRevenue}</p>
      <p><strong>Product Usage Frequency:</strong> {company.Company_Details.ProductUsageFrequency}</p>
      <p><strong>Support Tickets Opened:</strong> {company.Company_Details.SupportTicketsOpened}</p>
      <p><strong>Support Ticket Resolution Time:</strong> {company.Company_Details.SupportTicketResolutionTime}</p>
      <p><strong>Email Open Rate:</strong> {company.Company_Details.EmailOpenRate}</p>
      <p><strong>Account Manager Calls:</strong> {company.Company_Details.AccountManagerCalls}</p>
      <p><strong>Churn Status:</strong>{ company.ChurnStatus }</p>
    </div>
  );
};

export default CompanyDetails;

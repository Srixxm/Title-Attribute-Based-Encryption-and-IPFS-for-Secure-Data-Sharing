import React, { useState } from 'react';
import './Predict.css'

function PredictComponent() {
  const [formData, setFormData] = useState({
    CompanyName: '',
    ContractLength: '',
    MonthsSinceSignup: '',
    TotalTransactions: '',
    AvgTransactionValue: '',
    TotalRevenue: '',
    ProductUsageFrequency: '', 
    SupportTicketsOpened: '',
    SupportTicketResolutionTime: '',
    EmailOpenRate: '',
    AccountManagerCalls: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();   

    setIsLoading(true); 

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);   
 
      } else {
        console.error('Error making prediction:', response.statusText);
        setPrediction('Error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      setPrediction('Error occurred. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className='app'>
      <h2>Churn Prediction</h2>
      <form onSubmit={handleSubmit}>
      <label className='cName'>
          Company Name:
          <input 
            type="text" 
            name="CompanyName" 
            className='cNameInput'
            value={formData.CompanyName} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label className='cLen'>
          Contract Length (months):
          <input 
            type="number" 
            name="ContractLength" 
            className='cLenInput'
            value={formData.ContractLength} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='mss'>
          Months Since Signup:
          <input 
            type="number" 
            name="MonthsSinceSignup" 
            className='mssInput'
            value={formData.MonthsSinceSignup} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='totalT'>
          Total Transactions:
          <input 
            type="number" 
            name="TotalTransactions" 
            className='totalTinput'
            value={formData.TotalTransactions} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='AvgTransaction'>
          Average Transaction Value:
          <input 
            type="number" 
            name="AvgTransactionValue" 
            className='AvgTran'
            value={formData.AvgTransactionValue} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='revenue'>
          Total Revenue:
          <input 
            type="number" 
            name="TotalRevenue" 
            className='rev'
            value={formData.TotalRevenue} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='usage'>
          Product Usage Frequency:
          <select 
            name="ProductUsageFrequency" 
            className='usageInput'
            value={formData.ProductUsageFrequency} 
            onChange={handleChange} 
            required
          >
            <option value="">Select</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option> 
          </select>
        </label>
        <label className='support'> 
          Support Tickets Opened:
          <input 
            type="number" 
            name="SupportTicketsOpened" 
            className='sto'
            value={formData.SupportTicketsOpened} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='strt'>
          Support Ticket Resolution Time (hours):
          <input 
            type="number" 
            name="SupportTicketResolutionTime" 
            className='strti'
            value={formData.SupportTicketResolutionTime} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label className='eor'>
          Email Open Rate (e.g., 0.75 for 75%):
          <input 
            type="number" 
            name="EmailOpenRate" 
            className='eori'
            value={formData.EmailOpenRate} 
            onChange={handleChange} 
            required 
            step="0.01" 
            min="0" 
            max="1" 
          />
        </label>

        <label className='amc'>
          Account Manager Calls:
          <input 
            type="number" 
            name="AccountManagerCalls" 
            className='amci'
            value={formData.AccountManagerCalls} 
            onChange={handleChange} 
            required 
          />
        </label>

        <button type="submit" disabled={isLoading} className='submit'>
          {isLoading ? 'Predicting...' : 'Predict Churn'}
        </button>
      </form>


      {prediction && (
        <div>
          <h3 className='hres'>Prediction Result:</h3>
          <p className='res'>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default PredictComponent;
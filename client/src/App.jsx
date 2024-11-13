import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PredictComponent from './components/PredictComponent/PredictComponent';
import CustomerSegment from './components/SegmentComponent/SegmentCoponent';
import AllData from './components/AllDataComponent/AllData';
import CompanyDetails from './components/CompanyDetails/CompanyDetails';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container'>
      <Router>
      <div className='router-links'>
        <Link to = '/cluster'>Customer Segment</Link>
        <Link to = '/'>B2B CHRUN DASHBOARD</Link>
        <Link to = '/predict'> Churn Prediction </Link>
        
      </div>
        <Routes>
          <Route path ='/cluster' element={<CustomerSegment />} />
          <Route path = '/predict' element = {<PredictComponent />} />
          <Route path = '/' element={<AllData />}/>
          <Route path="/company/:companyName" element={<CompanyDetails />} />
        </Routes>
      
        
      </Router>
      </div>
    
  )
}

export default App

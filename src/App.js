import './App.css';
import {FlightBody, IndividualFlight} from './FlightBody';
import Header from './Header';
import FindFlights from './FindFlights';
import FlightDetails from './FlightDetails';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <div className='App-container'>
        <div className='App'>
          <Header />

          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path='/home' element={<FlightBody />}/>
            <Route path='/find' element={<FindFlights />}/>
            <Route path='/flights/:flightId' element={<FlightDetails />}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


export default App;

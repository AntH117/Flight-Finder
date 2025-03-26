import React from 'react';
import './FindFlights.css';
import {Link, Navigate } from 'react-router-dom';
import { IndividualFlight } from './FlightBody';


export default function FindFlights() {

  const [flightData, setFlightData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [detailedAirportData, setDetailedAirportData] = React.useState([])
  const [airports, setAirports] = React.useState([])
  const [airportData, setAirportData] = React.useState([])
  const [smallDisplay, setSmallDisplay] = React.useState(true) //need to implement logic for small display
  const [airportCode, setAirportCode] = React.useState('')

  // const endpoint = `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}`;
  const api = 'f3d9278695439fb25dd9852219f8862e'

  const fetchFlights = async () => {
      const endpoint = '/data/flights_data.json'
      try {
          const response = await fetch(endpoint)
          const data = await response.json();
          setFlightData(data)
      } catch (error) {
          console.log('Error fetching data', error)
      } finally {
          setLoading(false)
      }
  }
  const fetchAirports = async () => {
    const endpoint = '/data/australian_airports.json'
    try {
        const response = await fetch(endpoint)
        const data = await response.json();
        setAirportData(data.Sheet1)
    } catch (error) {
        console.log('Error fetching data', error)
    } 
}

  React.useEffect(() => {
        fetchFlights()
        fetchAirports()
  },[])
  React.useEffect(() => {
      if (flightData) {
          const airports = new Set();
          const detailedAirports = new Set();
          airportData.forEach(airport => {
              airports.add(airport.name);
              detailedAirports.add([airport.name, airport.iso_region])
          });
          const airportSuggestions = Array.from(airports);
          setDetailedAirportData(Array.from(detailedAirports))
          setAirports(airportSuggestions)
      }
  },[airportData])
    const [formData, setFormData] = React.useState({
        from: '',
        to: '',
        dateFrom: '',
        dateTo: ''
      });
    const [previousRef, setPreviousRef] = React.useState(null)
    const [focus, setFocus] = React.useState(false)
    const fromInputRef = React.useRef(null);
    const toInputRef = React.useRef(null);
    const refs = {'to' : toInputRef, 'from': fromInputRef}

    React.useEffect(() => {
        if (focus && refs[previousRef]) {
            refs[previousRef].current?.focus()
        }
    })


      const handleChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }, []);

      const handleTextChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        setPreviousRef(name)
        setFocus(true)
      }, []);


      const InputField = ({ value, name, onChange, inputRef, placeholder }) => {
        return (
          <input
            className='destination-input'
            type="text"
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={onChange}
            ref={inputRef}
          />
        );
      };

      const DestinationPicker = React.memo(({ location , children }) => {

        return (
          <div className="destination-picker-body">
            <div className='destination-overlay'onClick={() => {refs[location.toLowerCase()].current?.focus(); setFocus(true); setPreviousRef(location.toLowerCase())}}>
            </div>
              {(errors && !submit[location.toLowerCase()]) && <div className='destination-error'>
                  Airport not found
              </div>}
            <div className="destination-picker-text">
              <p>{location}</p>
            </div>
            <div className="destination-picker-input">
              {children} 
              <AirportList direction={location.toLowerCase()}/>
            </div>
            <div className="destination-pin">
              <i className="fa fa-plane"></i>
            </div>
          </div>
        );
      });

      
    function AirportList({direction, setShow}) {
      const [sortedAirports, setSortedAirports] = React.useState([])
      function airportSort() {
        if (formData[direction] == '') {
          setSortedAirports(detailedAirportData)
        } else {
          const filtered = detailedAirportData.filter(term => term[0].toLowerCase().includes(formData[direction].toLowerCase()))
          setSortedAirports(filtered)
        }
      }
      React.useEffect(() => {
        airportSort()
      }, [formData])
      return (
        (focus && previousRef === direction) && (
          <div className='airport-picker-body'>
            {sortedAirports.length > 0 ? (
              sortedAirports.map((x) => (
                <div
                  key={x[0]} 
                  className='airport-picker'
                  onClick={() => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      [direction]: x[0],
                    }));
                    setFocus(false);
                  }}
                >
                  <p>{x[0]}{x[1] !== null && ` (${x[1]})`}</p>
                </div>
              ))
            ) : (
              <div className='not-found'>Not Found</div>
            )}
          </div>
        )
      )};
      
    function DatePicker() {
      const fromDateRef = React.useRef(null)
      const fromCalendarRef = React.useRef(null)

      const toDateRef = React.useRef(null)
      const toCalendarRef = React.useRef(null)

      React.useEffect(() => {
        const handleFromCalendarClick = () => {
          if (fromDateRef.current) {
            fromDateRef.current.showPicker();
          }
        };
    
        const handleToCalendarClick = () => {
          if (toDateRef.current) {
            toDateRef.current.showPicker();
          }
        };
    
        const fromCal = fromCalendarRef.current;
        const toCal = toCalendarRef.current;
    
        if (fromCal) {
          fromCal.addEventListener('click', handleFromCalendarClick);
        }
    
        if (toCal) {
          toCal.addEventListener('click', handleToCalendarClick);
        }
    
        return () => {
          if (fromCal) {
            fromCal.removeEventListener('click', handleFromCalendarClick);
          }
    
          if (toCal) {
            toCal.removeEventListener('click', handleToCalendarClick);
          }
        };
      }, []);
        return <div className='date-picker-body'>
          {(errors && !submit.dateTo) && <div className='date-picker-error'>
                Departure date must be before arrival
            </div>}
          <div className='date-picker' ref={fromCalendarRef} style={{borderRight: '1px solid rgba(0, 0, 0, 0.397)'}}>
            <div className='date-picker-title'>
                From
            </div>
            <input type='date' ref={fromDateRef} id='fromDate' name='dateFrom' value={formData.dateFrom} onChange={handleChange}></input>
            <div className='date-display'>
              {formData.dateFrom}
            </div>
          </div>
          <div className='date-picker'ref={toCalendarRef}>
          <div className='date-picker-title'>
                To
            </div>
            <input type='date' ref={toDateRef} name='dateTo' value={formData.dateTo} onChange={handleChange}></input>
            <div className='date-display'>
              {formData.dateTo}
            </div>
          </div>
        </div>
    }

    const memoFromInput = React.useMemo(() => {
      return (
        <InputField value={formData.from} name={'from'} onChange={handleTextChange} inputRef={fromInputRef} placeholder={'Melbourne (Tullamarine)'}/>
      )
    }, [formData.from])

    
    const memoToInput = React.useMemo(() => {
      return (
        <InputField value={formData.to} name={'to'} onChange={handleTextChange} inputRef={toInputRef}  placeholder={'Sydney - SYD'}/>
      )
    }, [formData.to])

    
    const [submit, setSubmit] = React.useState({
      from: false,
      to: false,
      dateFrom: false,
      dateTo: false
    })
    const [errors, setErrors] = React.useState(false)
    const fromDate = new Date(formData.dateFrom);
    const toDate = new Date(formData.dateTo);
    const [filteredFlights, setFilteredFlights] = React.useState(flightData?.data)

    const handleSubmit = (e) => {
      e.preventDefault(); 
      let tempSubmit = {
        from: airports.includes(formData.from),
        to: airports.includes(formData.to),
        dateFrom: fromDate < toDate,
        dateTo: fromDate < toDate,
      }
      const isFormValid = Object.values(tempSubmit).every(Boolean);
      if (isFormValid) {
        setErrors(false)
        filterFlights()
      } else {
        setErrors(true)
        setSubmit(tempSubmit)
      }
    };


async function fetchNewFlights({departureAirport, arrivalAirport}) {
const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${departureAirport}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "c793a37dd5msh739576c5b2c6eadp161d43jsn64f22ed08077",
    "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
  },
};
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Filter the flights going to the desired arrival airport
    const filteredFlights = data.departures.filter(
      (flight) => flight.arrival.airport.iata === arrivalAirport
    );

    setFilteredFlights(filteredFlights)
  } catch (error) {
    console.error("Error fetching flights:", error);
  }
}

function filterFlights() {
  const departureIata = airportData.find((airport) => airport.name === formData.from).iata_code
  const arrivalIata = airportData.find((airport) => airport.name === formData.to).iata_code
  setAirportCode(departureIata)
  // const departureIata = 'MEL'
  // const arrivalIata = 'SYD'
  fetchNewFlights({departureAirport: departureIata, arrivalAirport: arrivalIata});
}


    return <div className='find-flights-body'>
        <div className='search-params-body'>
            <form onSubmit={handleSubmit} className='search-params-form'>
                <DestinationPicker location={'From'}>
                    {memoFromInput}
                </DestinationPicker>
                <DestinationPicker location={'To'}>
                     {memoToInput}
                </DestinationPicker>
                <DatePicker />
                <button className='search-submit-button'>
                  Search Flights
                </button> 
            </form>
        </div>
        <div className='find-flights-result'>
          {(filteredFlights) && filteredFlights.map((x) => {
            return <IndividualFlight data={x} smallDisplay={smallDisplay} airportCode={airportCode}/>
          })}
        </div>
    </div>
}
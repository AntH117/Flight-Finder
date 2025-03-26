import React from 'react';
import './FlightBody.css';

export function IndividualFlight({data, smallDisplay, airportCode}) {
    const extractTime = (scheduled) => {
        if (!scheduled) return 'Unknown';
        const date = new Date(scheduled);
        
        // Extracting time in UTC (hours and minutes)
        const hours = date.getUTCHours().toString().padStart(2, '0');  // Always 2 digits
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');  // Always 2 digits
        
        return `${hours}:${minutes}`;
      };
    
    const [expand, setExpand] = React.useState(false)
    return <div className='individual-flight-body' style={expand ? {height: '152px', borderBottom: '1px solid black'} : {height: '51px'}}>
        <div className='individual-flight-header' onClick={() => setExpand((preval) => !preval)}>
            <div className='IF-num'>
                <h3>{data.number ? data.number : 'N/A'}</h3>
            </div>
            <div className='IF-dep-ariv'>
                <h3>{airportCode}</h3>
                <h1>&#8640;</h1>
                <h3>{data.arrival.airport.iata ? data.arrival.airport.iata : data.arrival.airport.name }</h3>
            </div>
            <div className='IF-date'>
                {data.departure.scheduledTime.local.split(' ')[0]}
            </div>
            <div className='IF-time'>
                {extractTime(data.departure.scheduledTime.local)}
            </div>
        {!smallDisplay && <div className='IF-status'>
                <h3>
                    {data.status}
                </h3>
            </div>}
        </div>
        {<div className='Individual-flight-details'>
            <div className='IF-flight-info'>
                <div className='IF-info'>
                    <h5>Dep Airport</h5>
                    <p>{}</p>
                </div>
                <div className='IF-info'>
                    <h5>Arrival Airport</h5>
                    <p>{data.arrival.airport.name}</p>
                </div>
                <div className='IF-info'>
                    <h5>Est Departure</h5>
                    <p>{extractTime(data.departure.scheduledTime.local)}</p>
                </div>
                <div className='IF-info'>
                    <h5>Airline</h5>
                    <p>{data.airline.name}</p>
                </div>
            </div>
            <div className='IF-flight-info'>
                <div className='IF-info'>
                    <h5>Dep Terminal</h5>
                    <p>{}</p>
                </div>
                <div className='IF-info'>
                    <h5>Arrival Terminal</h5>
                    <p>{}</p>
                </div>
                <div className='IF-info'>
                    <h5>Est Arrival</h5>
                    <p>{}</p>
                </div>
                <div className='IF-info'>
                    <h5>Flight Status</h5>
                    <p>{data.status}</p>
                </div>
            </div>
        </div>}
    </div>
}

export function FlightBody() {
    const [flightData, setFlightData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const divRef = React.useRef();
    const [smallDisplay, setSmallDisplay] = React.useState(false)
    const [airportCode, setAirportCode] = React.useState('SYD')

    const fetchFlights = async () => {
        const date = '2025-03-25';
        
        const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${airportCode}/${date}T00:00/${date}T11:59?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;
        
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'c793a37dd5msh739576c5b2c6eadp161d43jsn64f22ed08077',
            'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
          }
        };
      
        try {
          const response = await fetch(url, options);
          const result = await response.json();
          const first100Departures = result.departures.slice(0, 100);
          setFlightData(first100Departures)
        } catch (error) {
          console.error(error);
        } finally {
              setLoading(false)
          }
    }
    React.useEffect(() => {
      fetchFlights()
    },[])

    React.useEffect(() => {
        setSmallDisplay(document.getElementById('flightBody').getBoundingClientRect().width >= 500 ? false : true)
    }, [])
    React.useEffect(() => {
        const handleResize = () => {
          if (divRef.current) {
            const width = divRef.current.getBoundingClientRect().width;
            setSmallDisplay((prevSmallDisplay) => {
                if (width < 500 && !prevSmallDisplay) {
                  return true;
                } else if (width >= 500 && prevSmallDisplay) {
                  return false;
                }
                return prevSmallDisplay;
              });
            }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    

   return  <>
   <h1>Most Recent 100 Flights</h1>
   <div className='flight-body' id='flightBody' ref={divRef}>
        {loading && <h1>Loading...</h1>}
        {!loading && <div className='flight-info'>
            {flightData.map((data) => {
                return <IndividualFlight data={data} smallDisplay={smallDisplay} airportCode={airportCode}/>
            })}
        </div>}
        <button className='refresh-button' onClick={() => {
                    setLoading(true)
                   setTimeout(() => {
                    fetchFlights()
                }, 2000);
        }}>&#8634;</button>
   </div> 
   </>
}
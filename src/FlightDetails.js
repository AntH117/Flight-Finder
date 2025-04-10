import React from 'react';
import './FlightDetails.css';
import { useParams } from "react-router-dom";

export default function FlightDetails() { 
    const [flightData, setFlightData] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    const { flightId } = useParams()
    const [flightCode, date, time] = flightId.split('_')
    
        const fetchFlights = async () => {
            const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightCode}/${date}?withAircraftImage=false&withLocation=false&dateLocalRole=Both`;
            
            const options = {
              method: 'GET',
              headers: {
                'x-rapidapi-key': '55058e19cdmsh037716a732c6fd0p13bae8jsn62cd3af04374',
                'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
              }
            };
          
            try {
              const response = await fetch(url, options);
              const result = await response.json();
              const filtered = result.filter(flight => flight.departure.scheduledTime.local.split(' ')[1] == time)[0]
              console.log('fetched data')
              setFlightData(filtered)
            } catch (error) {
              console.error(error);
            } finally {
                  setLoading(false)
              }
        }
        React.useEffect(() => {
          fetchFlights()
        },[])

        function FlightInfoDiv({header, info}) {

            return <div className='flight-info-div'>
                <h3>
                    {header}
                </h3>
                <p>
                    {info}
                </p>
            </div>
        }

        function timeToLocal(data) {
            if (data) {
                let [date, time] = data.split(' ')
                const adjustedTime = time.split('+')[0]
                
                return `${date} ${adjustedTime}`
            }
        }

        function timeDifference({departure, arrival}) {
            const date1 = new Date(departure.replace(" ", "T")); // ISO format
            const date2 = new Date(arrival.replace(" ", "T"));

            const diffMs = Math.abs(date1 - date2);
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;
            
            return `${hours}h ${minutes}m`

        }
    return <div className='flight-details-body'>
        {loading && <h1>Loading...</h1>}
        {!loading && <div className='flight-details'>
            <div className='flight-details-title'>
                {flightData.number}
            </div>
            <div className='flight-details-info'>
                <FlightInfoDiv header={'Departure Airport'} info={flightData.departure?.airport?.name ?? 'N/A'}/>
                <FlightInfoDiv header={'Arrival Airport'} info={flightData.arrival?.airport?.name ?? 'N/A'}/>
                <FlightInfoDiv header={'Departure Time'} info={timeToLocal(flightData.departure?.scheduledTime?.local)  ?? 'N/A'}/>
                <FlightInfoDiv header={'Arrival Time'} info={timeToLocal(flightData.arrival?.scheduledTime?.local)  ?? 'N/A'}/>
                <FlightInfoDiv header={'Flight Length'} info={timeDifference({departure: flightData.departure?.scheduledTime?.utc, arrival: flightData.arrival?.scheduledTime?.utc})  ?? 'N/A'}/>
                <FlightInfoDiv header={'Status'} info={flightData?.status  ?? 'N/A'}/>
                <FlightInfoDiv header={'Departure Terminal'} info={flightData.departure?.terminal  ?? 'N/A'}/>
                <FlightInfoDiv header={'Arrival Terminal'} info={flightData.arrival?.terminal  ?? 'N/A'}/>
                <FlightInfoDiv header={'Airline'} info={flightData.airline?.name  ?? 'N/A'}/>
                <FlightInfoDiv header={'Aircraft'} info={flightData.aircraft?.model  ?? 'N/A'}/>
            </div>
        </div>}
    </div>
    
}
import React from 'react';
import './FlightDetails.css';
import { useParams } from "react-router-dom";

export default function FlightDetails() { 
    require('dotenv').config()
    const [flightData, setFlightData] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    const { flightId } = useParams()
    const [flightCode, date, time] = flightId.split('_')
    const [importantFlightData, setImportantFlightData] = React.useState({
        'Departure Airport': null,
        'Arrival Airport': null,
        'Scheduled Departure': null,
        'Scheduled Arrival': null,
        'Actual Departure': null,
        'Actual Arrival': null,
        'Flight Length': null,
        'Actual Flight Length': null,
        'Status': null,
        'Departure Terminal': null,
        'Arrival Terminal': null,
        'Airline': null,
        'Aircraft': null,
    })

    function timeToLocal(data) {
        if (data) {
            let [date, time] = data.split(' ')
            const adjustedTime = time.split('+')[0]
            
            return `${date} ${adjustedTime}`
        }
    }

    function timeDifference({departure, arrival}) {
        if (departure && arrival) {
            const date1 = new Date(departure.replace(" ", "T")); // ISO format
            const date2 = new Date(arrival.replace(" ", "T"));

            const diffMs = Math.abs(date1 - date2);
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;
            
            return `${hours}h ${minutes}m`
        }

    }
    React.useEffect(()=> {
        setImportantFlightData({
            'Departure Airport': flightData.departure?.airport?.name ?? 'N/A',
            'Arrival Airport': flightData.arrival?.airport?.name ?? 'N/A',
            'Scheduled Departure': timeToLocal(flightData.departure?.scheduledTime?.local)  ?? 'N/A',
            'Scheduled Arrival': timeToLocal(flightData.arrival?.scheduledTime?.local)  ?? 'N/A',
            'Actual Departure': timeToLocal(flightData.departure?.revisedTime?.local)  ?? null,
            'Actual Arrival': timeToLocal(flightData.arrival?.revisedTime?.local)  ?? null,
            'Flight Length': timeDifference({departure: flightData.departure?.scheduledTime?.utc, arrival: flightData.arrival?.scheduledTime?.utc})  ?? 'N/A',
            'Actual Flight Length': timeDifference({departure: flightData.departure?.revisedTime?.utc, arrival: flightData.arrival?.revisedTime?.utc})  ?? null,
            'Status': flightData?.status  ?? 'N/A',
            'Departure Terminal': flightData.departure?.terminal  ?? 'N/A',
            'Arrival Terminal': flightData.arrival?.terminal  ?? 'N/A',
            'Airline': flightData.airline?.name  ?? 'N/A',
            'Aircraft': flightData.aircraft?.model  ?? 'N/A',
        })
    }, [flightData])
    
        const fetchFlights = async () => {
            const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightCode}/${date}?withAircraftImage=false&withLocation=false&dateLocalRole=Both`;
            
            const options = {
              method: 'GET',
              headers: {
                'x-rapidapi-key': `${process.env.API_KEY}`,
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

        function isFlightLate({scheduled, actual}) {
            const date1 = new Date(scheduled)
            const date2 = new Date(actual)

            return date1 < date2
        }

        function flightInMin(time) {
            const matches = time.match(/(\d+)h\s*(\d+)m/);
            if (!matches) return 0;
          
            const hours = parseInt(matches[1], 10);
            const minutes = parseInt(matches[2], 10);
          
            return hours * 60 + minutes;
        }
        
        function FlightInfoDiv({header, info}) {
            let style = {}
            if (header == 'Actual Departure') {
                if (importantFlightData['Status'] !== 'Expected') {
                    style = isFlightLate({scheduled: importantFlightData['Scheduled Departure'], actual: importantFlightData['Actual Departure']})              
                    ? { color: 'Red' } 
                    : { color: 'Green' };
                } else {
                    return null
                }
            } else if (header == 'Actual Arrival') {
                if (importantFlightData['Status'] == 'Arrived') {
                    style = isFlightLate({scheduled: importantFlightData['Scheduled Arrival'], actual: importantFlightData['Actual Arrival']}) 
                    ? { color: 'Red' } 
                    : { color: 'Green' };
                } else {
                    return null
                }
            } else if (header == 'Actual Flight Length') {
                if (importantFlightData['Status'] == 'Arrived') {
                    style = flightInMin(importantFlightData['Flight Length']) < flightInMin(importantFlightData['Actual Flight Length'])
                    ? { color: 'Red' } 
                    : { color: 'Green' };
                } else {
                    return null
                }
            }
            return <div className='flight-info-div'>
                <h3>
                    {header}
                </h3>
                <p style={style}>
                    {info}
                </p>
            </div>
        }
        
    return <div className='flight-details-body'>
        {loading && <h1>Loading...</h1>}
        {!loading && <div className='flight-details'>
            <div className='flight-details-title'>
                {flightData.number}
            </div>
            <div className='flight-details-info'>
                {Object.keys(importantFlightData).map(key => (
                    importantFlightData[key] && <FlightInfoDiv key={key} header={key} info={importantFlightData[key]} />
                ))}
            </div>
        </div>}
    </div>
    
}
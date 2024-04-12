import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = ({ user }) => {
    const [rsoName, setRsoName] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventCategory, setEventCategory] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocationId, setEventLocationId] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [events, setEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [rsos, setRsos] = useState([]); // State for storing RSOs

    // Fetch events and locations from the server on component mount
    useEffect(() => {
        fetchEvents();
        fetchLocations();
        fetchRsos();
    }, []);

    // Function to fetch RSOs from the server
    const fetchRsos = () => {
        axios.get('http://localhost:8081/rso')
            .then(response => {
                setRsos(response.data);
            })
            .catch(error => {
                console.error('Error fetching RSOs:', error);
            });
    };


    // Function to fetch events from the server
    const fetchEvents = () => {
        axios.get('http://localhost:8081/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    };

    // Function to fetch locations from the server
    const fetchLocations = () => {
        axios.get('http://localhost:8081/locations')
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    };

    // Function to handle RSO creation
    const handleCreateRso = () => {
        axios.post('http://localhost:8081/rso', { name: rsoName, admin_id: user.UID, university_id: 1 })
            .then(response => {
                console.log('RSO created successfully:', response.data);
                alert('RSO created successfully');
                setRsoName('');
            })
            .catch(error => {
                console.error('Error creating RSO:', error);
                alert('Error creating RSO');
            });
    };

    // Function to handle RSO deletion
    const handleDeleteRso = (rsoId) => {
        axios.delete(`http://localhost:8081/rso/${rsoId}`)
            .then(response => {
                console.log('RSO deleted successfully:', response.data);
                alert('RSO deleted successfully');
                fetchRsos();
            })
            .catch(error => {
                console.error('Error deleting RSO:', error);
                alert('Error deleting RSO');
            });
    };

    // Function to handle event creation
    const handleCreateEvent = () => {
        axios.post('http://localhost:8081/events', {
            event_name: eventName,
            event_category: eventCategory,
            description: eventDescription,
            time: eventTime,
            date: eventDate,
            location_id: eventLocationId,
            contact_phone: contactPhone,
            contact_email: contactEmail,
            is_approved: 1,
            is_private: 0,
            is_rso_event: 0,
        })
            .then(response => {
                console.log('Event created successfully:', response.data);
                alert('Event created successfully');
                setEventName('');
                setEventCategory('');
                setEventDescription('');
                setEventTime('');
                setEventDate('');
                setEventLocationId('');
                setContactPhone('');
                setContactEmail('');
            })
            .catch(error => {
                console.error('Error creating event:', error);
                alert('Error creating event');
            });
    };

    // Function to handle event deletion
    const handleDeleteEvent = (eventId) => {
        axios.delete(`http://localhost:8081/events/${eventId}`)
            .then(response => {
                console.log('Event deleted successfully:', response.data);
                alert('Event deleted successfully');
                fetchEvents(); // Refresh events after deletion
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                alert('Error deleting event');
            });
    };

    return (
        <div>
            <h2>Create RSO</h2>
            <input type="text" value={rsoName} onChange={(e) => setRsoName(e.target.value)} />
            <button onClick={handleCreateRso}>Create RSO</button>

            <h2>Create Event</h2>
            <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <input type="text" placeholder="Event Category: social/fundraising/tech_talks/other" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} />
            <input type="text" placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            <input type="datetime-local" placeholder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
            <input type="date" placeholder="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            <input type="text" placeholder="Location ID" value={eventLocationId} onChange={(e) => setEventLocationId(e.target.value)} />
            <input type="text" placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            <input type="text" placeholder="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <button onClick={handleCreateEvent}>Create Event</button>

            <h2>Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event.event_id}>
                        {event.event_name} - {event.event_category}
                        <button onClick={() => handleDeleteEvent(event.event_id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>RSOs</h2>
            <ul>
                {/* Display list of RSOs */}
                {rsos.map(rso => (
                    <li key={rso.rso_id}>{rso.name}
                        <button onClick={() => handleDeleteRso(rso.rso_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;

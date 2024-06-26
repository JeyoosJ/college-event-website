import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Admin.css';

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
    const [rsos, setRsos] = useState([]);

    useEffect(() => {
        fetchEvents();
        fetchRsos();
    });

    const fetchRsos = () => {
        axios.get('http://localhost:8081/rso')
            .then(response => {
                setRsos(response.data);
            })
            .catch(error => {
                console.error('Error fetching RSOs:', error);
            });
    };

    const fetchEvents = () => {
        axios.get('http://localhost:8081/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    };

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

    const handleDeleteEvent = (eventId) => {
        axios.delete(`http://localhost:8081/events/${eventId}`)
            .then(response => {
                console.log('Event deleted successfully:', response.data);
                alert('Event deleted successfully');
                fetchEvents();
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                alert('Error deleting event');
            });
    };

    return (
        <div className="container">
            <div className="title">
                Admin Dashboard
            </div>
            <div className="container-item">
                <div className="item">
                    <div className="create">
                        <h2>Create RSO</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="RSO Name" value={rsoName} onChange={(e) => setRsoName(e.target.value)} />
                            <button className="btn btn-primary" onClick={handleCreateRso}>Create RSO</button>
                        </div>
                    </div>

                    <div className="create">
                        <h2>Create Event</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Event Category: social/fundraising/tech_talks/other" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                            <input type="datetime-local" className="form-control" placeholder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                            <input type="date" className="form-control" placeholder="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Location ID" value={eventLocationId} onChange={(e) => setEventLocationId(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                            <button className="btn btn-primary" onClick={handleCreateEvent}>Create Event</button>
                        </div>
                    </div>
                </div>

                <div className="item">
                    <h2>Events</h2>
                    <ul className="list-group">
                        {events.map(event => (
                            <li key={event.event_id} className="list-group-item">
                                {event.event_name} - {event.event_category}
                                <button className="btn btn-danger" onClick={() => handleDeleteEvent(event.event_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="item">
                    <h2>RSOs</h2>
                    <ul className="list-group">
                        {rsos.map(rso => (
                            <li key={rso.rso_id} className="list-group-item">{rso.name}
                                <button className="btn btn-danger" onClick={() => handleDeleteRso(rso.rso_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Admin;

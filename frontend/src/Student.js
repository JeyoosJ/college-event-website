import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentComponent = ({ user }) => {
    const [rsoList, setRsoList] = useState([]);
    const [selectedRSO, setSelectedRSO] = useState(null);
    const [eventsList, setEventsList] = useState([]);
    const [comment, setComment] = useState('');

    console.log(user);

    useEffect(() => {
        // Fetch list of RSOS
        axios.get('http://localhost:8081/rso')
            .then(response => {
                setRsoList(response.data);
            })
            .catch(error => console.error('Error fetching RSOs:', error));
    }, []);

    const handleRSOSelection = (rsoId) => {
        setSelectedRSO(rsoId);
        // Fetch events for selected RSO
        axios.get(`http://localhost:8081/rso/${rsoId}/events`)
            .then(response => {
                setEventsList(response.data);
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    const handleCommentSubmit = (eventId) => {
        // Submit comment for the selected event
        axios.post(`http://localhost:8081/events/${eventId}/comments`, { comment })
            .then(response => {
                // Refresh comments for the selected event
                axios.get(`http://localhost:8081/events/${eventId}/comments`)
                    .then(response => {
                        // Update events list with new comments
                        const updatedEventsList = eventsList.map(event => {
                            if (event.event_id === eventId) {
                                event.comments = response.data;
                            }
                            return event;
                        });
                        setEventsList(updatedEventsList);
                    })
                    .catch(error => console.error('Error fetching comments:', error));
            })
            .catch(error => console.error('Error submitting comment:', error));
    };

    return (
        <div>
            <h2>RSOs</h2>
            <ul>
                {rsoList.map(rso => (
                    <li key={rso.rso_id}>
                        <button onClick={() => handleRSOSelection(rso.rso_id)}>{rso.name}</button>
                    </li>
                ))}
            </ul>
            {selectedRSO && (
                <div>
                    <h2>Events for {rsoList.find(rso => rso.rso_id === selectedRSO).name}</h2>
                    <ul>
                        {eventsList.map(event => (
                            <li key={event.event_id}>
                                <h3>{event.event_name}</h3>
                                <p>{event.description}</p>
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button onClick={() => handleCommentSubmit(event.event_id)}>Submit Comment</button>
                                <ul>
                                    {event.comments && event.comments.map(comment => (
                                        <li key={comment.comment_id}>
                                            <p>{comment.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StudentComponent;

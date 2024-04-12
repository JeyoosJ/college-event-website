import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentComponent = ({ user }) => {
    const [eventsList, setEventsList] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        console.log(user);
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8081/events');
                setEventsList(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
    
        fetchEvents();
    }, []);
    
    const handleCommentSubmit = (eventId) => {
        // Submit comment for the selected event
        axios.post(`http://localhost:8081/events/${eventId}/comments`, { text: comment })
            .then(response => {
                // Refresh comments for the selected event
                axios.get(`http://localhost:8081/events/${eventId}/comments`)
                    .then(response => {
                        setEventsList(eventsList.map(event => {
                            if (event.event_id === eventId) {
                                event.comments = response.data;
                            }
                            return event;
                        }));
                    })
                    .catch(error => console.error('Error fetching comments:', error));
                setComment('');
            })
            .catch(error => console.error('Error submitting comment:', error));
    };

    const handleCommentDelete = (eventId, commentId) => {
        // Delete comment for the selected event
        axios.delete(`http://localhost:8081/events/${eventId}/comments/${commentId}`)
            .then(response => {
                // Remove the deleted comment from the events list
                setEventsList(eventsList.map(event => {
                    if (event.event_id === eventId) {
                        event.comments = event.comments.filter(comment => comment.comment_id !== commentId);
                    }
                    return event;
                }));
            })
            .catch(error => console.error('Error deleting comment:', error));
    };

    return (
        <div>
            <h2>Events</h2>
            <div>
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
                                        <button onClick={() => handleCommentDelete(event.event_id, comment.comment_id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default StudentComponent;

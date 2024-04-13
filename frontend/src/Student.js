import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Student.css';

const Student = ({ user }) => {
    const [eventsList, setEventsList] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [editingComment, setEditingComment] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8081/events');
            const eventsData = response.data;
            const eventsWithComments = await Promise.all(eventsData.map(async event => {
                const commentsResponse = await fetchCommentsForEvent(event.eventId); // Change 'event.event_id' to 'event.eventId'
                event.comments = commentsResponse.data;
                return event;
            }));
            setEventsList(eventsWithComments);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchCommentsForEvent = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:8081/events/${eventId}/comments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    };

    const refreshComments = (eventId) => {
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
    };


    const handleCommentSubmit = (eventId) => {
        axios.post(`http://localhost:8081/events/${eventId}/comments`, { text: commentInputs[eventId], user_id: user.UID, event_id: eventId })
            .then(response => {
                // Get the newly added comment from the response
                const newCommentData = response.data;

                const updatedEventsList = eventsList.map(event => {
                    if (event.event_id === eventId) {
                        // Add the new comment to the event's comments array
                        if (!event.comments) {
                            event.comments = [];
                        }
                        event.comments.push(newCommentData);
                    }
                    return event;
                });

                // Update the events list with the new comment
                setEventsList(updatedEventsList);
                setCommentInputs({ ...commentInputs, [eventId]: '' }); // Clear the new comment input for the specific event
                refreshComments(eventId);
            })
            .catch(error => console.error('Error submitting comment:', error));
    };


    const handleCommentEdit = (commentId, commentText) => {
        // Set the editing comment and its current text
        setEditingComment(commentId);
    };

    const handleCommentUpdate = (eventId, commentId) => {
        // Update comment for the selected event
        axios.put(`http://localhost:8081/events/${eventId}/comments/${commentId}`, { text: commentInputs[eventId], comment_id: commentId })
            .then(response => {
                // Refresh comments for the selected event
                refreshComments(eventId);
                // Reset editing comment state
                setEditingComment('');
            })
            .catch(error => console.error('Error updating comment:', error));
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
            <div className="banner">Student Dashboard</div>
            <div className="banner">Events</div>
            <div className="container">
                <ul className="list-group">
                    {eventsList.map(event => (
                        <li key={event.event_id} className="list-group-item">
                            <h3>{event.event_name}</h3>
                            <p>{event.description}</p>
                            <input
                                type="text"
                                placeholder="Add a comment"
                                value={commentInputs[event.event_id] || ''} // Use commentInputs state for each event
                                onChange={(e) => setCommentInputs({ ...commentInputs, [event.event_id]: e.target.value })} // Update specific event's comment input
                            />
                            <button className="btn btn-primary" onClick={() => handleCommentSubmit(event.event_id)}>Submit Comment</button>
                            <ul className="list-group">
                                {event.comments && event.comments.map(comment => (
                                    <li key={comment.comment_id} className="list-group-item">
                                        {editingComment === comment.comment_id ? (
                                            <input
                                                type="text"
                                                value={commentInputs[event.event_id] || ''}
                                                onChange={(e) => setCommentInputs({ ...commentInputs, [event.event_id]: e.target.value })}
                                            />
                                        ) : (
                                            <div>{comment.text}</div>
                                        )}
                                        <div>
                                            {editingComment === comment.comment_id ? (
                                                <>
                                                    <button className="btn btn-success" onClick={() => handleCommentUpdate(event.event_id, comment.comment_id)}>Update</button>
                                                    <button className="btn btn-secondary" onClick={() => setEditingComment('')}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn btn-warning" onClick={() => handleCommentEdit(comment.comment_id, comment.text)}>Edit</button>
                                                    <button className="btn btn-danger" onClick={() => handleCommentDelete(event.event_id, comment.comment_id)}>Delete</button>
                                                </>
                                            )}
                                        </div>
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

export default Student;

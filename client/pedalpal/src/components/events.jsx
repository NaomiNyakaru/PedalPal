import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Event Form Component to add a new event
const EventForm = ({ onAddEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const eventData = { title, description, date, location };
            const response = await axios.post('http://localhost:5000/events', eventData);
            onAddEvent(response.data); // Add the event to the list
            // Clear the form fields
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
        } catch (err) {
            console.error('Error adding event', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
                required
            />
            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event Location"
                required
            />
            <button type="submit">Add Event</button>
        </form>
    );
};

// Event List Component to display events
const EventList = ({ events }) => {
    return (
        <div>
            {events.map((event) => (
                <div key={event._id}>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>{new Date(event.date).toLocaleString()}</p>
                    <p>{event.location}</p>
                </div>
            ))}
        </div>
    );
};

// Main App Component
const OrganizerPage = () => {
    const [events, setEvents] = useState([]);

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/events');
                setEvents(response.data);
            } catch (err) {
                console.error('Error fetching events', err);
            }
        };
        fetchEvents();
    }, []);

    // Add event to state after form submission
    const handleAddEvent = (event) => {
        setEvents((prevEvents) => [...prevEvents, event]);
    };

    return (
        <div>
            <h1>Event Announcements</h1>
            <EventForm onAddEvent={handleAddEvent} />
            <EventList events={events} />
        </div>
    );
};

export default OrganizerPage;
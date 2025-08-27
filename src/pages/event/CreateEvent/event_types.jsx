import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBarNav from '../../pageAssets/sideBarNav';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './eventTypeStyling.css';
import EventCreationWizard from './EventForm';

function EventType() {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/event/type`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                const uniqueEvents = Array.from(new Set(response.data.events.map(e => e.name)))
                    .map(name => response.data.events.find(e => e.name === name));
                setEventTypes(uniqueEvents);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchEventTypes();
    }, [user]);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
    };

    if (loading || error) {
        return (
            <div className="container-fluid m-0 p-0">
                <SideBarNav />
                <div className="page_wrapper overflow-hidden">
                    <div className="row p-0">
                        <div className="col">
                            <div className="container mt-5">
                                {loading && <p>Loading event types...</p>}
                                {error && <p>Error loading event types: {error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0">
                    <div className="col">
                        <div className="container mt-5 pb-5 event_type_container">
                            {!selectedEvent ? (
                                <>
                                    <h5>What type of events are you creating?</h5>
                                    <small>This helps us customize your event setup.</small>
                                    <ul className="p-0 mt-3 col-xl-9  mb-5 pb-5">
                                        {eventTypes.map((event) => (
                                            <li
                                                key={event.id}
                                                className="type_list d-flex justify-content-between border-bottom pb-2 mb-3 align-items-center"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEventSelect(event)} >
                                                <div>
                                                    <span>{event.name}</span>
                                                </div>
                                                <div>
                                                    <span className="fa fa-angle-right"></span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <EventCreationWizard setSelectedEvent={setSelectedEvent} eventType={selectedEvent} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EventType;

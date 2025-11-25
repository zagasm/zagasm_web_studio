import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBarNav from '../../pageAssets/SideBarNav';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './eventTypeStyling.css';
import EventCreationWizard from './EventForm';

function EventType() {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user, token } = useAuth();
// console.log('user', token);
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/event/type/view`,
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

    const isOrganizer = false;

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
    // console.log(user)

    if (!isOrganizer) {
        return (
            <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-20 tw:md:pt-24 tw:px-4 tw:lg:px-4">
                <div className='tw:bg-white tw:px4 tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-10 tw:rounded-3xl tw:px-4 tw:py-3'>
                    <div className='tw:flex tw:flex-col tw:items-center tw:justify-center'>
                        <div className='tw:size-[114px]'>
                            <img src={user.profileUrl || '/images/avater_pix.avif'} alt="" />
                        </div>
                        <div className='tw:mt-1 tw:text-center'>
                            <span className='tw:font-semibold tw:text-[16px]'>
                                {user.name}
                            </span>
                            <span className='tw:block tw:text-xs'>
                                {user.email}
                            </span>
                        </div>
                        <div className='tw:bg-[#f5f5f5] tw:relative tw:px-4 tw:py-3 tw:rounded-2xl tw:mt-6 tw:w-full'>
                            <div>
                                <span className="tw:text-xs">Following</span>
                                <span className='tw:block tw:font-semibold tw:text-[20px]'>
                                    {user.followings_count}
                                </span>
                            </div>
                            <img className='tw:size-3 tw:absolute tw:top-4 tw:right-4' src="/images/arrowrightbend.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className='tw:bg-white tw:px4 tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-2 tw:rounded-2xl tw:px-4 tw:py-3'>
                    <span className='tw:block tw:font-semibold '>About Me</span>
                    <span className='tw:text-xs'>
                        {user.about}
                    </span>
                </div>
                <div className='tw:bg-linear-to-r tw:from-[#8F07E7] tw:via-[#9105B4] tw:to-[#500481] tw:px4 tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-4 tw:rounded-2xl tw:px-4 tw:py-4 tw:text-center tw:text-white'>
                    <span className='tw:block tw:font-semibold tw:uppercase tw:text-xl'>Do you have an event?</span>
                    <span className='tw:text-xs'>
                        You can be an organizer and drive more audience to your event. People all over the world can’t wait to attend!!
                    </span>

                    <Link className='tw:p-3 tw:block tw:bg-white text-dark tw:mt-5 tw:rounded-lg tw:text-center'>
                        Become an Organizer
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="">
            <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-20 tw:md:pt-24 tw:lg:px-4">
                <div className="">
                    <div className="col">
                        <div className="container mt-5 pb-5 event_type_container">
                            <div className="tw:max-w-7xl tw:mx-auto">
                                <h5>What type of events are you creating?</h5>
                                <small>This helps us customize your event setup.</small>
                                <ul className="p-0 mt-3 col-xl-9  mb-5 pb-5">
                                    {eventTypes.map((event) => (
                                        <li
                                            key={event.id}
                                            className="type_list d-flex justify-content-between border-bottom pb-2 mb-3 align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEventSelect(event)} >
                                            <Link to={`/event/create-event/${event.id}`} className='w-100 d-flex justify-content-between align-items-center text-dark'>
                                                <div>
                                                    <span>{event.name}</span>
                                                </div>
                                                <div>
                                                    <span className="fa fa-angle-right"></span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EventType;

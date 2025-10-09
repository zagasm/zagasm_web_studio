import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBarNav from '../../pageAssets/SideBarNav';
import RightBarComponent from '../../../component/RightBarComponent';
import SuggestedOrganizer from '../../../component/Suggested_organizer/suggestedOrganizer';
import heart_icon from '../../../assets/navbar_icons/heart_icon.png';
import userImg from '../../../assets/navbar_icons/users.png';
import exclamation_circle from '../../../assets/navbar_icons/exclamation_circle.png';
import Share from '../../../assets/navbar_icons/Share.png';
import './eventView.css';
import { useAuth } from '../../../pages/auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../../../component/SEO';
import { Helmet } from 'react-helmet-async';

function ViewEvent() {
    const { eventId } = useParams();
    const { token } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/view`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Failed to fetch event details');

            const data = await res.json();
            setEvent(data.data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getOrganizerImage = (id) => {
        const randomImageId = id % 50;
        return `https://randomuser.me/api/portraits/${randomImageId % 2 === 0 ? 'men' : 'women'}/${randomImageId}.jpg`;
    };

    const handleGetTicket = () => {
        toast.success(`🎟️ Ticket booked for "${event?.title || 'Event'}"!`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    if (loading) {
        return <div className="p-5 text-center">Loading event...</div>;
    }

    if (error) {
        return <div className="p-5 text-center text-danger">Error: {error}</div>;
    }
    const formatDateTime = (dateStr, timeStr) => {
        try {
            const date = new Date(`${dateStr} ${timeStr}`);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            return `${formattedDate} · ${formattedTime}`;
        } catch {
            return `${dateStr} · ${timeStr}`;
        }
    };
    return (
        <>
            <SEO 
                title={event?.title ? `${event.title} - Event Details` : 'Event Details'}
                description={event?.description ? event.description.substring(0, 155) : 'Discover event details, get tickets, and connect with attendees at Zagasm Studios. Join the experience!'}
                keywords={`zagasm studios, ${event?.title || 'event'}, ${event?.eventType || 'event'}, event tickets, ${event?.hostName || 'event organizer'}, live events, entertainment`}
                image={event?.poster?.[0]?.url || '/zagasm_studio_logo.png'}
                type="article"
            />
            
            {event && (
                <Helmet>
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Event",
                            "name": event.title,
                            "description": event.description,
                            "image": event.poster?.[0]?.url,
                            "startDate": `${event.eventDate}T${event.startTime}`,
                            "endDate": event.endDate ? `${event.endDate}T${event.endTime}` : undefined,
                            "eventStatus": "https://schema.org/EventScheduled",
                            "eventAttendanceMode": event.eventType === 'virtual' ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
                            "location": {
                                "@type": event.eventType === 'virtual' ? "VirtualLocation" : "Place",
                                "name": event.location || "Event Location",
                                "address": event.address
                            },
                            "offers": {
                                "@type": "Offer",
                                "price": event.price || 0,
                                "priceCurrency": "USD",
                                "availability": "https://schema.org/InStock",
                                "url": window.location.href
                            },
                            "organizer": {
                                "@type": "Organization",
                                "name": event.hostName || "Zagasm Studios",
                                "url": "https://studios.zagasm.com"
                            },
                            "performer": {
                                "@type": "PerformingGroup",
                                "name": event.hostName || "Event Host"
                            }
                        })}
                    </script>
                </Helmet>
            )}
            
            <ToastContainer />
            <div className="container-flui m-0 p-0">
                <SideBarNav />
                <div className="page_wrapper overflow-hidden">
                    <div className="row p-0 ">
                        <div className="col ">
                            <div className="container event_view_container">
                                <div className="s rounded h-100 blog-car border-0 position-relative">

                                    <div className="text-decoration-none text-dark">
                                        <img
                                            className="card-img-top"
                                            src={event?.poster?.[0]?.url || 'https://via.placeholder.com/800x400'}
                                            alt={event?.title || 'Event'}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                height: '300px',
                                                objectFit: 'contain',
                                                backgroundColor: '#f8f8f8'
                                            }}
                                        />
                                        <div className='event_detail_content align-items-center w-100 pt-2 pb-2 pr-1 pl-1'>
                                            <div style={{ lineHeight: '19px' }}>
                                                <h5>{event?.title || 'Untitled Event'}</h5>
                                                <span style={{ color: 'rgba(143, 7, 231, 1)' }}>{event?.hostName || 'Unknown Host'}</span>
                                                <br />
                                                <small className="event_time text-muted">
                                                   {formatDateTime(event?.eventDate,event?.startTime)}
                                                </small>
                                            </div>
                                            <div>
                                                <button className="event_pay_btn text-muted">
                                                    <span style={{ color: 'rgba(255, 204, 0, 1)' }}>Pay</span>
                                                    <span className='text-light'>(${event?.price || 0})</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="organizers_views border-rounded mt-4">
                                            <div className="d-flex align-items-center mb-3 job-item-body">
                                                <div className="overlap-rounded-circle">
                                                    {[1, 2, 3, 4, 5].map((_, index) => (
                                                        <img
                                                            key={index}
                                                            className="rounded-circle shadow-sm user_template_im"
                                                            src={getOrganizerImage(index + 1)}
                                                            alt={`Viewer ${index}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-weight-lighter">200 others are attending</span>
                                            </div>
                                        </div>

                                        <div className="card pt-4 pb-4">
                                            <div className="quest_performers_section">
                                                <div className='perfomer_heading'>
                                                    <img src={userImg} alt="performers" /> <span>Guest Performer</span>
                                                </div>
                                                <div>
                                                    {event?.eventPerformers?.map((performer, index) => (
                                                        <img
                                                            key={index}
                                                            className="rounded-circle shadow-sm user_template_im"
                                                            src={performer.image_url}
                                                            alt={performer.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-top border-bottom p-2 mt-4">
                                            <h5>Description</h5>
                                            <p>{event?.description || 'No description available.'}</p>
                                        </div>

                                        <div className="p-2">
                                            <div className="quest_performers_section2">
                                                <div>
                                                    <h5>Location</h5>
                                                    <small><b>{event?.location}</b></small><br />
                                                    <small className='font-weight-lighter'>{event?.location}</small>
                                                </div>
                                                <div>
                                                    <span className='fa fa-copy'></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shadow-sm contact_section pb-4">
                                            <div>
                                                <div className="image_card">
                                                    <img src={event?.hostImage || getOrganizerImage(1)} alt="host" />
                                                    <h4>{event?.hostName}</h4>
                                                </div>
                                                <div className="btn_card">
                                                    <button className='follow_btn'>Follow</button>
                                                    <button className='contact_btn'>Contact</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="report">
                                            <p><img src={exclamation_circle} alt="report" /> <u>Report this event</u></p>
                                        </div>

                                        <div className="remark_section p-4">
                                            <h5 className='mb-4'>Remarks</h5>
                                            {event?.remarks?.length > 0 ? event.remarks.map((remark, idx) => (
                                                <div key={idx} className='d-flex mb-3'>
                                                    <div>
                                                        <img className="rounded-circle" src={getOrganizerImage(idx + 1)} alt="remark" />
                                                    </div>
                                                    <div className='remarks'>
                                                        <small><b>{remark.user || 'Anonymous'}</b></small>
                                                        <p>{remark.text}</p>
                                                    </div>
                                                </div>
                                            )) : <p>No remarks yet.</p>}
                                        </div>

                                        <div className='event_detail_footer align-items-center shadow-sm'>
                                            <div style={{ lineHeight: '0px' }}>
                                                <h5>${event?.price || 0}</h5>
                                                <small className="event_time text-muted"> {formatDateTime(event?.eventDate,event?.startTime)}</small>
                                            </div>
                                            <div>
                                                <button
                                                    className="footer_event_pay_btn text-muted"
                                                    onClick={handleGetTicket}
                                                >
                                                    <span className='text-light'>Get ticket</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <RightBarComponent>
                            <SuggestedOrganizer />
                        </RightBarComponent>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewEvent;

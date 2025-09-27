import React, { useState, useEffect, useCallback } from 'react';
import SingleOrganizers from "../../component/Organizers/singleOrganizers";
import RightBarComponent from "../../component/RightBarComponent";
import SideBarNav from "../pageAssets/SideBarNav";
import '../../component/Organizers/organizerStyling.css';
import SuggestedOrganizer from "../../component/Suggested_organizer/suggestedOrganizer";
import SuggestedEvent from "../../component/Suggested_event/suggestedEvent";
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../auth/AuthContext';

function AllOrganizers() {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    // Fetch events from the public API endpoint
    const fetchEvents = useCallback(async (url = null, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            // Use the provided URL or the default endpoint
            const fetchUrl = url || `${import.meta.env.VITE_API_URL}/api/v1/events`;

            const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await res.json();

            if (data.data) {
                if (isLoadMore) {
                    // Append new events to existing ones
                    setEvents(prevEvents => [...prevEvents, ...data.data]);
                } else {
                    // Replace events for initial load
                    setEvents(data.data);
                }

                // Set the next page URL for infinite scroll
                setNextPageUrl(data.links?.next || null);
                setHasMore(!!data.links?.next);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [token]);

    // Load more events when scrolling
    const loadMoreEvents = useCallback(() => {
        if (nextPageUrl && !loadingMore && hasMore) {
            fetchEvents(nextPageUrl, true);
        }
    }, [nextPageUrl, loadingMore, hasMore, fetchEvents]);

    // Set up scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop
                !== document.documentElement.offsetHeight) {
                return;
            }

            loadMoreEvents();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreEvents]);

    // Initial load
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);



    return (
        <div className="container-fluid m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0 pb-5 mb-5 ">
                    {loading && events.length === 0 ? <div className="col text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading Organizers...</p>
                    </div> : <div className="col ">
                        <h4 className="organizer_heading">Organizer You May Know</h4>
                        <div className="row">
                            <SingleOrganizers />
                        </div>
                    </div>}
                    <RightBarComponent>
                        <div className="m-3 mt-4">
                            <SuggestedEvent
                                myEvent={false}
                                events={events}
                                loading={loading}
                                loadingMore={loadingMore}
                                error={error}
                                hasMore={hasMore}
                                onLoadMore={loadMoreEvents}
                            />
                        </div>
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default AllOrganizers;
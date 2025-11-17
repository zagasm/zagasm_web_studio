import SideBarNav from '../../pageAssets/SideBarNav';
import RightBarComponent from '../../../component/RightBarComponent';
import EventCreationWizard from './EventForm';
import SEO from '../../../component/SEO';
import { useParams } from 'react-router-dom';

function CreateEvent() {
    const { eventTypeId } = useParams();
    return (
        <>
            <SEO 
                title="Create Event - Host Your Next Amazing Event"
                description="Create and manage your events with Zagasm Studios. Set up concerts, parties, festivals, conferences, and more with our easy-to-use event creation platform. Sell tickets and manage attendees."
                keywords="zagasm studios, create event, host event, event management, sell tickets, event hosting, organize concert, plan party, festival management, event ticketing platform"
            />
            <div className="">
                <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-2 tw:md:pt-24 tw:lg:px-4">
                    <div className="row p-0 mt-5 ">
                        <div className="col ">
                             <EventCreationWizard eventTypeId={eventTypeId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateEvent;
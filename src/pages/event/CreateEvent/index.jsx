import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../../component/RightBarComponent';
import EventCreationWizard from './EventForm';
function CreateEvent() {
    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0 ">
                    <div className="col ">
                         <EventCreationWizard />
                    </div>
                    {/* <RightBarComponent>
                    </RightBarComponent> */}
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;
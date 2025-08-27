import SingleOrganizers from "../../component/Organizers/singleOrganizers";
import RightBarComponent from "../../component/RightBarComponent";
import SideBarNav from "../pageAssets/sideBarNav";
import '../../component/Organizers/organizerStyling.css';
import SuggestedOrganizer from "../../component/Suggested_organizer/suggestedOrganizer";
import SuggestedEvent from "../../component/Suggested_event/suggestedEvent";
function AllOrganizers() {
    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0 pb-5 mb-5 ">
                    <div className="col ">
                        <h4 className="organizer_heading">Organizer You May Know</h4>
                        <div className="row">
                            <SingleOrganizers />
                        </div>
                    </div>
                    <RightBarComponent>
                        <SuggestedEvent />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default AllOrganizers;

import { Link } from 'react-router-dom';
import SingleNotificationTemplate from '../../../component/Notification/singleNotification';
import SideBarNav from '../../pageAssets/sideBarNav';

function AllNotification() {
    return (
        <Link to={''} className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">

                <div className="row p-0 ">
                    <div className="col ">
                        <div className="container">
                            <div className="mt-5 p-2">
                                <div className='mb-4 d-flex justify-content-between'>
                                    <h4 className='text-black'>Notification</h4>
                                    <h4 className='feather-settings text-black'></h4>
                                </div>
                                <SingleNotificationTemplate />
                                <SingleNotificationTemplate />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default AllNotification;
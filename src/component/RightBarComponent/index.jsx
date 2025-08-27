import { useState } from 'react';
import SuggestedOrganizer from '../Suggested_organizer/suggestedOrganizer';
import './right_bar_component.css';

function RightBarComponent({children}) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="col d-non col-xl-3 rightBarContainer position-relative " style={{ padding: 0 }}>
            <div className="right_bar_component">
                <i 
                    className='fa fa-close' 
                    onClick={handleClose}
                    aria-label="Close sidebar"
                ></i>
                {children}
            </div>
        </div>
    );
}

export default RightBarComponent;
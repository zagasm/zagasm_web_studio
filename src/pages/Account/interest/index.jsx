import React, { useState } from 'react';
import SideBarNav from '../../pageAssets/sideBarNav';
import './interestStyling.css';

// Import icons
import music_icon from '../../../assets/navbar_icons/music_icon.png';
import church_icon from '../../../assets/navbar_icons/church_icon.png';
import mosque from '../../../assets/navbar_icons/mosque.png';
import cultural_icon from '../../../assets/navbar_icons/cultural_icon.png';
import gospel_icon from '../../../assets/navbar_icons/gospel_icon.png';
import notification_icon from '../../../assets/navbar_icons/notification_icon.png';
import webinar_icon from '../../../assets/navbar_icons/webinar_icon.png';
import masterclass_icon from '../../../assets/navbar_icons/masterclass_icon.png';
import photo_icon from '../../../assets/navbar_icons/photo_icon.png';
import afrobeat_icon from '../../../assets/navbar_icons/afrobeat_icon.png';

const interests = [
    { name: 'Live Concert', icon: music_icon, borderColor: 'rgba(255, 59, 48, 1)', textColor: 'white', bgColor: 'rgba(255, 59, 48, 1)' },
    { name: 'Church Service', icon: church_icon, borderColor: 'rgba(52, 199, 89, 1)', bgColor: 'white', textColor: 'rgba(52, 199, 89, 1)' },
    { name: 'Mosques', icon: mosque, borderColor: 'rgba(52, 199, 89, 1)', bgColor: 'white', textColor: 'rgba(52, 199, 89, 1)' },
    { name: 'Cultural Festivals', icon: cultural_icon, borderColor: 'rgba(50, 173, 230, 1)', bgColor: 'white', textColor: 'rgba(50, 173, 230, 1)' },
    { name: 'Gospel worship nights', icon: gospel_icon, borderColor: 'rgba(175, 82, 222, 1)', bgColor: 'white', textColor: 'rgba(175, 82, 222, 1)' },
    { name: 'Politics', icon: notification_icon, borderColor: 'rgba(88, 86, 214, 1)', bgColor: 'rgba(88, 86, 214, 1)', textColor: 'white' },
    { name: 'Webinar', icon: webinar_icon, borderColor: 'rgba(255, 204, 0, 1)', bgColor: 'white', textColor: 'rgba(255, 204, 0, 1)' },
    { name: 'Masterclasses', icon: masterclass_icon, borderColor: 'rgba(255, 149, 0, 1)', bgColor: 'white', textColor: 'rgba(255, 149, 0, 1)' },
    { name: 'Photography', icon: photo_icon, borderColor: 'rgba(0, 199, 190, 1)', bgColor: 'rgba(0, 199, 190, 1)', textColor: 'white' },
    { name: 'Afrobeats', icon: afrobeat_icon, borderColor: 'rgba(52, 199, 89, 1)', bgColor: 'white', textColor: 'rgba(52, 199, 89, 1)' },
];

function AccountInterest() {
    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (interestName) => {
        setSelectedInterests(prev => 
            prev.includes(interestName) 
                ? prev.filter(name => name !== interestName)
                : [...prev, interestName]
        );
    };

    const getButtonStyle = (interest) => {
        const isSelected = selectedInterests.includes(interest.name);
        const isWhiteBg = interest.bgColor === 'white';
        
        if (isSelected) {
            return {
                color: isWhiteBg ? 'white' : interest.textColor,
                backgroundColor: isWhiteBg ? interest.borderColor : 'white',
                border: `1px solid ${interest.borderColor}`,
            };
        }
        
        return {
            color: interest.textColor,
            backgroundColor: interest.bgColor,
            border: `1px solid ${interest.borderColor}`,
        };
    };

    return (
        <div className="container-fluid m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0">
                    <div className="col interest_section">
                        <div className="container">
                            <div className="interest_container">
                                {interests.map((interest, index) => (
                                    <button
                                        key={index}
                                        className="interest-button"
                                        style={getButtonStyle(interest)}
                                        onClick={() => toggleInterest(interest.name)}
                                        onMouseEnter={(e) => {
                                            if (!selectedInterests.includes(interest.name)) {
                                                const isWhiteBg = interest.bgColor === 'white';
                                                e.currentTarget.style.color = isWhiteBg ? 'white' : interest.textColor;
                                                e.currentTarget.style.backgroundColor = isWhiteBg ? interest.borderColor : 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!selectedInterests.includes(interest.name)) {
                                                e.currentTarget.style.color = interest.textColor;
                                                e.currentTarget.style.backgroundColor = interest.bgColor;
                                            }
                                        }}
                                    >
                                        <img src={interest.icon} alt={interest.name} width="16" height="16" />
                                        {interest.name}
                                    </button>
                                ))}
                            </div>
                            <div className="interest_footer">
                                <div className='skip_btn'>
                                    <span>Skip for now</span>
                                </div>
                                <div className='save_btn'>
                                    <button 
                                        className={selectedInterests.length > 0 ? 'active' : ''}
                                        disabled={selectedInterests.length === 0}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountInterest;
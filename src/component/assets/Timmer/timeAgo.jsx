import React from 'react';
import moment from 'moment';

const TimeAgo = ({ date }) => {
    const getTimeAgo = (date) => {
        const now = moment();
        const then = moment(date);
        const duration = moment.duration(now.diff(then));

        const minutes = duration.asMinutes();
        const hours = duration.asHours();
        const days = duration.asDays();
        const years = duration.asYears();

        if (minutes < 1) {
            return "just now";
        } else if (minutes < 60) {
            return `${Math.floor(minutes)} minute${minutes >= 2 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${Math.floor(hours)} hour${hours >= 2 ? 's' : ''} ago`;
        } else if (days < 7) {
            return `${Math.floor(days)} day${days >= 2 ? 's' : ''} ago`;
        } else if (days < 30) {
            return `${Math.floor(days / 7)} week${Math.floor(days / 7) >= 2 ? 's' : ''} ago`;
        } else if (days < 365) {
            return `${Math.floor(days / 30)} month${Math.floor(days / 30) >= 2 ? 's' : ''} ago`;
        } else {
            return `${Math.floor(years)} year${years >= 2 ? 's' : ''} ago`;
        }
    };

    return getTimeAgo(date);
};

export default TimeAgo;
// src/component/ChatShimmerLoader.js
import React from 'react';
import './ShiningLoader.css';

function ChatShimmerLoader() {
    return (
        <div className="chat-loader card rounded chat-container p-3">
            {/* Header */}
            <div className="shimmer-header d-flex align-items-center mb-3">
                <div className="shimmer-circle me-2"></div>
                <div className="flex-grow-1">
                    <div className="shimmer-line w-50 mb-1"></div>
                    <div className="shimmer-line w-25"></div>
                </div>
            </div>

            {/* Messages */}
            <div className="shimmer-message mb-3"></div>
            <div className="shimmer-message me mb-3"></div>

            {/* Footer */}
            <div className="shimmer-footer mt-auto"></div>
        </div>
    );
}

export default ChatShimmerLoader;
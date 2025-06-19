import React, { useState } from 'react';
import Linkify from 'react-linkify';

const TextFormatter = ({ text, maxLength = 150 }) => {
  const [showFullText, setShowFullText] = useState(false);
  
  if (!text) return null;

  // Format text with line breaks and links
  const formatText = (text) => {
    return text.split('\n').map((paragraph, i) => (
      <div key={i} style={{ marginBottom: '0.5rem' }}>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a 
              key={key} 
              href={decoratedHref.startsWith('www') ? `http://${decoratedHref}` : decoratedHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              {decoratedText}
            </a>
          )}
        >

          {paragraph}
        </Linkify>
      </div>
    ));
  };

  const needsTruncation = text.length > maxLength;
  const displayText = showFullText ? text : (needsTruncation ? text.substring(0, maxLength) + '...' : text);

  return (
    <div className="post-text" style={{ whiteSpace: 'pre-line' }}>
      {formatText(displayText)}
      {needsTruncation && (
        <button 
          onClick={() => setShowFullText(!showFullText)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textDecoration: 'none',
            color:'#8000FF',
            display:'inline'
          }}
        >
          {showFullText ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default TextFormatter;
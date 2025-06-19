import React from 'react';
import { Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import axios from 'axios';

export const downloadTextAsImage = (text, textColor, backgroundColor) => {
  const div = document.createElement('div');
  div.style.color = textColor;
  div.style.backgroundColor = backgroundColor;
  div.style.padding = '40px';
  div.style.borderRadius = '10px';
  div.style.fontSize = '24px';
  div.style.fontWeight = 'bold';
  div.style.textAlign = 'center';
  div.style.width = '600px';
  div.style.height = '300px';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.textContent = text;
  document.body.appendChild(div);

  html2canvas(div).then(canvas => {
    canvas.toBlob(blob => {
      saveAs(blob, 'post-text.png');
      document.body.removeChild(div);
    });
  });
};

export const downloadImages = async (photos) => {
  try {
    const zip = new JSZip();
    const imgFolder = zip.folder("post-images");
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      try {
        // Use your backend endpoint as proxy
        const response = await axios.get(`/api/download-image`, {
          params: { url: photo.source },
          responseType: 'blob'
        });
        
        const extension = photo.source.split('.').pop()?.split('?')[0] || 'jpg';
        imgFolder.file(`image-${i + 1}.${extension}`, response.data);
      } catch (error) {
        console.error(`Failed to download image ${i}:`, error);
        // Fallback to opening in new tab
        window.open(`https://zagasm.com/content/uploads/${photo.source}`, '_blank');
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'post-images.zip');
  } catch (error) {
    console.error('Error creating zip:', error);
    alert('Could not create ZIP. Images opened in new tabs instead.');
    photos.forEach(photo => {
      window.open(`https://zagasm.com/content/uploads/${photo.source}`, '_blank');
    });
  }
};

const PostDownloadButton = ({ data }) => {
  const hasImages = data.photos?.length > 0;
  const hasText = data.text?.trim().length > 0;

  const handleDownload = (type) => {
    if (type === 'text') {
      downloadTextAsImage(
        data.text,
        data.text_color_code || '#000000',
        data.background_color_code || '#ffffff'
      );
    } else if (type === 'images') {
      downloadImages(data.photos);
    }
  };

  return (
    <div className="dropdown">
      <button 
        className="btn btn-sm dropdown-toggle text-secondary border-0 bg-transparent"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="feather-download"></i>
      </button>
      <ul className="dropdown-menu">
        {hasText && (
          <li>
            <button 
              className="dropdown-item"
              onClick={() => handleDownload('text')}
            >
              Download Text as Image
            </button>
          </li>
        )}
        {hasImages && (
          <li>
            <button 
              className="dropdown-item"
              onClick={() => handleDownload('images')}
            >
              {data.photos.length > 1 ? 'Download All Images' : 'Download Image'}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PostDownloadButton;
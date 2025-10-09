import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Structured Data Components for Schema.org JSON-LD
 * Use these to add rich snippets for better SEO
 */

// Event Structured Data
export const EventStructuredData = ({ event }) => {
  if (!event) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "image": event.poster?.[0]?.url || event.image,
    "startDate": event.eventDate ? `${event.eventDate}T${event.startTime || '00:00'}` : undefined,
    "endDate": event.endDate ? `${event.endDate}T${event.endTime || '23:59'}` : undefined,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.eventType === 'virtual' 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": event.eventType === 'virtual' ? "VirtualLocation" : "Place",
      "name": event.location || event.venue || "Event Location",
      "address": event.address || event.location
    },
    "offers": {
      "@type": "Offer",
      "price": event.price || 0,
      "priceCurrency": event.currency || "USD",
      "availability": "https://schema.org/InStock",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "validFrom": new Date().toISOString()
    },
    "organizer": {
      "@type": "Organization",
      "name": event.hostName || event.organizer || "Zagasm Studios",
      "url": "https://studios.zagasm.com"
    },
    "performer": event.performer ? {
      "@type": "PerformingGroup",
      "name": event.performer
    } : undefined
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Organization Structured Data
export const OrganizationStructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zagasm Studios",
    "url": "https://studios.zagasm.com",
    "logo": "https://studios.zagasm.com/zagasm_studio_logo.png",
    "description": "Zagasm Studios is the premier platform for discovering exciting events, connecting with top organizers, and creating unforgettable experiences.",
    "sameAs": [
      // Add your social media URLs here
      // "https://www.facebook.com/zagasmstudios",
      // "https://twitter.com/zagasmstudios",
      // "https://www.instagram.com/zagasmstudios",
      // "https://www.linkedin.com/company/zagasmstudios"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@zagasm.com"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Person/Organizer Structured Data
export const PersonStructuredData = ({ person }) => {
  if (!person) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name || `${person.firstName} ${person.lastName}`,
    "image": person.profileUrl?.url || person.profileImage,
    "jobTitle": person.jobTitle || "Event Organizer",
    "description": person.bio || person.description,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "sameAs": person.socialLinks || []
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// BreadcrumbList Structured Data
export const BreadcrumbStructuredData = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Website Search Box
export const WebsiteSearchBoxStructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://studios.zagasm.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://studios.zagasm.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ItemList for Events/Organizers listing pages
export const ItemListStructuredData = ({ items, type = 'Event' }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": item.url || (typeof window !== 'undefined' ? window.location.href : ''),
      "name": item.name || item.title
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default {
  EventStructuredData,
  OrganizationStructuredData,
  PersonStructuredData,
  BreadcrumbStructuredData,
  WebsiteSearchBoxStructuredData,
  ItemListStructuredData
};

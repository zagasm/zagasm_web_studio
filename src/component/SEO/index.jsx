import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Zagasm Studios',
  description = 'Discover and create amazing events with Zagasm Studios - Your premier platform for event management, ticketing, and social connections.',
  keywords = 'zagasm studios, events, event management, tickets, organizers, concerts, parties, entertainment, social events',
  image = '/zagasm_studio_logo.png',
  url = window.location.href,
  type = 'website',
  author = 'Zagasm Studios',
  twitterCard = 'summary_large_image',
}) => {
  const siteName = 'Zagasm Studios';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default SEO;

import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import StructuredData from './StructuredData';

const SEO = ({
  title = 'Zagasm Studios',
  description = 'Discover and create amazing events with Zagasm Studios - your destination for live experiences, creators, and social commerce.',
  keywords = 'zagasm studios, events, event management, tickets, organizers, concerts, parties, entertainment, social events',
  image = '/images/event-dummy.jpg',
  url = typeof window !== 'undefined' ? window.location.href : 'https://studios.zagasm.com',
  type = 'website',
  author = 'Zagasm Studios',
  twitterCard = 'summary_large_image',
  locale = 'en_US',
  twitterSite = '@zagasmstudios',
  publishedTime,
  modifiedTime,
  structuredData = [],
}) => {
  const siteName = 'Zagasm Studios';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const updatedAt = modifiedTime || new Date().toISOString();

  const customStructuredData = useMemo(
    () =>
      Array.isArray(structuredData) && structuredData.length
        ? structuredData
        : [],
    [structuredData]
  );

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <link rel="canonical" href={url} />

        {/* Open Graph / Facebook */}
        <meta property="og:locale" content={locale} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:updated_time" content={updatedAt} />

        {/* Article meta (if applicable) */}
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

        {/* Twitter */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:site" content={twitterSite} />
        <meta name="twitter:creator" content={twitterSite} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#8f07e7" />
        <link rel="apple-touch-icon" href="/images/hero-event.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* Structured Data */}
      <StructuredData.OrganizationStructuredData />
      <StructuredData.WebsiteSearchBoxStructuredData />
      {customStructuredData.map((obj, idx) => (
        <Helmet key={`custom-schema-${idx}`}>
          <script type="application/ld+json">{JSON.stringify(obj)}</script>
        </Helmet>
      ))}
    </>
  );
};

export default SEO;

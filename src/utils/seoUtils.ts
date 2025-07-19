
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const updateMetaTags = (seoData: SEOData) => {
  // Update title
  document.title = seoData.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Basic meta tags
  updateMetaTag('description', seoData.description);
  updateMetaTag('keywords', seoData.keywords.join(', '));

  // Open Graph tags
  updateMetaTag('og:title', seoData.ogTitle || seoData.title, true);
  updateMetaTag('og:description', seoData.ogDescription || seoData.description, true);
  updateMetaTag('og:type', 'website', true);
  
  if (seoData.ogImage) {
    updateMetaTag('og:image', seoData.ogImage, true);
  }
  
  if (seoData.ogUrl) {
    updateMetaTag('og:url', seoData.ogUrl, true);
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData.ogTitle || seoData.title);
  updateMetaTag('twitter:description', seoData.ogDescription || seoData.description);
  
  if (seoData.ogImage) {
    updateMetaTag('twitter:image', seoData.ogImage);
  }

  // Canonical URL
  if (seoData.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonicalUrl);
  }

  // Structured data
  if (seoData.structuredData) {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(seoData.structuredData);
  }
};

export const createBookStructuredData = (book: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "description": book.description,
    "image": book.coverImage,
    "author": {
      "@type": "Person",
      "name": "Maggie",
      "description": "A lovable dog who shares Bible stories with children"
    },
    "genre": ["Children's Literature", "Religious", "Educational"],
    "inLanguage": book.languages,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "ratingCount": book.reviewCount
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "url": book.amazonLink,
      "seller": {
        "@type": "Organization",
        "name": "Amazon"
      }
    }
  };
};

export const getBaseUrl = () => {
  return window.location.origin;
};

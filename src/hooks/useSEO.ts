import React from 'react';
import { updateMetaTags, SEOData } from '@/utils/seoUtils';

interface UseSEOProps {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const useSEO = (seoData: UseSEOProps) => {
  React.useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    
    updateMetaTags({
      ...seoData,
      ogUrl: currentUrl,
      canonicalUrl: seoData.canonicalUrl || currentUrl,
      ogImage: seoData.ogImage ? `${baseUrl}${seoData.ogImage}` : undefined
    });

    // Cleanup function to restore default title when component unmounts
    return () => {
      document.title = "Christian Children's Books by Maggie | Faith-Based Stories";
    };
  }, [seoData]);
};

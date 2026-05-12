'use client';

import { useEffect } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';

const API_URL = `${API_BASE_URL}/api/analytics`;

export default function AnalyticsTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 1. Get or Create Visitor ID
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitor_id', visitorId);
        }

        // 2. Send tracking request
        await fetch(`${API_URL}/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ visitorId }),
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);

  return null;
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  AnalyticsTracker,
  PageViewCommand,
  ButtonClickCommand,
  FormSubmitCommand,
} from "@/lib/analytics-command";

/**
 * Custom hook for tracking analytics events using the Command Pattern
 * This hook provides a clean API for tracking different types of events
 */
export function useAnalytics() {
  const { user } = useUser();
  const [tracker] = useState(() => AnalyticsTracker.getInstance());
  const userId = user?.id;

  // Track page views automatically
  useEffect(() => {
    const trackPageView = () => {
      if (typeof window !== "undefined") {
        const pageName = window.location.pathname;
        tracker.trackEvent(new PageViewCommand(pageName, userId));
      }
    };

    // Track initial page view
    trackPageView();

    // Set up tracking for subsequent route changes
    window.addEventListener("popstate", trackPageView);

    return () => {
      window.removeEventListener("popstate", trackPageView);
    };
  }, [tracker, userId]);

  // Method to track button clicks
  const trackButtonClick = useCallback(
    (buttonId: string, actionName: string) => {
      tracker.trackEvent(new ButtonClickCommand(buttonId, actionName, userId));
    },
    [tracker, userId]
  );

  // Method to track form submissions
  const trackFormSubmit = useCallback(
    (formId: string, formData: Record<string, unknown>) => {
      tracker.trackEvent(new FormSubmitCommand(formId, formData, userId));
    },
    [tracker, userId]
  );

  return {
    trackButtonClick,
    trackFormSubmit,
  };
}

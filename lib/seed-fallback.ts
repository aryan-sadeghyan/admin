"use client";

import { useEffect } from "react";

/**
 * Simple hook to show a notification when using demo mode
 * This is only used in portfolio demonstrations when the database is not available
 */
export function useDemoData() {
  useEffect(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      // Check if we've already shown the notification
      const hasShownNotification = sessionStorage.getItem(
        "demo_notification_shown"
      );

      if (!hasShownNotification) {
        // Show a notification to the user
        console.info(
          "💡 Database Fallback Mode: Using demo data for portfolio demonstration"
        );

        // Mark that we've shown the notification
        sessionStorage.setItem("demo_notification_shown", "true");
      }
    }
  }, []);
}

/**
 * Command Pattern Implementation for Analytics
 * This provides a flexible and decoupled way to track analytics events
 */

// Command interface
export interface AnalyticsCommand {
  execute(): Promise<void>;
}

// Concrete Commands
export class PageViewCommand implements AnalyticsCommand {
  constructor(private pageName: string, private userId?: string) {}

  async execute(): Promise<void> {
    try {
      console.log(
        `Tracking page view: ${this.pageName} for user: ${
          this.userId || "anonymous"
        }`
      );
      // In a production environment, you would make an API call here
      // await fetch('/api/analytics/pageview', { method: 'POST', body: JSON.stringify({ page: this.pageName, userId: this.userId }) });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }
}

export class ButtonClickCommand implements AnalyticsCommand {
  constructor(
    private buttonId: string,
    private actionName: string,
    private userId?: string
  ) {}

  async execute(): Promise<void> {
    try {
      console.log(
        `Tracking button click: ${this.buttonId} with action: ${this.actionName}`
      );
      // In a production environment, you would make an API call here
      // await fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify({ type: 'button_click', buttonId: this.buttonId, action: this.actionName, userId: this.userId }) });
    } catch (error) {
      console.error("Failed to track button click:", error);
    }
  }
}

export class FormSubmitCommand implements AnalyticsCommand {
  constructor(
    private formId: string,
    private formData: Record<string, unknown>,
    private userId?: string
  ) {}

  async execute(): Promise<void> {
    try {
      console.log(`Tracking form submission: ${this.formId}`);
      // In a production environment, you would make an API call here and handle sensitive data appropriately
      // const safeFormData = this.sanitizeFormData(this.formData);
      // await fetch('/api/analytics/form', { method: 'POST', body: JSON.stringify({ formId: this.formId, data: safeFormData, userId: this.userId }) });
    } catch (error) {
      console.error("Failed to track form submission:", error);
    }
  }

  // Remove sensitive information before tracking
  private sanitizeFormData(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const sensitiveFields = ["password", "credit_card", "ssn", "secret"];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}

// Invoker class
export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private queue: AnalyticsCommand[] = [];
  private processingQueue = false;

  private constructor() {}

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  public trackEvent(command: AnalyticsCommand): void {
    this.queue.push(command);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.queue.length === 0) return;

    this.processingQueue = true;

    try {
      const command = this.queue.shift()!;
      await command.execute();
    } catch (error) {
      console.error("Error processing analytics command:", error);
    } finally {
      this.processingQueue = false;
      if (this.queue.length > 0) {
        // Continue processing remaining commands
        this.processQueue();
      }
    }
  }
}

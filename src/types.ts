export interface KlaviyoCampaign {
  id: string;
  type: string;
  attributes: {
    name: string;
    status: string;
    archived: boolean;
    created_at: string;
    updated_at: string;
    send_time?: string;
    scheduled_at?: string;
    audiences?: {
      included?: string[];
      excluded?: string[];
    };
  };
}

export interface CampaignMessage {
  id: string;
  type: string;
  attributes: {
    label: string;
    channel: string;
    content: {
      subject?: string;
      preview_text?: string;
      from_email?: string;
      from_label?: string;
      html?: string;
      plain_text?: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface CampaignMetrics {
  recipients: number;
  opens: number;
  clicks: number;
  unique_opens: number;
  unique_clicks: number;
  bounces: number;
  unsubscribes: number;
  spam_complaints: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
}

export interface CampaignReport {
  campaign: KlaviyoCampaign;
  message?: CampaignMessage;
  metrics?: CampaignMetrics;
  html_content?: string;
}

export interface KlaviyoApiResponse<T> {
  data: T;
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
}

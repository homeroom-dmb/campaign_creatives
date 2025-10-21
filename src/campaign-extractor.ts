import { KlaviyoClient } from './klaviyo-client';
import { CampaignReport, CampaignMetrics } from './types';

export class CampaignExtractor {
  private client: KlaviyoClient;

  constructor(apiKey: string) {
    this.client = new KlaviyoClient(apiKey);
  }

  /**
   * Extract campaign data with performance metrics
   */
  async extractCampaign(campaignId: string): Promise<CampaignReport> {
    console.log(`Extracting campaign: ${campaignId}`);

    // Fetch campaign details
    const campaign = await this.client.getCampaign(campaignId);
    console.log(`  - Campaign: ${campaign.attributes.name}`);

    // Fetch campaign messages (HTML content)
    let message;
    let html_content;
    try {
      const messages = await this.client.getCampaignMessages(campaignId);
      if (messages.length > 0) {
        message = messages[0];
        html_content = message.attributes.content.html;
        console.log(`  - Found message with HTML content`);
      }
    } catch (error) {
      console.warn(`  - Could not fetch messages for campaign ${campaignId}`);
    }

    // Fetch metrics
    let metrics: CampaignMetrics | undefined;
    try {
      const metricsData = await this.client.getCampaignMetrics(campaignId);
      if (metricsData && metricsData.attributes) {
        const data = metricsData.attributes.data;
        metrics = this.parseMetrics(data);
        console.log(`  - Metrics: ${metrics.recipients} recipients, ${metrics.open_rate}% open rate`);
      }
    } catch (error) {
      console.warn(`  - Could not fetch metrics for campaign ${campaignId}`);
    }

    return {
      campaign,
      message,
      metrics,
      html_content,
    };
  }

  /**
   * Extract all campaigns with optional filter
   */
  async extractAllCampaigns(options: {
    filter?: string;
    limit?: number;
  } = {}): Promise<CampaignReport[]> {
    console.log('Fetching all campaigns...');
    const campaigns = await this.client.getCampaigns({
      filter: options.filter,
      page_size: options.limit || 50,
    });

    console.log(`Found ${campaigns.length} campaigns`);
    const reports: CampaignReport[] = [];

    for (const campaign of campaigns) {
      try {
        const report = await this.extractCampaign(campaign.id);
        reports.push(report);
      } catch (error: any) {
        console.error(`Failed to extract campaign ${campaign.id}:`, error.message);
      }
    }

    return reports;
  }

  /**
   * Parse metrics from Klaviyo API response
   */
  private parseMetrics(data: any): CampaignMetrics {
    const recipients = data.recipients || 0;
    const opens = data.opens || 0;
    const clicks = data.clicks || 0;
    const unique_opens = data.unique_opens || 0;
    const unique_clicks = data.unique_clicks || 0;
    const bounces = data.bounces || 0;
    const unsubscribes = data.unsubscribes || 0;
    const spam_complaints = data.spam_complaints || 0;

    return {
      recipients,
      opens,
      clicks,
      unique_opens,
      unique_clicks,
      bounces,
      unsubscribes,
      spam_complaints,
      open_rate: recipients > 0 ? (unique_opens / recipients) * 100 : 0,
      click_rate: recipients > 0 ? (unique_clicks / recipients) * 100 : 0,
      bounce_rate: recipients > 0 ? (bounces / recipients) * 100 : 0,
      unsubscribe_rate: recipients > 0 ? (unsubscribes / recipients) * 100 : 0,
    };
  }
}

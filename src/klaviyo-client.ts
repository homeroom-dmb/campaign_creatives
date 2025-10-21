import axios, { AxiosInstance } from 'axios';
import { KlaviyoCampaign, CampaignMessage, KlaviyoApiResponse } from './types';

export class KlaviyoClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://a.klaviyo.com/api',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch all campaigns from Klaviyo
   */
  async getCampaigns(options: {
    filter?: string;
    page_size?: number;
  } = {}): Promise<KlaviyoCampaign[]> {
    try {
      const params: any = {
        'page[size]': options.page_size || 50,
      };

      if (options.filter) {
        params.filter = options.filter;
      }

      const response = await this.client.get<KlaviyoApiResponse<KlaviyoCampaign[]>>('/campaigns', {
        params,
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching campaigns:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a specific campaign by ID
   */
  async getCampaign(campaignId: string): Promise<KlaviyoCampaign> {
    try {
      const response = await this.client.get<KlaviyoApiResponse<KlaviyoCampaign>>(
        `/campaigns/${campaignId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching campaign ${campaignId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get campaign messages (email content)
   */
  async getCampaignMessages(campaignId: string): Promise<CampaignMessage[]> {
    try {
      const response = await this.client.get<KlaviyoApiResponse<CampaignMessage[]>>(
        `/campaigns/${campaignId}/campaign-messages`
      );
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching messages for campaign ${campaignId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get campaign metrics/statistics
   */
  async getCampaignMetrics(campaignId: string): Promise<any> {
    try {
      // Fetch campaign values-reports for metrics
      const response = await this.client.get(
        `/campaign-values-reports/${campaignId}/campaign-values-report-data`,
        {
          params: {
            'fields[campaign-values-report]': 'data',
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      // If metrics aren't available, return null
      if (error.response?.status === 404) {
        console.warn(`No metrics found for campaign ${campaignId}`);
        return null;
      }
      console.error(`Error fetching metrics for campaign ${campaignId}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

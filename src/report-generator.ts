import * as fs from 'fs';
import * as path from 'path';
import { CampaignReport } from './types';
import puppeteer from 'puppeteer';

export class ReportGenerator {
  private outputDir: string;

  constructor(outputDir: string = './reports') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate HTML report for campaigns
   */
  async generateHTMLReport(reports: CampaignReport[]): Promise<string> {
    const html = this.buildReportHTML(reports);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `campaign-report-${timestamp}.html`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, html, 'utf-8');
    console.log(`HTML report saved to: ${filepath}`);

    return filepath;
  }

  /**
   * Generate PDF report for campaigns
   */
  async generatePDFReport(reports: CampaignReport[]): Promise<string> {
    const html = this.buildReportHTML(reports);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `campaign-report-${timestamp}.pdf`;
    const filepath = path.join(this.outputDir, filename);

    // Use puppeteer to render HTML to PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();
    console.log(`PDF report saved to: ${filepath}`);

    return filepath;
  }

  /**
   * Save individual campaign HTML renders
   */
  async saveIndividualCampaignRenders(reports: CampaignReport[]): Promise<void> {
    const rendersDir = path.join(this.outputDir, 'campaign-renders');
    if (!fs.existsSync(rendersDir)) {
      fs.mkdirSync(rendersDir, { recursive: true });
    }

    for (const report of reports) {
      if (report.html_content) {
        const safeName = report.campaign.attributes.name
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase();
        const filename = `${report.campaign.id}_${safeName}.html`;
        const filepath = path.join(rendersDir, filename);

        fs.writeFileSync(filepath, report.html_content, 'utf-8');
        console.log(`  - Saved campaign render: ${filename}`);
      }
    }
  }

  /**
   * Build comprehensive HTML report
   */
  private buildReportHTML(reports: CampaignReport[]): string {
    const timestamp = new Date().toLocaleString();

    const campaignSections = reports.map(report => {
      const { campaign, metrics, html_content } = report;
      const name = campaign.attributes.name;
      const status = campaign.attributes.status;
      const sendTime = campaign.attributes.send_time
        ? new Date(campaign.attributes.send_time).toLocaleString()
        : 'Not sent';

      const metricsHTML = metrics ? `
        <div class="metrics">
          <h3>Performance Metrics</h3>
          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-label">Recipients</div>
              <div class="metric-value">${metrics.recipients.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Unique Opens</div>
              <div class="metric-value">${metrics.unique_opens.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Unique Clicks</div>
              <div class="metric-value">${metrics.unique_clicks.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Open Rate</div>
              <div class="metric-value">${metrics.open_rate.toFixed(2)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Click Rate</div>
              <div class="metric-value">${metrics.click_rate.toFixed(2)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Bounce Rate</div>
              <div class="metric-value">${metrics.bounce_rate.toFixed(2)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Unsubscribes</div>
              <div class="metric-value">${metrics.unsubscribes.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Spam Complaints</div>
              <div class="metric-value">${metrics.spam_complaints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ` : '<p class="no-metrics">No metrics available for this campaign</p>';

      const renderHTML = html_content ? `
        <div class="campaign-render">
          <h3>Campaign Render</h3>
          <div class="render-container">
            <iframe srcdoc="${this.escapeHTML(html_content)}"
                    style="width: 100%; min-height: 600px; border: 1px solid #ddd; border-radius: 4px;"></iframe>
          </div>
        </div>
      ` : '<p class="no-render">No HTML content available for this campaign</p>';

      return `
        <div class="campaign-section">
          <div class="campaign-header">
            <h2>${this.escapeHTML(name)}</h2>
            <div class="campaign-meta">
              <span class="status status-${status}">${status}</span>
              <span class="send-time">Sent: ${sendTime}</span>
            </div>
          </div>
          ${metricsHTML}
          ${renderHTML}
        </div>
      `;
    }).join('\n');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Klaviyo Campaign Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #1a1a1a;
    }

    .report-meta {
      color: #666;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .campaign-section {
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 1px solid #eee;
    }

    .campaign-section:last-child {
      border-bottom: none;
    }

    .campaign-header {
      margin-bottom: 30px;
    }

    .campaign-header h2 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #1a1a1a;
    }

    .campaign-meta {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .status {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-sent {
      background: #d4edda;
      color: #155724;
    }

    .status-draft {
      background: #fff3cd;
      color: #856404;
    }

    .status-scheduled {
      background: #cce5ff;
      color: #004085;
    }

    .send-time {
      color: #666;
      font-size: 14px;
    }

    .metrics {
      margin-bottom: 30px;
    }

    .metrics h3 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #1a1a1a;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }

    .metric {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
    }

    .metric-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .no-metrics, .no-render {
      color: #999;
      font-style: italic;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .campaign-render {
      margin-top: 30px;
    }

    .campaign-render h3 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #1a1a1a;
    }

    .render-container {
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        padding: 20px;
      }

      .campaign-section {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Klaviyo Campaign Performance Report</h1>
    <div class="report-meta">
      <p>Generated on: ${timestamp}</p>
      <p>Total Campaigns: ${reports.length}</p>
    </div>

    ${campaignSections}
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Escape HTML for safe embedding
   */
  private escapeHTML(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

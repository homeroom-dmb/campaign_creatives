# Klaviyo Campaign Reporter

A Node.js application that integrates with the Klaviyo API to extract campaign performance data and render campaign HTML for comprehensive reporting.

## Features

- **Campaign Data Extraction**: Fetch all campaigns or specific campaigns from Klaviyo
- **Performance Metrics**: Extract detailed campaign performance metrics including:
  - Recipients, Opens, Clicks
  - Open rate, Click rate, Bounce rate
  - Unsubscribes and Spam complaints
- **HTML Rendering**: Extract and render campaign HTML content
- **Report Generation**: Generate beautiful HTML or PDF reports with:
  - Campaign performance metrics
  - Embedded campaign HTML renders
  - Professional styling and layout
- **Individual Campaign Exports**: Save individual campaign HTML renders for archival

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Klaviyo Private API Key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campaign_creatives
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Klaviyo API key:
```env
KLAVIYO_API_KEY=your_private_api_key_here
OUTPUT_DIR=./reports
OUTPUT_FORMAT=pdf
```

## Getting Your Klaviyo API Key

1. Log in to your Klaviyo account
2. Go to **Settings** → **API Keys**
3. Create a new **Private API Key** with the following scopes:
   - `campaigns:read`
   - `campaign-values-reports:read`
4. Copy the API key and paste it into your `.env` file

## Usage

### Generate Reports

Run the application to generate campaign reports:

```bash
npm run generate-report
```

This will:
1. Fetch campaigns from Klaviyo
2. Extract performance metrics for each campaign
3. Download campaign HTML content
4. Generate a comprehensive report
5. Save individual campaign HTML renders

### Configuration Options

Edit your `.env` file to customize the behavior:

- `OUTPUT_FORMAT`: Choose output format
  - `pdf` - Generate PDF report (default)
  - `html` - Generate HTML report
  - `both` - Generate both HTML and PDF reports

- `OUTPUT_DIR`: Specify where reports are saved (default: `./reports`)

### Development

Build the TypeScript code:
```bash
npm run build
```

Run the built application:
```bash
npm start
```

Run in development mode with ts-node:
```bash
npm run dev
```

## Project Structure

```
campaign_creatives/
├── src/
│   ├── index.ts              # Main application entry point
│   ├── config.ts             # Configuration loading
│   ├── types.ts              # TypeScript type definitions
│   ├── klaviyo-client.ts     # Klaviyo API client
│   ├── campaign-extractor.ts # Campaign data extraction logic
│   └── report-generator.ts   # Report generation (HTML/PDF)
├── reports/                  # Generated reports (created automatically)
│   └── campaign-renders/     # Individual campaign HTML renders
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## API Reference

### KlaviyoClient

The Klaviyo API client provides methods to interact with the Klaviyo API:

- `getCampaigns(options)` - Fetch all campaigns
- `getCampaign(campaignId)` - Get a specific campaign
- `getCampaignMessages(campaignId)` - Get campaign email content
- `getCampaignMetrics(campaignId)` - Get campaign performance metrics

### CampaignExtractor

Extracts and processes campaign data:

- `extractCampaign(campaignId)` - Extract a single campaign with metrics
- `extractAllCampaigns(options)` - Extract multiple campaigns

### ReportGenerator

Generates reports from campaign data:

- `generateHTMLReport(reports)` - Create HTML report
- `generatePDFReport(reports)` - Create PDF report
- `saveIndividualCampaignRenders(reports)` - Save individual campaign HTML files

## Customization

### Filter Campaigns

Edit `src/index.ts` to add campaign filters:

```typescript
const reports = await extractor.extractAllCampaigns({
  filter: 'equals(status,"sent")', // Only fetch sent campaigns
  limit: 20, // Limit number of campaigns
});
```

### Campaign Limit

Adjust the `limit` parameter in `src/index.ts` to control how many campaigns are fetched:

```typescript
const reports = await extractor.extractAllCampaigns({
  limit: 50, // Fetch up to 50 campaigns
});
```

## Output

The application generates:

1. **Main Report** (`reports/campaign-report-TIMESTAMP.pdf` or `.html`):
   - Summary of all campaigns
   - Performance metrics for each campaign
   - Embedded HTML renders of each campaign

2. **Individual Campaign Renders** (`reports/campaign-renders/`):
   - Separate HTML file for each campaign
   - Named by campaign ID and name

## Troubleshooting

### "KLAVIYO_API_KEY environment variable is required"

Make sure you've created a `.env` file with your Klaviyo API key:
```env
KLAVIYO_API_KEY=your_actual_api_key_here
```

### "No metrics found for campaign"

Some campaigns may not have metrics if they:
- Haven't been sent yet (draft status)
- Were recently sent (metrics may take time to populate)
- Were archived before sending

### Puppeteer Installation Issues

If you encounter issues with Puppeteer on Linux, you may need to install additional dependencies:

```bash
# Debian/Ubuntu
sudo apt-get install -y chromium-browser

# Or use the bundled Chromium
npm install puppeteer --unsafe-perm=true
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

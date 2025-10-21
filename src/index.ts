import { loadConfig } from './config';
import { CampaignExtractor } from './campaign-extractor';
import { ReportGenerator } from './report-generator';

async function main() {
  console.log('=== Klaviyo Campaign Reporter ===\n');

  try {
    // Load configuration
    const config = loadConfig();
    console.log('Configuration loaded successfully\n');

    // Initialize extractor and generator
    const extractor = new CampaignExtractor(config.klaviyoApiKey);
    const generator = new ReportGenerator(config.outputDir);

    // Extract campaign data
    console.log('Extracting campaign data from Klaviyo...\n');
    const reports = await extractor.extractAllCampaigns({
      // You can add filters here, e.g.:
      // filter: 'equals(status,"sent")',
      limit: 10, // Adjust as needed
    });

    console.log(`\nSuccessfully extracted ${reports.length} campaigns\n`);

    // Save individual campaign renders
    console.log('Saving individual campaign HTML renders...');
    await generator.saveIndividualCampaignRenders(reports);

    // Generate reports based on configuration
    console.log('\nGenerating reports...');

    if (config.outputFormat === 'html' || config.outputFormat === 'both') {
      const htmlPath = await generator.generateHTMLReport(reports);
      console.log(`HTML report: ${htmlPath}`);
    }

    if (config.outputFormat === 'pdf' || config.outputFormat === 'both') {
      const pdfPath = await generator.generatePDFReport(reports);
      console.log(`PDF report: ${pdfPath}`);
    }

    console.log('\n✓ Report generation complete!');

  } catch (error: any) {
    console.error('\n✗ Error:', error.message);

    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }

    process.exit(1);
  }
}

// Run the main function
main();

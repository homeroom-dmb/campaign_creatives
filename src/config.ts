import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

export interface Config {
  klaviyoApiKey: string;
  outputDir: string;
  outputFormat: 'html' | 'pdf' | 'both';
}

export function loadConfig(): Config {
  const klaviyoApiKey = process.env.KLAVIYO_API_KEY;

  if (!klaviyoApiKey) {
    throw new Error('KLAVIYO_API_KEY environment variable is required. Please set it in your .env file.');
  }

  const outputDir = process.env.OUTPUT_DIR || './reports';
  const outputFormat = (process.env.OUTPUT_FORMAT as 'html' | 'pdf' | 'both') || 'pdf';

  return {
    klaviyoApiKey,
    outputDir,
    outputFormat,
  };
}

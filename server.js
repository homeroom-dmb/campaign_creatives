// Simple Express server for serving the web interface
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-interface.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Klaviyo Campaign Reporter - Web Interface                ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running at: http://localhost:${PORT}

📝 Open your browser and navigate to the URL above to:
   - Enter your Klaviyo API key
   - Generate campaign reports
   - Download campaign HTML renders
   - Export reports in HTML/JSON format

Press Ctrl+C to stop the server.
  `);
});

# No-Code Testing Guide

This guide provides multiple ways to test the Klaviyo Campaign Reporter **without writing any code or setting up a development environment**.

## Option 1: Browser-Only (Easiest - No Installation)

Just open the HTML file in your browser!

### Steps:

1. **Download the file**: Get `web-interface.html` from this repository
2. **Open in browser**: Double-click `web-interface.html` or drag it into your browser
3. **Enter your Klaviyo API key**: Paste your private API key from Klaviyo
4. **Generate report**: Click the button and watch the magic happen!

### Features:
- ✅ No installation required
- ✅ Works 100% in your browser
- ✅ Your API key never leaves your computer
- ✅ Download individual campaign HTML files
- ✅ Export reports as HTML or JSON

### Getting Your API Key:
1. Log into Klaviyo
2. Go to Settings → API Keys
3. Create a Private API Key with these permissions:
   - `campaigns:read`
   - `campaign-values-reports:read`
4. Copy the key and paste it in the web interface

---

## Option 2: Replit (Online IDE - No Installation)

Test the full application in an online environment.

### Steps:

1. **Go to Replit**: Visit [replit.com](https://replit.com)
2. **Create account**: Sign up (free)
3. **Import repository**:
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Paste this repository URL
4. **Set environment variables**:
   - Click "Secrets" (lock icon) in left sidebar
   - Add key: `KLAVIYO_API_KEY`, value: your API key
5. **Run the app**:
   - Click the "Run" button
   - Choose to run `npm run web` for the web interface
   - Or run `npm run generate-report` for CLI mode

### Features:
- ✅ Full Node.js environment
- ✅ Can test both CLI and web versions
- ✅ Generate PDF reports
- ✅ No local installation needed

---

## Option 3: CodeSandbox (Online IDE - Instant Setup)

Similar to Replit but with instant preview.

### Steps:

1. **Go to CodeSandbox**: Visit [codesandbox.io](https://codesandbox.io)
2. **Import from GitHub**:
   - Click "Import from GitHub"
   - Paste this repository URL
3. **Install dependencies**: CodeSandbox auto-installs packages
4. **Add API key**:
   - Create `.env` file
   - Add: `KLAVIYO_API_KEY=your_key_here`
5. **Run web interface**:
   - Open terminal
   - Run: `npm run web`
   - Preview opens automatically

### Features:
- ✅ Instant setup
- ✅ Live preview
- ✅ Built-in terminal
- ✅ No local installation

---

## Option 4: Docker (One Command - Local)

If you have Docker installed, this is the easiest local option.

### Steps:

1. **Download this repository**
2. **Open terminal** in the repository folder
3. **Run one command**:
   ```bash
   docker-compose up
   ```
4. **Open browser**: Navigate to `http://localhost:3000`
5. **Use web interface**: Enter your API key and generate reports

### Features:
- ✅ One command to run
- ✅ No Node.js installation needed
- ✅ Isolated environment
- ✅ Easy cleanup

---

## Option 5: Glitch (Remix & Run)

Perfect for quick testing and sharing.

### Steps:

1. **Go to Glitch**: Visit [glitch.com](https://glitch.com)
2. **Import from GitHub**:
   - Click "New Project"
   - Select "Import from GitHub"
   - Paste repository URL
3. **Set environment**:
   - Click `.env` file
   - Add: `KLAVIYO_API_KEY=your_key_here`
4. **App auto-runs**: Glitch automatically runs your app
5. **Click "Show"**: Opens the web interface

### Features:
- ✅ Auto-runs on import
- ✅ Easy sharing (get a public URL)
- ✅ Live editing
- ✅ Free hosting

---

## Option 6: Railway / Render (Cloud Deployment)

Deploy to the cloud with a few clicks.

### Railway:

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub and select the repository
4. Add environment variable: `KLAVIYO_API_KEY`
5. Railway auto-deploys and gives you a URL

### Render:

1. Visit [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Add environment variable: `KLAVIYO_API_KEY`
5. Click "Create Web Service"

### Features:
- ✅ Real deployment (shareable URL)
- ✅ Auto-deploys on git push
- ✅ Free tier available
- ✅ HTTPS included

---

## Comparison Table

| Option | Installation | Speed | Features | Best For |
|--------|--------------|-------|----------|----------|
| **Browser-Only** | None | Instant | Basic | Quick testing |
| **Replit** | Account only | 1 min | Full | Learning & testing |
| **CodeSandbox** | Account only | Instant | Full | Development |
| **Docker** | Docker only | 1 min | Full | Local isolated testing |
| **Glitch** | Account only | Instant | Full | Sharing demos |
| **Railway/Render** | Account only | 2 min | Full | Production deployment |

---

## Recommended Path for Different Users

### "I just want to see if it works"
→ **Browser-Only** (Option 1)

### "I want to test all features"
→ **Replit** (Option 2) or **CodeSandbox** (Option 3)

### "I want to deploy for my team"
→ **Railway** or **Render** (Option 6)

### "I have Docker installed"
→ **Docker** (Option 4)

---

## Troubleshooting

### CORS Errors in Browser
The browser-only version calls Klaviyo API directly. If you get CORS errors:
- Use Option 2-6 instead (they run server-side)
- Or use a CORS browser extension for testing

### API Key Invalid
- Make sure you're using a **Private API Key** (starts with `pk_`)
- Ensure the key has `campaigns:read` and `campaign-values-reports:read` permissions
- Check that the key hasn't expired

### No Campaigns Showing
- Verify you have campaigns in your Klaviyo account
- Check that campaigns have been sent (draft campaigns may not have metrics)
- Try increasing the campaign limit

---

## Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Review Klaviyo API documentation

Happy reporting!

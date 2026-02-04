import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint for Fly.io monitoring
app.get('/health', (req, res) => {
  res.status(200).send('Infrastructure Optimal');
});

// Serve static files from the current directory (dist in production)
app.use(express.static(__dirname));

// Handle SPA routing - redirect all non-file requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BIMNP OS Infrastructure active on port ${PORT}`);
});
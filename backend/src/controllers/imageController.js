const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Ensure cache directory exists
const cacheDir = path.join(__dirname, '../../.cache/images');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const getProxyImage = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    // Generate a secure hash of the URL to use as filename
    const hash = crypto.createHash('md5').update(url).digest('hex');
    
    // We try to guess the extension from the URL, defaulting to .jpg
    let ext = '.jpg';
    if (url.includes('.png')) ext = '.png';
    else if (url.includes('.gif')) ext = '.gif';
    else if (url.includes('.webp')) ext = '.webp';
    
    // Some urls like loremflickr might not have an extension, so we use the hash
    const filename = `${hash}${ext}`;
    const filePath = path.join(cacheDir, filename);

    // 1. Check if the file already exists in our local cache
    if (fs.existsSync(filePath)) {
      // CACHE HIT: Serve the local file
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Tell browser to cache for 1 year
      return res.sendFile(filePath);
    }

    // 2. CACHE MISS: Fetch from the remote URL
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      // Handle redirects (loremflickr redirects to the actual photo URL)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (!redirectUrl.startsWith('http')) {
             redirectUrl = new URL(redirectUrl, url).href;
        }
        
        // Follow the redirect (just 1 level deep for simplicity)
        const redirectClient = redirectUrl.startsWith('https') ? https : http;
        redirectClient.get(redirectUrl, (redirectResponse) => {
            if (redirectResponse.statusCode !== 200) {
              return res.status(redirectResponse.statusCode).json({ message: 'Failed to fetch redirected image' });
            }
            saveAndServe(redirectResponse, filePath, res);
        }).on('error', (err) => {
          console.error('Error fetching redirected image:', err);
          res.status(500).json({ message: 'Error fetching redirected image' });
        });
        return;
      }

      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ message: 'Failed to fetch image from source' });
      }

      saveAndServe(response, filePath, res);

    }).on('error', (err) => {
      console.error('Error fetching image:', err);
      res.status(500).json({ message: 'Error proxying image' });
    });

  } catch (error) {
    console.error('Proxy Image Error:', error);
    res.status(500).json({ message: 'Server error while proxying image' });
  }
};

// Helper function to save the stream to disk and pipe it to the response
function saveAndServe(responseStream, filePath, res) {
  // Set appropriate headers
  const contentType = responseStream.headers['content-type'];
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
  res.setHeader('Cache-Control', 'public, max-age=31536000');

  // Create write stream to save locally
  const fileStream = fs.createWriteStream(filePath);
  
  // Pipe the incoming data to BOTH the file array and the client response
  responseStream.pipe(fileStream);
  responseStream.pipe(res);
  
  fileStream.on('error', (err) => {
    console.error('Error saving cached image:', err);
    // Even if saving fails, the client still gets the image stream
  });
}

module.exports = {
  getProxyImage
};

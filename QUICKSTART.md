# Quick Start Guide - PDF Compressor Frontend

## What's Been Built

A complete web-based PDF compression application with:
- ✅ Drag-and-drop file upload
- ✅ 1GB file size limit
- ✅ Three compression levels (low, recommended, extreme)
- ✅ Realistic progress bar based on file size
- ✅ Automatic download of compressed files
- ✅ Compression statistics display
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling and validation

## Installation

1. **Install the new dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - `express` - Web server
   - `multer` - File upload handling
   - `cors` - Cross-origin support

2. **Ensure your `.env` file has API credentials:**
   ```
   PUBLIC_KEY=your_public_key_here
   SECRET_KEY=your_secret_key_here
   ```

## Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   Navigate to: `http://localhost:3000`

3. **Use the application:**
   - Drag and drop a PDF file or click to browse
   - Select compression level (recommended is default)
   - Click "Compress PDF"
   - Watch the progress bar
   - File downloads automatically when complete

## Project Structure

```
pdf-compressor/
├── public/                    # Frontend files
│   ├── index.html            # Main HTML page
│   ├── css/
│   │   └── styles.css        # All styling
│   └── js/
│       └── app.js            # Frontend logic
├── uploads/                   # Temporary upload storage (auto-created)
├── compressed/                # Temporary compressed files (auto-created)
├── server.js                  # Express server + API endpoints
├── index.js                   # Original CLI version (still works)
├── .env                       # API credentials
└── package.json              # Dependencies
```

## API Endpoints

### POST /api/compress
Compresses a PDF file.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `pdf` (file): PDF file to compress
  - `compressionLevel` (string): 'low' | 'recommended' | 'extreme'

**Response:**
- Success: Compressed PDF file (binary stream)
- Headers include compression statistics
- Error: JSON with error message

### GET /api/health
Health check endpoint to verify server is running.

## Features Explained

### Realistic Progress Bar
The progress bar is divided into three phases:
- **Upload (0-30%)**: Based on file size, simulates upload time
- **Processing (30-90%)**: Estimated based on file size (larger files = longer)
- **Download (90-100%)**: Final preparation and download

### File Size Handling
- Maximum file size: 1GB (1,073,741,824 bytes)
- Validation on both client and server
- Streaming for efficient memory usage
- Automatic cleanup of temporary files

### Compression Levels
- **Low**: Light compression, maintains best quality
- **Recommended**: Balanced compression (default)
- **Extreme**: Maximum compression, smallest file size

### Error Handling
The app handles:
- Invalid file types (non-PDF)
- Files exceeding 1GB
- Network errors
- API errors
- Server errors

## Testing the Application

1. **Test with small PDF (< 1MB):**
   - Should compress quickly
   - Progress bar moves smoothly

2. **Test with medium PDF (10-50MB):**
   - Progress bar should show realistic timing
   - Processing takes a bit longer

3. **Test with large PDF (100MB+):**
   - Upload phase is more noticeable
   - Processing time increases proportionally

4. **Test error cases:**
   - Try uploading a non-PDF file
   - Try uploading a file > 1GB (if you have one)
   - Cancel during processing

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify `.env` file exists with valid API keys
- Run `npm install` to ensure dependencies are installed

### File upload fails
- Check file is actually a PDF
- Verify file size is under 1GB
- Check browser console for errors

### Compression fails
- Verify API credentials in `.env` are correct
- Check server console for error messages
- Ensure you have internet connection (API is cloud-based)

### Download doesn't work
- Check browser's download settings
- Try clicking "Download" button manually
- Check browser console for errors

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Support

The application is fully responsive and works on:
- iOS Safari
- Android Chrome
- Mobile browsers

## Security Notes

- Files are temporarily stored on server during processing
- Files are automatically deleted after compression
- Maximum 1GB file size prevents abuse
- File type validation on both client and server
- CORS enabled for development (configure for production)

## Production Deployment

Before deploying to production:

1. **Set environment variable for port:**
   ```
   PORT=3000
   ```

2. **Configure CORS properly:**
   Edit `server.js` to restrict origins:
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

3. **Use HTTPS:**
   Configure SSL certificates

4. **Add rate limiting:**
   Install and configure `express-rate-limit`

5. **Set up monitoring:**
   Add logging and error tracking

6. **Configure file cleanup:**
   Set up cron job to clean old files

## Next Steps

You can now:
- Customize the styling in `public/css/styles.css`
- Modify compression options
- Add more features (batch processing, user accounts, etc.)
- Deploy to a hosting service

## Need Help?

- Check the browser console for errors
- Check the server console for backend errors
- Review `TROUBLESHOOTING.md` for common issues
- Review `FRONTEND_SPECIFICATION.md` for detailed documentation

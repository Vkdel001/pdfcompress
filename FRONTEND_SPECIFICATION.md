# Frontend Specification for PDF Compressor

## Project Overview

Create a web-based frontend interface for the PDF compression application that allows users to upload PDF files, monitor compression progress, and download the compressed output.

## Current Backend Capabilities

- Accepts PDF files for compression via iLovePDF API
- Supports three compression levels: `low`, `recommended`, `extreme`
- Processes files and returns compressed versions
- Currently CLI-based with hardcoded file paths

## Frontend Requirements

### 1. User Interface Components

#### 1.1 File Upload Area
- **Drag-and-drop zone** for PDF files
- **Browse button** as alternative upload method
- **File type validation**: Accept only `.pdf` files
- **File size validation**: Maximum 1GB (1,073,741,824 bytes)
- **Visual feedback**: 
  - Highlight drop zone on drag-over
  - Show file name and size after selection
  - Display error messages for invalid files

#### 1.2 Compression Settings
- **Compression level selector** (radio buttons or dropdown):
  - Low - Light compression, best quality
  - Recommended - Balanced compression (default)
  - Extreme - Maximum compression, smaller file size
- **Clear visual indication** of selected level

#### 1.3 Progress Indicator
- **Realistic progress bar** based on file size and processing stages:
  - Upload phase: 0-30% (proportional to file size)
  - Processing phase: 30-90% (estimated based on file size)
  - Download phase: 90-100%
- **Status messages**:
  - "Uploading file..."
  - "Compressing PDF..."
  - "Preparing download..."
  - "Complete!"
- **Percentage display**: Show numeric progress (e.g., "45%")
- **Estimated time remaining** (optional but recommended)
- **Cancel button** to abort operation

#### 1.4 Results Display
- **Compression statistics**:
  - Original file size
  - Compressed file size
  - Space saved (percentage and MB/KB)
- **Automatic download** of compressed file
- **Download button** as fallback if auto-download fails
- **Reset/Upload Another** button to start over

#### 1.5 Error Handling
- **User-friendly error messages** for:
  - File too large (>1GB)
  - Invalid file type (not PDF)
  - Network errors
  - API errors
  - Server errors
- **Retry option** for failed operations

### 2. Technical Architecture

#### 2.1 Backend Modifications Required

**Convert to Express.js Server:**

```javascript
// New structure needed in index.js or separate server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1073741824 } // 1GB
});

app.use(cors());
app.use(express.static('public'));

// Endpoint for PDF compression
app.post('/api/compress', upload.single('pdf'), async (req, res) => {
  // Compression logic here
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Required npm packages to add:**
- `express` - Web server framework
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing

#### 2.2 API Endpoints

**POST /api/compress**
- **Request**: 
  - Content-Type: `multipart/form-data`
  - Body: 
    - `pdf` (file): PDF file to compress
    - `compressionLevel` (string): 'low' | 'recommended' | 'extreme'
- **Response**:
  - Success (200): Compressed PDF file as binary stream
  - Headers:
    - `Content-Type: application/pdf`
    - `Content-Disposition: attachment; filename="compressed_[original-name].pdf"`
    - `X-Original-Size: [bytes]`
    - `X-Compressed-Size: [bytes]`
    - `X-Compression-Ratio: [percentage]`
  - Error (4xx/5xx): JSON with error message

**GET /api/health**
- Simple health check endpoint
- Returns: `{ status: 'ok' }`

#### 2.3 Frontend Technology Stack

**Recommended Options:**

**Option 1: Vanilla HTML/CSS/JavaScript**
- Simplest implementation
- No build process required
- Files: `index.html`, `styles.css`, `app.js`
- Place in `public/` folder

**Option 2: React**
- Component-based architecture
- Better state management
- Requires build process (Vite or Create React App)

**Option 3: Vue.js**
- Progressive framework
- Simpler than React for small projects
- Good documentation

### 3. Progress Bar Implementation Strategy

#### 3.1 Progress Calculation Logic

```javascript
// Pseudo-code for realistic progress
const calculateProgress = (fileSize, stage) => {
  const uploadWeight = 0.3;    // 30% for upload
  const processWeight = 0.6;   // 60% for processing
  const downloadWeight = 0.1;  // 10% for download
  
  // Estimate processing time based on file size
  const estimatedProcessTime = (fileSize / 1024 / 1024) * 2; // 2 seconds per MB
  
  switch(stage) {
    case 'upload':
      return uploadedBytes / fileSize * uploadWeight * 100;
    case 'process':
      return 30 + (elapsedTime / estimatedProcessTime * processWeight * 100);
    case 'download':
      return 90 + (downloadedBytes / totalBytes * downloadWeight * 100);
  }
};
```

#### 3.2 Progress Updates

- **Upload progress**: Use `XMLHttpRequest` or `fetch` with progress events
- **Processing progress**: Simulate based on file size (backend doesn't provide real-time updates)
- **Download progress**: Track download stream progress

### 4. File Size Considerations

#### 4.1 Large File Handling (up to 1GB)

- **Chunked uploads**: Consider implementing for files >100MB
- **Timeout settings**: Increase server and client timeouts
- **Memory management**: Stream files instead of loading into memory
- **User feedback**: Show clear progress for large files

#### 4.2 Backend Streaming

```javascript
// Stream the compressed file instead of loading into memory
app.post('/api/compress', upload.single('pdf'), async (req, res) => {
  const compressedPath = await compressPDF(req.file.path, compressionLevel);
  
  const stat = fs.statSync(compressedPath);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="compressed_${req.file.originalname}"`);
  
  const stream = fs.createReadStream(compressedPath);
  stream.pipe(res);
});
```

### 5. User Experience Flow

1. **Landing Page**
   - Clean, simple interface
   - Prominent upload area
   - Brief description of service

2. **File Selection**
   - User drags file or clicks to browse
   - Immediate validation feedback
   - File details displayed

3. **Configuration**
   - Select compression level
   - "Compress" button becomes active

4. **Processing**
   - Progress bar appears
   - Status messages update
   - Cancel option available

5. **Completion**
   - Success message
   - Statistics displayed
   - File downloads automatically
   - Option to compress another file

### 6. Responsive Design Requirements

- **Mobile-friendly**: Works on phones and tablets
- **Desktop-optimized**: Takes advantage of larger screens
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### 7. Accessibility Requirements

- **Keyboard navigation**: All functions accessible via keyboard
- **Screen reader support**: Proper ARIA labels
- **Color contrast**: WCAG AA compliance
- **Focus indicators**: Clear visual focus states
- **Error announcements**: Screen reader notifications for errors

### 8. Security Considerations

- **File type validation**: Both client and server-side
- **File size limits**: Enforced on both ends
- **Sanitize filenames**: Prevent path traversal attacks
- **Rate limiting**: Prevent abuse
- **HTTPS**: Use secure connections in production
- **Temporary file cleanup**: Delete uploaded/processed files after use

### 9. Performance Optimization

- **Lazy loading**: Load components as needed
- **Compression**: Minify CSS/JS for production
- **Caching**: Cache static assets
- **CDN**: Consider for production deployment

### 10. Testing Requirements

#### 10.1 Functional Testing
- Upload various PDF sizes (1KB to 1GB)
- Test all compression levels
- Verify error handling
- Test cancel functionality
- Verify download works across browsers

#### 10.2 Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

#### 10.3 Performance Testing
- Test with 1GB file
- Measure upload/download speeds
- Monitor memory usage
- Check for memory leaks

### 11. Deployment Considerations

- **Environment variables**: Keep API keys secure
- **File storage**: Clean up temporary files regularly
- **Monitoring**: Log errors and usage
- **Backup**: Regular backups of configuration
- **Scaling**: Consider load balancing for high traffic

### 12. Future Enhancements (Optional)

- Batch processing (multiple files)
- User accounts and history
- Cloud storage integration (Google Drive, Dropbox)
- Email delivery of compressed files
- API key management for users
- Advanced compression settings
- PDF preview before/after compression
- Comparison slider for visual quality check

## Implementation Priority

### Phase 1: Core Functionality
1. Convert backend to Express server
2. Create basic HTML/CSS/JS frontend
3. Implement file upload
4. Add compression endpoint
5. Basic progress bar
6. File download

### Phase 2: Enhanced UX
1. Realistic progress calculation
2. Better error handling
3. Compression statistics display
4. Responsive design
5. Loading states and animations

### Phase 3: Polish
1. Accessibility improvements
2. Cross-browser testing
3. Performance optimization
4. Security hardening
5. Documentation

## File Structure (Proposed)

```
pdf-compressor/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── assets/
│       └── icons/
├── uploads/          # Temporary upload storage
├── compressed/       # Temporary compressed file storage
├── src/
│   ├── server.js     # Express server
│   ├── compressor.js # PDF compression logic (refactored from index.js)
│   └── utils/
│       └── fileHandler.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Success Metrics

- File upload success rate > 99%
- Compression completion rate > 95%
- Average processing time < 30 seconds for 10MB file
- User satisfaction (if feedback collected)
- Zero security incidents

## Notes

- The current `index.js` will need significant refactoring to work as a web server
- Consider using a job queue (like Bull) for handling large file processing
- Implement proper logging for debugging and monitoring
- Add rate limiting to prevent API abuse
- Consider implementing WebSocket for real-time progress updates instead of polling

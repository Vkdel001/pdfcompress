# PDF Compressor using iLovePDF API

A web-based PDF compression application with drag-and-drop interface, built with Node.js and the iLovePDF API.

## ✨ Features

- 🖱️ **Drag-and-drop** file upload interface
- 📊 **Realistic progress bar** based on file size
- 🎯 **Three compression levels**: Low, Recommended, Extreme
- 📦 **Large file support**: Up to 1GB
- 📱 **Responsive design**: Works on mobile, tablet, and desktop
- ⚡ **Automatic download** of compressed files
- 📈 **Compression statistics**: See original size, compressed size, and space saved

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your API credentials:**
   - Go to https://developer.ilovepdf.com/
   - Sign up or log in
   - Get your PUBLIC_KEY and SECRET_KEY

3. **Configure environment variables:**
   - Open `.env` file
   - Replace `your_public_key_here` with your actual PUBLIC_KEY
   - Replace `your_secret_key_here` with your actual SECRET_KEY

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Web Interface (Recommended)
1. Start the server with `npm start`
2. Open `http://localhost:3000` in your browser
3. Drag and drop a PDF file or click to browse
4. Select compression level
5. Click "Compress PDF"
6. Wait for processing (progress bar shows status)
7. File downloads automatically when complete

### Command Line Interface (Legacy)
```bash
node index.js path/to/input.pdf path/to/output.pdf [compression_level]
```

## 📊 Compression Levels

- **Low** - Light compression, best quality
- **Recommended** - Balanced compression (default)
- **Extreme** - Maximum compression, smaller file size

## 📁 Project Structure

```
pdf-compressor/
├── public/              # Frontend files
│   ├── index.html      # Main web interface
│   ├── css/
│   │   └── styles.css  # Styling
│   └── js/
│       └── app.js      # Frontend logic
├── server.js           # Express server + API
├── index.js            # CLI version (legacy)
├── .env                # API credentials
└── package.json        # Dependencies
```

## 🔧 API Endpoints

- `POST /api/compress` - Compress a PDF file
- `GET /api/health` - Server health check

## 📝 Documentation

- **QUICKSTART.md** - Detailed setup and usage guide
- **FRONTEND_SPECIFICATION.md** - Complete technical specification
- **TROUBLESHOOTING.md** - Common issues and solutions

## 🛡️ File Limits

- Maximum file size: **1GB** (1,073,741,824 bytes)
- Supported format: **PDF only**

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Mobile Support

Fully responsive and works on iOS and Android devices.

## 🔒 Security

- File type validation (client and server)
- File size limits enforced
- Temporary files automatically cleaned up
- Secure API authentication

## 🐛 Troubleshooting

See **TROUBLESHOOTING.md** for common issues and solutions.

## 📄 License

This project uses the iLovePDF API. Make sure to comply with their terms of service.

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import { createRequire } from 'module';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const ILovePDFFile = require('@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile.js').default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 1073741824 // 1GB in bytes
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Compression function
async function compressPDF(inputFilePath, outputFilePath, compressionLevel = 'recommended') {
  try {
    console.log('🚀 Starting PDF compression...');
    console.log(`📄 Input file: ${inputFilePath}`);
    console.log(`📊 Compression level: ${compressionLevel}`);

    const instance = new ILovePDFApi(
      process.env.PUBLIC_KEY,
      process.env.SECRET_KEY
    );

    const task = instance.newTask('compress');
    await task.start();
    console.log('✅ Task started');

    const file = new ILovePDFFile(inputFilePath);
    await task.addFile(file);
    console.log('✅ File uploaded to iLovePDF');

    await task.process({ compression_level: compressionLevel });
    console.log('✅ Compression completed');

    const data = await task.download();
    console.log('✅ File downloaded');

    fs.writeFileSync(outputFilePath, data);

    const originalSize = fs.statSync(inputFilePath).size;
    const compressedSize = fs.statSync(outputFilePath).size;
    const savedPercentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    console.log('✨ Compression successful!');
    console.log(`📦 Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`📦 Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`💾 Space saved: ${savedPercentage}%`);

    return {
      originalSize,
      compressedSize,
      savedPercentage
    };
  } catch (error) {
    console.error('❌ Error compressing PDF:', error.message);
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF Compressor API is running' });
});

// Compression endpoint
app.post('/api/compress', upload.single('pdf'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const compressionLevel = req.body.compressionLevel || 'recommended';
    
    if (!['low', 'recommended', 'extreme'].includes(compressionLevel)) {
      return res.status(400).json({ error: 'Invalid compression level' });
    }

    inputPath = req.file.path;
    const compressedDir = './compressed';
    
    if (!fs.existsSync(compressedDir)) {
      fs.mkdirSync(compressedDir, { recursive: true });
    }

    outputPath = path.join(compressedDir, `compressed-${req.file.filename}`);

    const stats = await compressPDF(inputPath, outputPath, compressionLevel);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="compressed_${req.file.originalname}"`);
    res.setHeader('X-Original-Size', stats.originalSize);
    res.setHeader('X-Compressed-Size', stats.compressedSize);
    res.setHeader('X-Compression-Ratio', stats.savedPercentage);

    // Stream the file
    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);

    // Cleanup after streaming
    fileStream.on('end', () => {
      setTimeout(() => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        console.log('🧹 Temporary files cleaned up');
      }, 1000);
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({ 
      error: 'Failed to compress PDF', 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 1GB limit' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message === 'Only PDF files are allowed!') {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 PDF Compressor server running on http://localhost:${PORT}`);
  console.log(`📁 Upload limit: 1GB`);
  console.log(`🔑 API configured: ${process.env.PUBLIC_KEY ? 'Yes' : 'No'}`);
});

import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import { createRequire } from 'module';
import fs from 'fs';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const ILovePDFFile = require('@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile.js').default;

// Load environment variables
dotenv.config();

async function compressPDF(inputFilePath, outputFilePath, compressionLevel = 'recommended') {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file not found: ${inputFilePath}`);
    }

    console.log('🚀 Starting PDF compression...');
    console.log(`📄 Input file: ${inputFilePath}`);
    console.log(`📊 Compression level: ${compressionLevel}`);

    // Initialize iLovePDF API
    const instance = new ILovePDFApi(
      process.env.PUBLIC_KEY,
      process.env.SECRET_KEY
    );

    // Create compress task
    const task = instance.newTask('compress');

    // Start the task
    await task.start();
    console.log('✅ Task started');

    // Create ILovePDFFile instance for proper file upload
    const file = new ILovePDFFile(inputFilePath);
    
    // Upload the PDF file
    await task.addFile(file);
    console.log('✅ File uploaded');

    // Process with compression
    await task.process({ compression_level: compressionLevel });
    console.log('✅ Compression completed');

    // Download the compressed file
    const data = await task.download();
    console.log('✅ File downloaded');

    // Save the compressed file
    fs.writeFileSync(outputFilePath, data);
    
    // Get file sizes
    const originalSize = fs.statSync(inputFilePath).size;
    const compressedSize = fs.statSync(outputFilePath).size;
    const savedPercentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    console.log('\n✨ Compression successful!');
    console.log(`📦 Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`📦 Compressed size: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`💾 Space saved: ${savedPercentage}%`);
    console.log(`📁 Output file: ${outputFilePath}`);

  } catch (error) {
    console.error('❌ Error compressing PDF:', error.message);
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// Main execution
const inputFile = process.argv[2] || './input.pdf';
const outputFile = process.argv[3] || './compressed.pdf';
const compressionLevel = process.argv[4] || 'recommended'; // Options: 'low', 'recommended', 'extreme'

compressPDF(inputFile, outputFile, compressionLevel);

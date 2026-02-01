// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFile');
const compressBtn = document.getElementById('compressBtn');
const cancelBtn = document.getElementById('cancelBtn');
const downloadBtn = document.getElementById('downloadBtn');
const compressAnotherBtn = document.getElementById('compressAnotherBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Sections
const uploadSection = document.getElementById('uploadSection');
const processingSection = document.getElementById('processingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');

// Progress elements
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusMessage = document.getElementById('statusMessage');

// Results elements
const originalSizeEl = document.getElementById('originalSize');
const compressedSizeEl = document.getElementById('compressedSize');
const spaceSavedEl = document.getElementById('spaceSaved');
const errorMessageEl = document.getElementById('errorMessage');

// State
let selectedFile = null;
let abortController = null;
let downloadBlob = null;

// Constants
const MAX_FILE_SIZE = 1073741824; // 1GB in bytes

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function showSection(section) {
    [uploadSection, processingSection, resultsSection, errorSection].forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    section.classList.remove('hidden');
    section.classList.add('active');
}

function validateFile(file) {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'Please select a PDF file' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 1GB limit' };
    }
    
    if (file.size === 0) {
        return { valid: false, error: 'File is empty' };
    }
    
    return { valid: true };
}

function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.remove('hidden');
    compressBtn.disabled = false;
}

function clearFileInfo() {
    selectedFile = null;
    fileInfo.classList.add('hidden');
    fileInput.value = '';
    compressBtn.disabled = true;
}

function updateProgress(percentage, message) {
    progressFill.style.width = percentage + '%';
    progressText.textContent = Math.round(percentage) + '%';
    if (message) {
        statusMessage.textContent = message;
    }
}

function showError(message) {
    errorMessageEl.textContent = message;
    showSection(errorSection);
}

// Event Listeners - Upload Area
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    const validation = validateFile(file);
    
    if (!validation.valid) {
        alert(validation.error);
        return;
    }
    
    selectedFile = file;
    displayFileInfo(file);
}

removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFileInfo();
});

// Compress Button
compressBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    const compressionLevel = document.querySelector('input[name="compression"]:checked').value;
    await compressFile(selectedFile, compressionLevel);
});

// Compression Function with Realistic Progress
async function compressFile(file, compressionLevel) {
    showSection(processingSection);
    updateProgress(0, 'Preparing upload...');
    
    abortController = new AbortController();
    
    try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('compressionLevel', compressionLevel);
        
        // Calculate estimated times based on file size
        const fileSizeMB = file.size / (1024 * 1024);
        const estimatedUploadTime = Math.max(2000, fileSizeMB * 100); // ~100ms per MB
        const estimatedProcessTime = Math.max(3000, fileSizeMB * 500); // ~500ms per MB
        
        let currentProgress = 0;
        
        // Simulate upload progress (0-30%)
        updateProgress(5, 'Uploading file...');
        const uploadInterval = setInterval(() => {
            currentProgress += (30 / (estimatedUploadTime / 200));
            if (currentProgress >= 30) {
                clearInterval(uploadInterval);
                currentProgress = 30;
            }
            updateProgress(currentProgress, 'Uploading file...');
        }, 200);
        
        // Make the API request
        const response = await fetch('/api/compress', {
            method: 'POST',
            body: formData,
            signal: abortController.signal
        });
        
        clearInterval(uploadInterval);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        // Upload complete, start processing simulation (30-90%)
        updateProgress(30, 'Compressing PDF...');
        
        const processInterval = setInterval(() => {
            currentProgress += (60 / (estimatedProcessTime / 200));
            if (currentProgress >= 90) {
                clearInterval(processInterval);
                currentProgress = 90;
            }
            updateProgress(currentProgress, 'Compressing PDF...');
        }, 200);
        
        // Get the blob
        const blob = await response.blob();
        clearInterval(processInterval);
        
        // Download phase (90-100%)
        updateProgress(95, 'Preparing download...');
        
        // Get stats from headers
        const originalSize = parseInt(response.headers.get('X-Original-Size') || file.size);
        const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || blob.size);
        const compressionRatio = response.headers.get('X-Compression-Ratio') || 
            (((originalSize - compressedSize) / originalSize * 100).toFixed(2));
        
        updateProgress(100, 'Complete!');
        
        // Store blob for download
        downloadBlob = blob;
        
        // Show results
        setTimeout(() => {
            displayResults(originalSize, compressedSize, compressionRatio);
        }, 500);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            showError('Compression cancelled');
        } else {
            console.error('Compression error:', error);
            showError(error.message || 'Failed to compress PDF. Please try again.');
        }
    }
}

function displayResults(originalSize, compressedSize, savedPercentage) {
    originalSizeEl.textContent = formatFileSize(originalSize);
    compressedSizeEl.textContent = formatFileSize(compressedSize);
    spaceSavedEl.textContent = savedPercentage + '%';
    
    showSection(resultsSection);
    
    // Auto-download
    if (downloadBlob) {
        triggerDownload();
    }
}

function triggerDownload() {
    if (!downloadBlob) return;
    
    const url = window.URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Cancel Button
cancelBtn.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
    }
    resetApp();
});

// Download Button
downloadBtn.addEventListener('click', () => {
    triggerDownload();
});

// Compress Another Button
compressAnotherBtn.addEventListener('click', () => {
    resetApp();
});

// Try Again Button
tryAgainBtn.addEventListener('click', () => {
    resetApp();
});

function resetApp() {
    clearFileInfo();
    downloadBlob = null;
    abortController = null;
    updateProgress(0, '');
    showSection(uploadSection);
}

// Check server health on load
async function checkServerHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Server status:', data.message);
    } catch (error) {
        console.error('Server connection failed:', error);
    }
}

// Initialize
checkServerHealth();

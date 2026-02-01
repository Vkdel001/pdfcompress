# PDF Compressor Troubleshooting Guide

## Issue: "Cloud File is not a valid URL" Error

### Problem Description

When attempting to compress a PDF file using the iLovePDF API, the application was failing with a 400 Bad Request error:

```
Error: Request can't be processed successfully
param: { cloud_file: [ 'Cloud File is not a valid URL.' ] }
```

The API was receiving the local file path (e.g., `./input.pdf`) as a `cloud_file` parameter instead of the actual file content being uploaded.

### Root Cause

The issue had two main components:

#### 1. Module Dependency Conflicts

The project had conflicting versions of `axios` and `form-data` installed:
- Root level: `axios@1.13.4` and `form-data@4.0.5` (manually installed)
- Core library level: `axios@0.21.4` and `form-data` (nested in `@ilovepdf/ilovepdf-js-core/node_modules`)

This version mismatch was causing the library's internal file upload mechanism to malfunction.

#### 2. Incorrect File Upload Method

The code was passing a string file path directly to `task.addFile()`:

```javascript
await task.addFile(inputFilePath);  // ❌ Wrong - treats path as URL
```

The `addFile()` method in the iLovePDF library checks if the parameter is an instance of `BaseFile`. If not, it assumes it's a URL and sends it as a `cloud_file` parameter, which causes the API to reject it.

### Solution

#### Step 1: Remove Conflicting Dependencies

Removed the manually installed `axios` and `form-data` packages from the root level:

```bash
npm uninstall axios form-data
```

This allowed the library to use its own nested dependencies (`axios@0.21.4`) without conflicts.

#### Step 2: Import and Use ILovePDFFile Class

The correct way to upload local files is to use the `ILovePDFFile` class from the core library:

```javascript
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ILovePDFFile = require('@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile.js').default;
```

**Why `createRequire`?**
- The project uses ES modules (`"type": "module"` in package.json)
- The `@ilovepdf/ilovepdf-js-core` library is a CommonJS module
- `createRequire` bridges the gap between ES modules and CommonJS

#### Step 3: Create ILovePDFFile Instance

Instead of passing the file path directly, create an `ILovePDFFile` instance:

```javascript
// Create ILovePDFFile instance for proper file upload
const file = new ILovePDFFile(inputFilePath);

// Upload the PDF file
await task.addFile(file);
```

### How ILovePDFFile Works

The `ILovePDFFile` class:
1. Reads the file from the filesystem using `fs.readFileSync()`
2. Extends `BaseFile` class (which `addFile()` checks for)
3. Creates a `FormData` object with the file content
4. Properly uploads the file as multipart/form-data

### Final Working Code

```javascript
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import { createRequire } from 'module';
import fs from 'fs';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const ILovePDFFile = require('@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile.js').default;

dotenv.config();

async function compressPDF(inputFilePath, outputFilePath, compressionLevel = 'recommended') {
  try {
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file not found: ${inputFilePath}`);
    }

    const instance = new ILovePDFApi(
      process.env.PUBLIC_KEY,
      process.env.SECRET_KEY
    );

    const task = instance.newTask('compress');
    await task.start();

    // ✅ Correct way: Create ILovePDFFile instance
    const file = new ILovePDFFile(inputFilePath);
    await task.addFile(file);

    await task.process({ compression_level: compressionLevel });
    const data = await task.download();
    fs.writeFileSync(outputFilePath, data);

    console.log('✨ Compression successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}
```

### Key Takeaways

1. **Don't manually install dependencies** that are already nested in library packages - this can cause version conflicts
2. **Use the correct file upload class** (`ILovePDFFile`) instead of passing raw file paths
3. **Bridge ES modules and CommonJS** using `createRequire` when necessary
4. **Check library internals** when documentation is unclear - the source code revealed the `ILovePDFFile` class

### Testing the Fix

After implementing the solution:
- File upload: ✅ Success
- Compression: ✅ Success  
- Download: ✅ Success
- Result: 452 MB file compressed to 20 MB (95.58% reduction)

### Prevention

To avoid this issue in the future:
1. Always check if a library has nested dependencies before installing packages manually
2. Read the library's source code when documentation is incomplete
3. Use the library's provided classes and methods rather than trying to work around them
4. Test with the library's sample code first to understand the expected usage pattern

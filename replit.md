# ImageBB Batch Uploader

## Overview

This project is a Node.js command-line tool designed to batch upload images from local directories to ImageBB hosting service. The application provides a simple interface for uploading multiple images at once, with progress tracking and JSON output for results and metadata.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Indonesian (Bahasa Indonesia)

## System Architecture

### Core Architecture
- **Runtime**: Node.js application using native modules and external packages
- **Execution Model**: Command-line interface (CLI) tool with direct execution
- **Processing Pattern**: Asynchronous batch processing with file system operations
- **Output Format**: JSON-based results with optional file persistence

### Key Design Decisions
- **Synchronous Design**: Uses async/await pattern for clean asynchronous code handling
- **Error Handling**: Individual image upload failures don't stop the entire batch process
- **File System Access**: Direct file system operations using Node.js fs.promises API
- **Configuration**: Environment variable-based API key management with command-line folder specification

## Key Components

### Main Application (index.js)
- **Purpose**: Entry point and main orchestration logic
- **Responsibilities**: 
  - File discovery and filtering
  - Batch upload coordination
  - Progress tracking
  - Result compilation and output

### Core Functions
1. **File Discovery**: `getImageFiles()` - Recursively finds supported image files
2. **Format Validation**: `isImageFile()` - Validates file extensions against supported formats
3. **Upload Handler**: Individual image upload processing (implementation appears incomplete)

### Supported Image Formats
- JPEG/JPG, PNG, GIF, BMP, WebP, SVG
- Case-insensitive extension matching

## Data Flow

1. **Input Stage**: 
   - Accept folder path from command-line arguments (defaults to './images')
   - Load API key from environment variable
   
2. **Discovery Stage**:
   - Scan specified directory for image files
   - Filter files by supported format extensions
   - Build list of files to process

3. **Processing Stage**:
   - Iterate through image files
   - Upload each file to ImageBB service
   - Track progress and collect results

4. **Output Stage**:
   - Compile upload results into JSON format
   - Display progress and final results
   - Optionally save results to file

## External Dependencies

### Primary Dependencies
- **imgbb-uploader**: Third-party package for ImageBB API integration
  - Version: 1.5.1
  - Purpose: Handles HTTP requests and ImageBB API communication
  - License: Custom license (SEE LICENSE IN TARGARYEN_UNLICENSE)

### Node.js Built-in Modules
- **fs.promises**: File system operations with async/await support
- **path**: Cross-platform path manipulation utilities

## Deployment Strategy

### Local Development
- **Installation**: npm install for dependencies
- **Configuration**: Set IMGBB_API_KEY environment variable
- **Execution**: Direct Node.js execution with `node index.js [folder_path]`

### Distribution
- **Package Type**: Standalone Node.js application
- **Entry Point**: Shebang line suggests CLI tool capability
- **Dependencies**: Single external dependency minimizes deployment complexity

### Configuration Requirements
- **API Key**: ImageBB API key must be provided via environment variable
- **Node.js Version**: Minimum Node.js 8.3.0 (per imgbb-uploader requirement)
- **File System**: Requires read access to image directories

## Current Status

**COMPLETED - January 10, 2025**

The application is fully functional and tested with real ImageBB API. Key accomplishments:

### Recent Changes
- ✅ **SSL Configuration**: Added automatic SSL certificate handling to resolve connection issues
- ✅ **Format Optimization**: Refined supported formats to exclude SVG (ImageBB compatibility issue)
- ✅ **API Integration**: Successfully tested with real ImageBB API key
- ✅ **Error Handling**: Comprehensive error handling for individual upload failures
- ✅ **JSON Output**: Complete JSON results with metadata, URLs, and upload statistics

### Test Results
- Successfully uploaded 2 images (JPG format) to ImageBB
- Generated complete JSON output with all required metadata
- Automatic file saving of results to timestamped JSON files
- Progress tracking working correctly

### User API Key
- User provided working ImageBB API key: `d5a50bd268ee289317694a0fd1873746`
- All uploads tested and verified successful

### JSON Format Simplification - January 10, 2025
- ✅ **Simplified JSON Output**: Changed from complex nested structure to simple array format
- ✅ **Reduced Fields**: Only filename, url, and deleteUrl fields retained
- ✅ **Success-Only Output**: Only successful uploads included in JSON output
- ✅ **User-Requested Format**: Modified to match exact user specification
# ImageBB Batch Uploader

A Node.js command-line tool for batch uploading images from local folders to ImageBB with JSON output.

## Features

- Batch upload multiple images from a local directory
- Support for common image formats (JPG, PNG, GIF, BMP, WebP, SVG)
- Progress tracking during uploads
- JSON output with upload results and metadata
- Error handling for failed uploads
- Save results to JSON file

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install imgbb-uploader
```

## Setup

1. Get your ImageBB API key from https://api.imgbb.com/
2. Set the API key as environment variable:
```bash
export IMGBB_API_KEY=your_api_key_here
```

## Usage

```bash
# Upload from default './images' folder
node index.js

# Upload from specific folder
node index.js /path/to/your/images

# Show help
node index.js --help
```

## Example Output

The program will:
1. Scan the folder for supported image files
2. Upload each image to ImageBB
3. Show progress and results
4. Save results to a JSON file
5. Display complete JSON output

### JSON Output Format

```json
{
  "summary": {
    "totalFiles": 2,
    "successfulUploads": 2,
    "failedUploads": 0,
    "processingTime": "2025-07-10T16:40:47.698Z",
    "folder": "/path/to/images"
  },
  "results": [
    {
      "success": true,
      "filename": "image.jpg",
      "originalPath": "/path/to/images/image.jpg",
      "url": "https://i.ibb.co/abc123/image.jpg",
      "displayUrl": "https://i.ibb.co/def456/image.jpg",
      "deleteUrl": "https://ibb.co/ghi789/hash",
      "size": 123456,
      "title": "image",
      "uploadTime": "2025-07-10T16:40:47.553Z"
    }
  ]
}
```

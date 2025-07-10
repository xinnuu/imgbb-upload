#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const imgbbUploader = require("imgbb-uploader");

// Configure SSL to handle certificate issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Supported image formats (ImageBB has issues with SVG, so we'll exclude it)
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

// Configuration
const API_KEY = process.env.IMGBB_API_KEY || "d5a50bd268ee289317694a0fd1873746";
const DEFAULT_FOLDER = process.argv[2] || "./images";

/**
 * Check if a file is a supported image format
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if supported format
 */
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
}

/**
 * Get all image files from a directory
 * @param {string} folderPath - Path to the folder
 * @returns {Promise<string[]>} - Array of image file paths
 */
async function getImageFiles(folderPath) {
    try {
        const files = await fs.readdir(folderPath);
        const imageFiles = [];

        for (const file of files) {
            const fullPath = path.join(folderPath, file);
            const stats = await fs.stat(fullPath);

            if (stats.isFile() && isImageFile(file)) {
                imageFiles.push(fullPath);
            }
        }

        return imageFiles;
    } catch (error) {
        throw new Error(`Failed to read directory: ${error.message}`);
    }
}

/**
 * Upload a single image to ImageBB
 * @param {string} imagePath - Path to the image file
 * @param {string} apiKey - ImageBB API key
 * @returns {Promise<Object>} - Upload result
 */
async function uploadImage(imagePath, apiKey) {
    try {
        const filename = path.basename(imagePath);
        console.log(`Uploading: ${filename}...`);

        const result = await imgbbUploader(apiKey, imagePath);

        return {
            filename: filename,
            url: result.url,
            deleteUrl: result.delete_url
        };
    } catch (error) {
        return {
            filename: path.basename(imagePath),
            error: error.message
        };
    }
}

/**
 * Display progress information
 * @param {number} current - Current file number
 * @param {number} total - Total files
 * @param {string} filename - Current filename
 */
function displayProgress(current, total, filename) {
    const percentage = Math.round((current / total) * 100);
    console.log(`Progress: ${current}/${total} (${percentage}%) - ${filename}`);
}

/**
 * Main function to process batch upload
 */
async function main() {
    console.log("ImageBB Batch Uploader");
    console.log("======================");

    // Validate API key
    if (!API_KEY) {
        console.error("Error: IMGBB_API_KEY environment variable is required");
        console.error(
            "Please set your ImageBB API key: export IMGBB_API_KEY=your_api_key_here",
        );
        process.exit(1);
    }

    // Validate folder path
    const folderPath = path.resolve(DEFAULT_FOLDER);
    console.log(`Scanning folder: ${folderPath}`);

    try {
        await fs.access(folderPath);
    } catch (error) {
        console.error(
            `Error: Folder "${folderPath}" does not exist or is not accessible`,
        );
        process.exit(1);
    }

    try {
        // Get all image files
        const imageFiles = await getImageFiles(folderPath);

        if (imageFiles.length === 0) {
            console.log("No image files found in the specified folder");
            console.log(`Supported formats: ${SUPPORTED_FORMATS.join(", ")}`);
            return;
        }

        console.log(`Found ${imageFiles.length} image file(s)`);
        console.log("Starting batch upload...\n");

        // Upload results array
        const results = [];

        // Process each image file
        for (let i = 0; i < imageFiles.length; i++) {
            const imagePath = imageFiles[i];
            const filename = path.basename(imagePath);

            displayProgress(i + 1, imageFiles.length, filename);

            const result = await uploadImage(imagePath, API_KEY);
            results.push(result);

            if (result.url) {
                console.log(`✓ Successfully uploaded: ${filename}`);
                console.log(`  URL: ${result.url}`);
            } else {
                console.log(`✗ Failed to upload: ${filename}`);
                console.log(`  Error: ${result.error}`);
            }

            console.log(""); // Empty line for readability
        }

        // Filter only successful uploads for simple JSON output
        const successfulUploads = results.filter((r) => r.url);
        
        // Generate simplified JSON output
        const finalOutput = successfulUploads;

        // Save results to JSON file
        const outputFilename = `upload_results_${Date.now()}.json`;
        await fs.writeFile(
            outputFilename,
            JSON.stringify(finalOutput, null, 2),
        );

        console.log("======================");
        console.log("Batch Upload Complete!");
        console.log("======================");
        console.log(`Total files processed: ${imageFiles.length}`);
        console.log(`Successful uploads: ${successfulUploads.length}`);
        console.log(`Failed uploads: ${results.length - successfulUploads.length}`);
        console.log(`Results saved to: ${outputFilename}`);

        // Output JSON to console
        console.log("\nJSON Output:");
        console.log(JSON.stringify(finalOutput, null, 2));
    } catch (error) {
        console.error("Fatal error:", error.message);
        process.exit(1);
    }
}

// Handle command line arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log("ImageBB Batch Uploader");
    console.log("Usage: node index.js [folder_path]");
    console.log("");
    console.log("Arguments:");
    console.log(
        "  folder_path    Path to folder containing images (default: ./images)",
    );
    console.log("");
    console.log("Environment Variables:");
    console.log("  IMGBB_API_KEY  Your ImageBB API key (required)");
    console.log("");
    console.log("Examples:");
    console.log("  node index.js ./my-images");
    console.log("  node index.js /home/user/photos");
    console.log("");
    console.log("Supported formats: " + SUPPORTED_FORMATS.join(", "));
    process.exit(0);
}

// Run the main function
main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});

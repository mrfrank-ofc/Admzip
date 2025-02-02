const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip'); // For extracting ZIP files

// GitHub repository details
const GITHUB_REPO = 'mrfrank-ofc/SUBZERO-BOT';
const GITHUB_ZIP_URL = `https://github.com/${GITHUB_REPO}/archive/main.zip`;

// Paths
const BOT_DIR = __dirname; // Current directory (where index.js is located)
const ZIP_FILE_PATH = path.join(BOT_DIR, 'latest.zip');
const EXTRACT_DIR = path.join(BOT_DIR, 'latest');

async function downloadAndUpdateBot() {
    try {
        console.log('🔍 Checking for updates...');

        // Step 1: Download the latest code
        console.log('⬇️ Downloading the latest code...');
        const response = await axios.get(GITHUB_ZIP_URL, { responseType: 'arraybuffer' });
        fs.writeFileSync(ZIP_FILE_PATH, response.data);

        // Step 2: Extract the ZIP file
        console.log('📦 Extracting the latest code...');
        const zip = new AdmZip(ZIP_FILE_PATH);
        zip.extractAllTo(EXTRACT_DIR, true);

        // Step 3: Replace existing files
        console.log('🔄 Replacing files...');
        const sourceDir = path.join(EXTRACT_DIR, `${GITHUB_REPO.split('/')[1]}-main`);
        copyFolderSync(sourceDir, BOT_DIR);

        // Step 4: Clean up
        console.log('🧹 Cleaning up...');
        fs.unlinkSync(ZIP_FILE_PATH); // Delete the ZIP file
        fs.rmSync(EXTRACT_DIR, { recursive: true, force: true }); // Delete the extraction directory

        console.log('✅ Bot updated successfully!');
    } catch (error) {
        console.error('❌ Error updating bot:', error);
    }
}

// Function to copy a folder recursively
function copyFolderSync(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, destinationPath);
        } else {
            fs.copyFileSync(sourcePath, destinationPath);
        }
    }
}

// Run the update process when the bot starts
downloadAndUpdateBot().then(() => {
    console.log('🚀 Starting the bot...');
    // Start your bot here
    require('index.js'); // Replace with your bot's main file
});

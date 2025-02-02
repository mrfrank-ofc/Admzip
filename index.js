const axios = require('axios'); // For making HTTP requests
const fs = require('fs'); // For file system operations
const { exec } = require('child_process'); // For running shell commands
const admZip = require('adm-zip'); // For unzipping files

// GitHub repository details
const REPO_OWNER = 'mrfrank-ofc';
const REPO_NAME = 'SUBZERO-BOT';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/heads/main.zip`; // Replace 'main' with your branch name if different

// Paths
const ZIP_FILE_PATH = './repo.zip';
const EXTRACT_FOLDER = './bot-files';

// Function to download the repository as a ZIP file
async function downloadRepo() {
    try {
        console.log('Downloading repository...');
        const response = await axios.get(REPO_URL, { responseType: 'arraybuffer' });
        fs.writeFileSync(ZIP_FILE_PATH, response.data);
        console.log('Repository downloaded successfully.');
    } catch (error) {
        console.error('Error downloading repository:', error);
        process.exit(1);
    }
}

// Function to unzip the repository
function unzipRepo() {
    try {
        console.log('Unzipping repository...');
        const zip = new admZip(ZIP_FILE_PATH);
        zip.extractAllTo(EXTRACT_FOLDER, true);
        console.log('Repository unzipped successfully.');
    } catch (error) {
        console.error('Error unzipping repository:', error);
        process.exit(1);
    }
}

// Function to install dependencies
function installDependencies() {
    console.log('Installing dependencies...');
    exec('npm install', { cwd: EXTRACT_FOLDER }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error installing dependencies:', error);
            process.exit(1);
        }
        console.log(stdout);
        console.log('Dependencies installed successfully.');
        startBot();
    });
}

// Function to start the bot
function startBot() {
    console.log('Starting the bot...');
    exec('node index.js', { cwd: EXTRACT_FOLDER }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error starting the bot:', error);
            process.exit(1);
        }
        console.log(stdout);
    });
}

// Main function
async function main() {
    await downloadRepo();
    unzipRepo();
    installDependencies();
}

// Run the main function
main();

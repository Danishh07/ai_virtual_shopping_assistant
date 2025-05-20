/**
 * Helper script to start the server and check for port availability
 */
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

// Default port from .env
const PORT = 5001;

// Function to check if port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => {
        resolve(true); // Port is in use
      })
      .once('listening', () => {
        server.close();
        resolve(false); // Port is available
      })
      .listen(port);
  });
}

// Main function to start server
async function startServer() {
  try {
    console.log('Checking port availability...');
    const portInUse = await isPortInUse(PORT);
    
    if (portInUse) {
      console.error(`Error: Port ${PORT} is already in use!`);
      console.log('Possible solutions:');
      console.log('1. Stop any other applications using port 5001');
      console.log('2. Change the PORT value in server/.env to a different port');
      process.exit(1);
    }
    
    console.log(`Port ${PORT} is available, starting server...`);
    
    // Start the server
    const serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'inherit'
    });
    
    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
    });
    
    process.on('SIGINT', () => {
      console.log('Stopping server...');
      serverProcess.kill('SIGINT');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
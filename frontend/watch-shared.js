const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const sharedDir = path.join(__dirname, "../shared");

console.log("👀 Watching shared directory for changes...");

// Watch for changes in the shared directory
fs.watch(sharedDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    console.log(`📝 Detected change in shared/${filename}`);

    // Run copy script
    exec("npm run copy-shared", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Failed to copy shared files:", error);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });
  }
});

console.log("Press Ctrl+C to stop watching");

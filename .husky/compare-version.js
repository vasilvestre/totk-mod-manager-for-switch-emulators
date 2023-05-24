const fs = require('fs')

// Read the contents of src-tauri/Cargo.toml
const cargoTomlContents = fs.readFileSync('src-tauri/Cargo.toml', 'utf8')

// Extract the version number from src-tauri/Cargo.toml
const cargoVersionMatch = cargoTomlContents.match(
    /version\s*=\s*["']([^"']+)["']/
)
const cargoVersion = cargoVersionMatch ? cargoVersionMatch[1] : null

// Retrieve the latest Git tag
const latestTag = require('child_process')
    .execSync('git describe --abbrev=0 --tags')
    .toString()
    .trim()

// Extract the version number from the tag
const tagVersionMatch = latestTag.match(/^v(\d+\.\d+\.\d+)$/)
const tagVersion = tagVersionMatch ? tagVersionMatch[1] : null

// Compare the versions
if (cargoVersion === tagVersion) {
    console.log(`Versions match: ${tagVersion}`)
    process.exit(0)
} else {
    console.error('Versions do not match!')
    process.exit(1)
}

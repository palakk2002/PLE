const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set(['node_modules', '.git', '.vscode', 'dist', 'build', 'uploads']);
const IGNORED_FILES = new Set(['resolve_conflicts.js', 'package-lock.json']); // We can ignore package-lock.json or resolve it too. Let's resolve package-lock.json as well, but we can also regenerate it with npm install. Let's resolve it.

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!IGNORED_DIRS.has(f)) {
                walkDir(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

function resolveFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return; // Skip binary or unreadable files
    }

    if (!content.includes('<<<<<<<') || !content.includes('=======') || !content.includes('>>>>>>>')) {
        return; // No conflicts found
    }

    console.log(`Resolving conflicts in: ${filePath}`);

    const lines = content.split(/\r?\n/);
    const resolvedLines = [];
    let inConflict = false;
    let keepingOurs = false;
    let hasConflictResolved = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('<<<<<<<')) {
            inConflict = true;
            keepingOurs = true; // Keep HEAD (local changes)
            hasConflictResolved = true;
            continue;
        }
        if (line.startsWith('=======')) {
            keepingOurs = false; // Discard incoming changes
            continue;
        }
        if (line.startsWith('>>>>>>>')) {
            inConflict = false;
            keepingOurs = false;
            continue;
        }

        if (inConflict) {
            if (keepingOurs) {
                resolvedLines.push(line);
            }
        } else {
            resolvedLines.push(line);
        }
    }

    if (hasConflictResolved) {
        // Create a backup file just in case
        fs.writeFileSync(filePath + '.bak', content, 'utf8');
        // Write the resolved content back to the original file
        const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
        fs.writeFileSync(filePath, resolvedLines.join(lineEnding), 'utf8');
        console.log(`Successfully resolved and backed up: ${filePath}`);
    }
}

// Start walking and resolving from the current directory
const targetDir = __dirname;
console.log(`Starting conflict resolution in: ${targetDir}`);
walkDir(targetDir, resolveFile);
console.log('Conflict resolution completed! Backup files (.bak) have been created for all modified files.');

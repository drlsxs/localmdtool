const path = require("path");
const fs = require("fs");
function getDirectoryTree(dirPath) {
    const stats = fs.statSync(dirPath);
    if (stats.isFile()) {
        return path.basename(dirPath);
    } else if (stats.isDirectory()) {
        const tree = {};
        tree[path.basename(dirPath)] = fs.readdirSync(dirPath).map(file => {
            return getDirectoryTree(path.join(dirPath, file));
        });
        return tree;
    }
}

module.exports = {
    getDirectoryTree,
}
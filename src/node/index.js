import {ipcMain,dialog,shell} from 'electron';
const fs = require("fs");
import {testDB} from "@/node/mysql";
import {getDirectoryTree} from "@/node/dictory";


ipcMain.on("toMain", (event, args) => {
    testDB(args, res => {
        event.reply('fromMain', res); //主线程回复
    });
});

ipcMain.on("electronApi", (event, args) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        let dirPath = result.filePaths[0];
        const tree = getDirectoryTree(dirPath);
        event.reply('fromMain', result.filePaths, tree);
    }).catch(err => {
        console.log(err);
    });
});

ipcMain.on("fileopen", (event, filepath) => {

    fs.readFile(filepath, {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            event.reply("filecont", data);
        }
    });
});






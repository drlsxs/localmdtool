import {ipcMain,dialog} from 'electron';
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
        // console.log(result.filePaths);
        let dirPath = result.filePaths[0];
        const tree = getDirectoryTree(dirPath);
        event.reply('fromMain', result.filePaths, tree);
        // console.log(tree);
    }).catch(err => {
        console.log(err);
    });
});




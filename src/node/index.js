import {ipcMain} from 'electron';
import {testDB} from "@/node/mysql";

ipcMain.on("toMain", (event, args) => {
    testDB(args, res => {
        event.reply('fromMain', res); //主线程回复
    });
});


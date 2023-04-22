import {ipcMain,dialog,shell} from 'electron';
const fs = require("fs");
const path = require("path");
import {testDB} from "@/node/mysql";
import {getDirectoryTree} from "@/node/dictory";
import mysql from "mysql";


ipcMain.on("toMain", (event, args) => {
    testDB(args, res => {
        event.reply('fromMain', res); //主线程回复
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

ipcMain.on("fileWrite", (event,[filePath,content]) => {
    fs.writeFile(filePath, content, "utf8", function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
});

ipcMain.on("pathTree", (event, args) => {
    fs.readFile("./src/config/dataSourceConfig.json", {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let json = JSON.parse(data);
            let dirPath = json.position;
            const tree = getDirectoryTree(dirPath);
            event.reply('treeInfo', dirPath, tree);
        }
    });
});

//单独文库入库
ipcMain.on("fileSave", (event, {label:mdFile,path:dirPath}) => {
    // 获取文件状态信息
    const stat = fs.statSync(dirPath);
    const size = stat.size;
    const mtime = stat.mtime;

    // 获取文件类型
    const extname = path.extname(dirPath);
    const type = extname === '.md' ? 'Markdown' : 'Unknown';

    // 读取文件内容
    const content = fs.readFileSync(dirPath, 'utf-8');

    // 输出文件信息和内容
    console.log(`File Name: ${mdFile}`);
    console.log(`Size: ${size} bytes`);
    console.log(`Type: ${type}`);
    console.log(`Last Modified Time: ${mtime}`);
    console.log(`Content: ${content}`);
    //读取数据库信息
    fs.readFile("./src/config/databaseConfig.json", {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let databaseconfig = JSON.parse(data);
            const pool = mysql.createPool({
                connectionLimit: 10,
                host: databaseconfig.host,
                user: databaseconfig.username,
                password:databaseconfig.password,
                database: databaseconfig.dbName,
                port: databaseconfig.port,
            })
            pool.getConnection(function (err, connection) {
                // 查询数据库中是否已经存在相同的文件名
                connection.query('SELECT * FROM blogPage WHERE filename = ?', [mdFile], function (error, results, fields) {
                    if (error) throw error;

                    if (results.length > 0) {
                        // 如果存在相同的文件名，则比较修改时间
                        const dbMtime = results[0].mtime;

                        if (mtime.getTime() > dbMtime.getTime()) {
                            // 如果文件的修改时间比数据库中的大，则执行更新操作
                            connection.query('UPDATE blogPage SET size = ?, type = ?, content = ?, mtime = ? WHERE filename = ?', [size, type, content, mtime, mdFile], function (error, results, fields) {
                                if (error) throw error;
                                console.log(`File ${mdFile} 更新成功`);
                            });
                        } else {
                            // 如果文件的修改时间和数据库中的相同，则不执行任何操作
                            console.log(`File ${mdFile} 已存在并无更新`);
                        }
                    } else {
                        // 如果不存在相同的文件名，则执行插入操作
                        connection.query('INSERT INTO blogPage SET ?', {
                            filename: mdFile,
                            size: size,
                            type: type,
                            content: content,
                            mtime: mtime
                        }, function (error, results, fields) {
                            if (error) throw error;
                            console.log(`File ${mdFile} 新增成功`);
                        });
                    }
                });
                // 释放连接
                // connection.release();
            });
            // 当所有查询完成并且连接释放后关闭连接池
            // pool.end(function (err) {
            //     if (err) throw err;
            //     console.log('连接池已关闭');
            // });
        }
    });


});

//批量入库
ipcMain.on("fileSaves", (event, args) => {
    fs.readFile("./src/config/dataSourceConfig.json", {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let json = JSON.parse(data);
            let dirPath = json.position;
            // 读取指定路径下的所有文件和文件夹
            const files = fs.readdirSync(dirPath);
            console.log(files,1244)

// 过滤出 md 文件
            const mdFiles = files.filter(file => path.extname(file) === '.md');
            console.log(json, mdFiles);
// 遍历 md 文件并获取文件信息和内容
            mdFiles.forEach(mdFile => {
                const filePath = path.join(dirPath, mdFile);
                // 获取文件状态信息
                const stat = fs.statSync(filePath);
                const size = stat.size;
                const mtime = stat.mtime;

                // 获取文件类型
                const extname = path.extname(mdFile);
                const type = extname === '.md' ? 'Markdown' : 'Unknown';

                // 读取文件内容
                const content = fs.readFileSync(filePath, 'utf-8');

                // 输出文件信息和内容
                console.log(`File Name: ${mdFile}`);
                console.log(`Size: ${size} bytes`);
                console.log(`Type: ${type}`);
                console.log(`Last Modified Time: ${mtime}`);
                console.log(`Content: ${content}`);
            });
        }
    });
});








import {ipcMain,dialog,shell} from 'electron';
const fs = require("fs");
const path = require("path");
import {testDB} from "@/node/mysql";
import {getDirectoryTree} from "@/node/dictory";
import mysql from "mysql";
import {DateUtils} from "@/utils";
let connection = null;


ipcMain.on("appMounted", _ => {
    fs.readFile("./config/databaseConfig.json", {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let databaseconfig = JSON.parse(data);
            const pool = mysql.createPool({
                connectionLimit: 10,
                host: databaseconfig.host,
                user: databaseconfig.username,
                password: databaseconfig.password,
                database: databaseconfig.dbName,
                port: databaseconfig.port,
            })

            pool.getConnection(function (err, connections) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    connection = connections;
                }
            })
        }

    });
});

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

ipcMain.on("fileWrite", (event,[filePath,content]) => {
    // 创建目录
    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile(filePath, content, "utf8", function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    });

});

ipcMain.on("pathTree", (event, args) => {
    fs.readFile("./config/dataSourceConfig.json", {encoding: 'utf8'}, (err, data) => {
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


function doTagUpdate(articleId,tags) {
    if (!connection) return alert("请先连接数据库");
    tags.forEach(tag => {
        connection.query('SELECT * FROM tag WHERE tag_name = ?', [tag], (error, results) => {
            if (error) {
                console.error(error);
            } else {
                if (results.length === 0) {
                    // 标签不存在，创建标签
                    const createdAt = DateUtils().Date2Str(new Date());
                    connection.query('INSERT INTO tag (tag_name,c_time) VALUES (?, ?)', [tag, createdAt], (error, results) => {
                        if (error) {
                            console.error(error);
                        } else {
                            const tagId = results.insertId;
                            // 将标签添加到文章中
                            connection.query('INSERT INTO page_tag (page_id, tag_id) VALUES (?, ?)', [articleId, tagId], (error, results) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    console.log(`Tag ${tag} 已经新增并添加到文章 ${articleId}.`);
                                }
                            });
                        }
                    });
                } else {
                    const tagId = results[0].id;
                    // 将标签添加到文章中
                    connection.query('INSERT INTO page_tag (page_id, tag_id) VALUES (?, ?)', [articleId, tagId], (error, results) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(`Tag ${tag} 已经添加到文章  ${articleId}.`);
                        }
                    });
                }
            }
        });
    });
}

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
    let content = fs.readFileSync(dirPath, 'utf-8');

    const regex = /#[a-zA-Z0-9]+ /g;  // 匹配以 # 开头，空格结尾的字符串，其中只包含数字和字母
    const tags = content.match(regex); //找到匹配的
    content = content.replace(regex, "");

    // 输出文件信息和内容
    console.log(`File Name: ${mdFile}`);
    console.log(`Size: ${size} bytes`);
    console.log(`Type: ${type}`);
    console.log(`Last Modified Time: ${mtime}`);
    console.log(`Content: ${content}`);
    if (!connection) return alert('请先连接数据库');
    // 查询数据库中是否已经存在相同的文件名
    connection.query('SELECT * FROM blogPage WHERE filename = ?', [mdFile], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            // 如果存在相同的文件名，则比较修改时间
            const dbMtime = results[0].mtime;
            const articleId = results[0].id;
            if (mtime.getTime() > dbMtime.getTime()) {
                // 如果文件的修改时间比数据库中的大，则执行更新操作
                console.log(tags, 124);
                if (tags) {
                    doTagUpdate(articleId, tags, connection);
                }
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
                const articleId = results.insertId;
                if (tags) {
                    doTagUpdate(articleId, tags, connection);
                }
                console.log(`File ${mdFile} 新增成功`);
            });
        }
    });

});



//批量入库
ipcMain.on("fileSaves", (event, args) => {
    fs.readFile("./config/dataSourceConfig.json", {encoding: 'utf8'}, (err, data) => {
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

function queryBlogPage({ pageNum = 1, pageSize = 10, articleId, filename, author }) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM blogPage WHERE 1=1';
        if (articleId) {
            sql += ` AND article_id=${mysql.escape(articleId)}`;
        }
        if (filename) {
            sql += ` AND filename LIKE ${mysql.escape(`%${filename}%`)}`;
        }
        if (author) {
            sql += ` AND author=${mysql.escape(author)}`;
        }
        sql += ` ORDER BY mtime DESC LIMIT ${(pageNum - 1) * pageSize},${pageSize}`;

        connection.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const count = results.length;
                const list = results.slice((pageNum - 1) * pageSize, pageNum * pageSize);
                resolve({ count, list });
            }
        });
    });
}

ipcMain.on("getPages", (event, {filename, pageNum, pageSize}) => {
    queryBlogPage({pageNum, pageSize, filename}).then(data => {
        event.reply("fromMain", data);
    });
});


ipcMain.on("publish", (event, {pageIds, plat_id}) => {
    for (const pageId of pageIds) {
        const sql = `INSERT INTO page_platform (page_id, plat_id) VALUES (${mysql.escape(pageId)}, ${mysql.escape(plat_id)})`;
        connection.query(sql, (error, results) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Page ${pageId}已经发布到平台 ${plat_id}.`);
            }
        });
    }
});







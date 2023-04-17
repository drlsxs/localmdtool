import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

//单向通信
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        //渲染进程向主进程发信息  ipcRenderer.send("toMain",data);
        // whitelist channels
        // let validChannels = ['toMain']
        // if (validChannels.includes(channel)) {
        //     ipcRenderer.send(channel, data)
        // }
        ipcRenderer.send(channel, data);

    },
    receive: (channel, func) => {
        // let validChannels = ['fromMain']
        // if (validChannels.includes(channel)) {
        //     // Deliberately strip event as it includes `sender`
        //     ipcRenderer.on(channel, (event, ...args) => {
        //
        //     });
        // }
        ipcRenderer.once(channel, (_event,...arg) => {
            setTimeout(() => {
                func(_event, arg);
            }, 0);
        });
    }
})

//双向通信
contextBridge.exposeInMainWorld('electronAPI', {
    send2: (channel, data) => {
        method2(channel);
    },


});

const method2 = (channel) => ipcRenderer.invoke(channel);
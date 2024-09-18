import { ipcMain } from "electron";

const net = require('node:net');

class RocketSocket {
    constructor (webContents, ip, port, uuid) {
        this.ip   = ip;
        this.port = port;
        console.log(ip, port)

        this.trying = 0;
        this.last_try = 0;

        this.queue = [];
        this.ready = false;
        
        this.closed = false;

        this.uuid = uuid;
        this.channelRCV = `socket.ondata+${uuid}`;
        this.channelCLS = `socket.closed+${uuid}`;
        this.channelSND = `socket.sendpk+${uuid}`;
        
        console.log("ADD CHECK " + this.channelSND)
        ipcMain.handle( this.channelSND, (event, bytes) => {
            this.write(bytes);
        } )
        ipcMain.handle( this.channelCLS, (event) => {
            this.closed = true;
            this.socket.destroy();
        } )

        this.webContents = webContents;
        this.try_init();
    }

    retry_init (_try) {
        if (this.closed) return ;
        console.log("TRY TO RECONNECT")
        
        if (this.trying < _try) {
            this.trying = _try;
        } else return ;

        this.socket.destroy();
        this.init();
    }
    try_init () {
        this.ready = false;
        let current_try = this.last_try ++;

        const retry = () => this.retry_init(current_try);

        this.socket = new net.Socket();
        this.socket.connect({
            port: this.port,
            host: this.ip
        });

        this.socket.addListener("connectionAttemptFailed", retry)
        this.socket.addListener("close", retry);
        this.socket.addListener("end", retry);
        this.socket.addListener("ready", () => {
            this.on_ready();
        });
        this.socket.addListener("data", (data) => {
            console.log("RECV OF SIZE" + data.length, this.channelRCV);
            console.log(this.webContents.send(this.channelRCV, data))
        });
    }

    on_ready () {
        this.ready = true;

        for (let index = 0; index < this.queue.length; index ++)
            this.socket.write( this.queue[index] );
    }
    write (data) {
        if (!this.ready) {
            this.queue.push(data);
        } else this.socket.write( data, (err) => {
            this.queue.push(data);
            this.retry_init();
        } );
    }
}

export function initRocketSocket (webContents) {
    let uuid = 0;
    console.log("ADD HANDLER for socket.create")
    ipcMain.handle("socket.create", (event, ip, port) => {
        const uid = uuid; uuid ++;
        const rs = new RocketSocket(webContents, ip, port, uid);
        return uid;
    });
}

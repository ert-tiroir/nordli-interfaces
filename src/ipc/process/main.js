import { ipcMain, webContents } from "electron";

const { spawn } = require("node:child_process");

const processes = {};
let lastUUID = 0;

export function initMainProcess () {
    ipcMain.handle( "process.create", (event, cmd, args) => {
        const controller = new AbortController();
        const { signal } = controller;

        const proc = spawn(cmd, args, { signal });

        processes[lastUUID] = { proc, controller };

        let result = lastUUID.toString();

        proc.stdout.on( "data", (data) => {
            console.log("STDOUT", data);
            event.sender.send( "process.event.stdout", result, data );
        } );
        proc.stderr.on( "data", (data) => {
            console.log("STDERR", data);
            event.sender.send( "process.event.stderr", result, data );
        } );
        proc.on( "close", (code) => {
            console.log("CLOSE")
            event.sender.send( "process.event.close", result, code );
            proc.removeAllListeners();
            delete processes[result];
        } );
        proc.on('error', (err) => {
            console.log("ERROR", err);
            event.sender.send( "process.event.error", result, err );
            proc.removeAllListeners();
            delete processes[result];
        } )

        lastUUID ++;
        return result;
    } )
    ipcMain.handle( "process.destroy", (event, uuid) => {
        const proc = processes[uuid];
        if (proc === undefined) return ;

        const controller = proc.controller;
        controller.abort();
        
        proc.removeAllListeners();
        delete processes[uuid];
    } );
}

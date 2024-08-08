import { ipcMain } from "electron";
import { readFileSync } from "original-fs";

export function initMainFS () {
    ipcMain.handle("fs.readFile", async (event, ...args) => {
        try {
            let options = {};
            if (args.length >= 2) options = args[1];
            const path = args[0];
            return [ null, readFileSync( path, options ) ];
        } catch (exception) {
            return [ exception, null ];
        }
    });
}

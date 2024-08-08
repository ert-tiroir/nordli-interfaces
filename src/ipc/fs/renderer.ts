
import { ipcRenderer } from "electron";

export class FileSystem {
    private static _instance: FileSystem;
    
    private constructor () {}

    static get instance (): FileSystem {
        return (this._instance) || (this._instance = new this());
    }

    async readFile (path: string, options: any, callback: (err: any, data: any) => void) {
        const [err, data] = await ipcRenderer.invoke("fs.readFile", path, options);
    
        callback(err, data);
    }
};

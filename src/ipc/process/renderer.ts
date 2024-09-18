import { ipcRenderer } from "electron";

export class ChildProcessManager {
    private static _instance: ChildProcessManager;

    private processList: { [key: string]: ChildProcess };
    
    private constructor () {
        this.processList = {};

        const addEventListener = (target: string, callback: string) => {
            ipcRenderer.on( target, (_event, proc, ...args) => {
                const process = this.processList[proc];
                if (!process) return ;

                process[callback](...args);
            } )
        }

        addEventListener("process.event.stdout", "__onStdout");
        addEventListener("process.event.stderr", "__onStderr");
        addEventListener("process.event.close",  "__onClose");
        addEventListener("process.event.error",  "__onError");
    }

    static get instance (): ChildProcessManager {
        return (this._instance) || (this._instance = new this());
    }

    async register ( process: ChildProcess ): Promise<string> {
        return new Promise(async (resolve, _reject) => {
            const uuid: string = await ipcRenderer.invoke( "process.create", process.cmd, process.args );

            this.processList[uuid] = process;

            resolve(uuid);
        });
    }
    close ( process: ChildProcess ) {
        if (!this.processList[process.uuid]) return ;

        ipcRenderer.invoke("process.destroy", process.uuid);
    }
};

export class ChildProcess {
    readonly cmd  : string;
    readonly args : string[];

    private _uuid : string;

    get uuid (): string {
        return this._uuid;
    }

    constructor (cmd: string, args: string[]) {
        this.cmd = cmd;
        this.args = args;
    }

    async init () {
        this._uuid = await ChildProcessManager.instance.register(this);
    }
    async write (data: any) {
        await ipcRenderer.invoke("process.send.stdin", this._uuid, data);
    }
    async close () {
        ChildProcessManager.instance.close(this);
    }

    onstdout: (data: Buffer) => void;
    onstderr: (data: Buffer) => void;
    onclose : (code: number) => void;
    onerror : (error: Error) => void;

    __onStdout (data: Buffer) { if (this.onstdout) this.onstdout(data); }
    __onStderr (data: Buffer) { if (this.onstderr) this.onstderr(data); }
    __onClose  (code: number) { if (this.onclose)  this.onclose(code);  }
    __onError  (error: Error) { if (this.onerror)  this.onerror(error); }
};

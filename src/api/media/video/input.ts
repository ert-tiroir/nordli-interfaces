
import { FileSystem } from "../../../ipc/fs/renderer";
import { VideoEngine } from "./engine";

export abstract class VideoInputDevice {
    abstract init (engine: VideoEngine): void;
};

export class FileVideoInput extends VideoInputDevice {
    readonly path: string;
    readonly fs  : FileSystem;

    constructor (path: string, fs: FileSystem) {
        super();

        this.path = path;
        this.fs = fs;
    }
    
    init(engine: VideoEngine) {
        this.fs.readFile( this.path, { encoding: null }, (err, data) => {
            if (err) {
                console.error(err);
                return ;
            }

            engine.onStart ();
            engine.onData  (data);
            engine.onEnd   ();
        } );
    }
}

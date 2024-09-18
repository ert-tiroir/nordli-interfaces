import { ChildProcess } from "../../../../ipc/process/renderer.ts";
import { VideoMiddlewareDevice } from "../middleware.ts";

export class FFMPEGDashMiddleware extends VideoMiddlewareDevice {
    
    init(callback: (data: Buffer) => void): {
        onstart: () => void,
        ondata: (data: Buffer) => void,
        onend: () => void
    } {
        const proc = new ChildProcess( "ffmpeg", [ "-i", "-", "-g", "52", "-movflags", "frag_keyframe+empty_moov+default_base_moof", "-f", "mp4", "-" ] );
        proc.onstdout = (data: Buffer) => {
            callback(data);
        };
        
        return {
            onstart: () => {
                proc.init()
            },
            ondata : (data: Buffer) => {
                proc.write(data);
            },
            onend : () => {
                //proc.close();
            }
        }
    }

}

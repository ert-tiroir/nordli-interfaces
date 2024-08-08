import { VideoInputDevice } from "./input.ts";
import { VideoOutputDevice } from "./output.ts";

export class VideoEngine {
    readonly input  : VideoInputDevice;
    readonly output : VideoOutputDevice;

    constructor (input : VideoInputDevice, output: VideoOutputDevice) {
        this.input  = input;
        this.output = output;
    }

    init () {
        this.input.init(this);
    }

    onStart () {
        this.output.onStart();
    }
    onData (data: Buffer) {
        this.output.onData(data);
    }
    onEnd () {
        this.output.onEnd();
    }
};

import { RocketAPI } from "../../api.ts";
import { VideoDataEvent, VideoEndEvent, VideoStartEvent } from "./event.ts";

export abstract class VideoOutputDevice {
    abstract onStart ();
    abstract onData  (data: Buffer);
    abstract onEnd   ();
};

export class ChannelVideoOutputDevice extends VideoOutputDevice {
    onStart() {
        RocketAPI.instance.dispatch( new VideoStartEvent() );
    }
    onData(data: Buffer) {
        RocketAPI.instance.dispatch( new VideoDataEvent(data) );
    }
    onEnd() {
        RocketAPI.instance.dispatch( new VideoEndEvent() );
    }
};
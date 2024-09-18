import { SocketManager } from "../../../ipc/socket/renderer.ts";
import { VideoEngine } from "./engine.ts";
import { VideoInputDevice } from "./input.ts";
import { FFMPEGDashMiddleware } from "./middlewares/muxer.ts";
import { ChannelVideoOutputDevice } from "./output.ts";

class Reference<T> {
    _ref: T;

    set (val: T) {
        this._ref = val;
    }
    get () {
        return this._ref;
    }
}

class VideoInput extends VideoInputDevice {
    engine: VideoEngine;

    init(engine: VideoEngine): void {
        this.engine = engine;

        this.engine.onStart();
    }
};

export function bindVideo (socket: SocketManager) {
    const engineRef = new Reference<VideoEngine>();
    socket.on('/camera/model/event/start', () => {
        const engine = new VideoEngine(
            new VideoInput(),
            new ChannelVideoOutputDevice(),
            [ new FFMPEGDashMiddleware() ]
        );

        engineRef.set(engine);

        engine.init();
    })

    socket.on('/camera/model/media', (packet) => {
        engineRef.get().onData(packet.data);
        console.log("RECEIVED MEDIA" + packet);
    })

    socket.on('/camera/model/event/stop', () => engineRef.get().onEnd());
}

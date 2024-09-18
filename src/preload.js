// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { RocketAPI } from "./api/api.ts";
import { EVENT_TYPES } from "./api/events.ts";
import { VideoEngine } from "./api/media/video/engine.ts";
import { FileVideoInput } from "./api/media/video/input.ts";
import { FileSystem } from "./ipc/fs/renderer.ts";
import { ChannelVideoOutputDevice } from "./api/media/video/output.ts";
import { ChildProcess } from "./ipc/process/renderer.ts";
import { FFMPEGDashMiddleware } from "./api/media/video/middlewares/muxer.ts";
import { BytesOutput, packetToBytes, bytesToPacket, createSocketManager } from "./ipc/socket/renderer.ts";
import { bindVideo } from "./api/media/video/socket.ts";

const rocket = RocketAPI.instance;

contextBridge.exposeInMainWorld( "_rocket", rocket.getExposed() );
contextBridge.exposeInMainWorld( "rocketEventsList", EVENT_TYPES );

//const output = new BytesOutput();
//output.writeInt(4, 257, "big");
//output.writeInt(4, -257, "big");
//console.log(output.data);
//
//console.log(bytesToPacket(packetToBytes({
//    _packet_index: 2,
//    data: Buffer.from([ 0x21, 0x35, 0x21, 0x65, 0x12 ]),
//    id: 0
//})));

setTimeout(
(async () => {
    const socket = await createSocketManager("172.20.10.2", 5042);

    socket.send({
        _packet_index: 0,
        control_key: 0,
        control_salt: 0
    })

    bindVideo(socket);
}), 1000)

const fs = FileSystem.instance;
contextBridge.exposeInMainWorld( "ffmpeg", () => {
const engine = new VideoEngine(
    new FileVideoInput( "tests/media/result.mp4", fs ),
    new ChannelVideoOutputDevice (),
    [ new FFMPEGDashMiddleware() ]
);
engine.init();
})

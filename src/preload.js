// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { RocketAPI } from "./api/api.ts";
import { EVENT_TYPES } from "./api/events.ts";
import { VideoEngine } from "./api/media/video/engine.ts";
import { FileVideoInput } from "./api/media/video/input.ts";
import { FileSystem } from "./ipc/fs/renderer.ts";
import { ChannelVideoOutputDevice } from "./api/media/video/output.ts";

const rocket = RocketAPI.instance;

contextBridge.exposeInMainWorld( "_rocket", rocket.getExposed() );
contextBridge.exposeInMainWorld( "rocketEventsList", EVENT_TYPES );

const fs = FileSystem.instance;
contextBridge.exposeInMainWorld( "ffmpeg", () => {
const engine = new VideoEngine(
    new FileVideoInput( "tests/media/result.mp4", fs ),
    new ChannelVideoOutputDevice ()
);
engine.init();
})

ipcRenderer.invoke("process.create", "ls", [ "-al" ]);
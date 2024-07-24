// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { RocketAPI } from "./api/api.ts";
import { EVENT_TYPES } from "./api/events.ts";

const rocket = RocketAPI.instance;

contextBridge.exposeInMainWorld( "_rocket", rocket.getExposed() );
contextBridge.exposeInMainWorld( "rocketEventsList", EVENT_TYPES );

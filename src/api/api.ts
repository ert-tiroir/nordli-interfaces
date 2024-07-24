import { ProtoMap } from "../protomap.ts";
import { Alert } from "./alert/event.ts";
import { Event, EVENT_TYPES, EventCallback } from "./events.ts";

export class RocketAPI {
    private static _instance: RocketAPI;
    
    private callbackContainers : { [key: string] : { [uuid: string]: EventCallback } };
    private callbackTarget     : { [key: string] : string };
    private callbackMaxUUID    : number;

    private constructor() {
        this.callbackContainers = {};
        this.callbackTarget     = {};

        this.callbackMaxUUID = 0;
    }

    public static get instance()
    {
        return this._instance || (this._instance = new this());
    }

    subscribe (key: string, callback: EventCallback): string {
        let uuid = ( this.callbackMaxUUID ++ ).toString();

        this.callbackTarget[uuid] = key;
        
        if (this.callbackContainers[key] === undefined)
            this.callbackContainers[key] = {};
        this.callbackContainers[key][uuid] = callback;

        return uuid;
    }
    unsubscribe (uuid: string) {
        const eventType = this.callbackTarget[uuid];
        if (eventType === undefined) return ;
        
        const container = this.callbackContainers[eventType];
        if (container && container[uuid]) delete container[uuid];

        if (container && Object.keys( container ).length == 0)
            delete this.callbackContainers[eventType];
        delete this.callbackTarget[uuid];
    }

    dispatch (event: Event) {
        const name = event.getName();
        if (this.callbackContainers[name] === undefined) return ;

        for (let key in this.callbackContainers[name]) {
            let callback = this.callbackContainers[name][key];

            callback(event);
        }
    }

    getExposed () {
        return {
            subscribe: (key: string, callback: EventCallback) => this.subscribe(key, 
                ProtoMap.wrapSender( callback )),
            unsubscribe: (uuid: string) => this.unsubscribe(uuid),

            alert: {
                debug    : (title: string, message: string) => Alert.sendDebug    (title, message),
                info     : (title: string, message: string) => Alert.sendInfo     (title, message),
                warning  : (title: string, message: string) => Alert.sendWarning  (title, message),
                danger   : (title: string, message: string) => Alert.sendDanger   (title, message),
                critical : (title: string, message: string) => Alert.sendCritical (title, message),
                success  : (title: string, message: string) => Alert.sendSuccess  (title, message)
            },
        };
    }
};

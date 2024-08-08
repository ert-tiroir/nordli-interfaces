import { Alert } from "./api/alert/event.ts";
import { VideoDataEvent, VideoEndEvent, VideoStartEvent } from "./api/media/video/event.ts";
import { NetworkChangedEvent, NetworkInitEvent } from "./api/network/events.ts";

type ProtoType = { prototype: { index: number } };

const PROTO_TYPES: ProtoType[] = [
    Alert,

    NetworkChangedEvent,
    NetworkInitEvent,

    VideoStartEvent,
    VideoDataEvent,
    VideoEndEvent
] as any[];

let protoInit: boolean = false;

function initializeProtoMap () {
    if (protoInit) return ;

    protoInit = true;
    for (let i = 0; i < PROTO_TYPES.length; i ++)
        PROTO_TYPES[i].prototype.index = i;
}

export const ProtoMap = {
    stringify : (args: any[]) => {
        initializeProtoMap();

        let res: any[] = [];
        for (let arg of args) {
            if (arg === undefined || arg === null) {
                res.push(arg);
                continue ;
            }

            let prototype: any = Object.getPrototypeOf(arg);

            let index: number = -1;
            if (prototype.index !== undefined) index = prototype.index;

            res.push({ index, value: arg });
        }

        return res;
    },
    parse : (args: { index: number, value: any }[]) => {
        initializeProtoMap();

        let res: any[] = [];
        for (let arg of args) {
            if (arg === undefined || arg === null) {
                res.push(arg);
                continue ;
            }

            if (arg.index != -1)
                Object.setPrototypeOf(arg.value, PROTO_TYPES[arg.index].prototype);
        
            res.push( arg.value );
        }

        return res;
    },

    wrapReceiver : function wrapReceiver<T extends Array<any>, U> (callback: (...args: T) => U) {
        return (...f_args: T) => {
            const t_args: T = ProtoMap.parse(f_args as any) as T;
            
            const t_res: U = callback( ...t_args ) as U;

            return ProtoMap.stringify( [ t_res ] as any )[0] as U;
        };
    },
    wrapSender : function wrapSender<T extends Array<any>, U> (callback: (...args: T) => U) {
        return (...args: T) => {
            const t_args: T = ProtoMap.stringify(args) as T;

            const f_res = callback( ...t_args );
        
            return ProtoMap.parse([ f_res ] as any)[0] as U;
        };
    }
};

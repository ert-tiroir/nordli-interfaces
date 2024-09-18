
import { ipcRenderer } from "electron";
import { Queue, RotatingBuffer } from "../../utils/queue.ts";

const manifest = {
    "payload": [
        {
            "index": 0,
            "target": "/camera/control/start",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "control_key",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    },
                    {
                        "index": 1,
                        "key": "control_salt",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    }
                ]
            }
        },
        {
            "index": 1,
            "target": "/camera/control/stop",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "control_key",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    },
                    {
                        "index": 1,
                        "key": "control_salt",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    }
                ]
            }
        },
        {
            "index": 2,
            "target": "/camera/model/event/end",
            "packet": {
                "type": "multi",
                "fields": []
            }
        },
        {
            "index": 3,
            "target": "/camera/model/event/start",
            "packet": {
                "type": "multi",
                "fields": []
            }
        },
        {
            "index": 4,
            "target": "/camera/model/media",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "data",
                        "field": {
                            "type": "bytes",
                            "size": 2147483647,
                            "subint": {
                                "type": "int",
                                "size": 4,
                                "encoding": "big"
                            }
                        }
                    },
                    {
                        "index": 1,
                        "key": "id",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    }
                ]
            }
        },
        {
            "index": 5,
            "target": "/control/start",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "control_key",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    },
                    {
                        "index": 1,
                        "key": "control_salt",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    }
                ]
            }
        },
        {
            "index": 6,
            "target": "/control/stop",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "control_key",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    },
                    {
                        "index": 1,
                        "key": "control_salt",
                        "field": {
                            "type": "int",
                            "size": 4,
                            "encoding": "big"
                        }
                    }
                ]
            }
        },
        {
            "index": 7,
            "target": "/sensors/data/dps310",
            "packet": {
                "type": "multi",
                "fields": [
                    {
                        "index": 0,
                        "key": "pressure",
                        "field": {
                            "type": "float",
                            "size": 4
                        }
                    },
                    {
                        "index": 1,
                        "key": "temperature",
                        "field": {
                            "type": "float",
                            "size": 4
                        }
                    }
                ]
            }
        }
    ],
    "pid_sze": 1
}

const prototypes = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
];

const callbacks: ((packet: any) => void)[] = [];
for (let i = 0; i < manifest.payload.length; i ++) callbacks.push(() => null)

export type IntegerField = {
    type: "int",
    size: number,
    encoding: "big" | "little"
};
export type BytesField = {
    type: "bytes",
    size: number,
    subint: IntegerField
}
export type StringField = {
    "type": "string",
    "encoding": string,
    "subbytes": BytesField
}
export type FloatField = {
    "type": "float",
    "size": 4
}
export type DoubleField = {
    "type": "double",
    "size": 8
}
export type MultiField = {
    "type": "multi",
    "fields": {
        "index": number,
        "key"  : string,
        "field": Field
    }[]
}

export type Field = IntegerField | FloatField | DoubleField | BytesField | StringField | MultiField;
export type Packet = {

}

export class BytesOutput {
    data: Buffer[];

    constructor () {
        this.data = [];
    }
    asBytes () {
        return Buffer.concat(this.data);
    }

    writeInt (size: number, value: number, encoding: string) {
        const buffer = Buffer.alloc(size);
        
        const big = encoding == "big";

        let rme = 1;
        for (let i = 0; i < size; i ++) rme = rme * 256;

        if (value < 0) {
            value = - value;
            value %= rme;
            value = rme - value;
        }
        value %= rme;

        for (let i = 0; i < size; i ++) {
            let j = !big ? i : size - 1 - i;

            buffer.writeUInt8(value % 256, j);
            value = Math.floor(value / 256);
        }

        this.data.push( buffer );
    }
    writeFloat (float: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeFloatBE(float, 0);
        this.data.push(buffer);
    }
    writeDouble (double: number) {
        const buffer = Buffer.alloc(8);
        buffer.writeDoubleBE(double, 0);
        this.data.push(buffer);
    }
    writeBytes (data: Buffer) {
        this.data.push( data );
    }
}

export class BytesInput {
    data: Buffer;
    offset: number;

    constructor (data: Buffer) {
        this.data = data;
        this.reset();
    }

    reset () {
        this.offset = 0;
    }

    peek (delta: number) {
        return this.data[delta + this.offset];
    }
    readInt (size: number, encoding: string) {
        let result = 0;
        let frame  = 1;
        const big = encoding == "big";
        for (let index = 0; index < size; index ++) {
            let ti = !big ? index : size - 1 - index;
            
            result += this.peek(ti) * frame;
            frame *= 256;
        }

        this.offset += size;
        return result;
    }
    readFloat () {
        let res = this.data.readFloatBE(this.offset);
        this.offset += 4;
        return res;
    }
    readDouble () {
        let res = this.data.readDoubleBE(this.offset);
        this.offset += 8;
        return res;
    }
    readBytes (size: number) {
        const alloc = Buffer.alloc(size);
        for (let index = 0; index < size; index ++)
            alloc[index] = this.data[index + this.offset];
        this.offset += size;
        return alloc;
    }
};

export function traverseOutput (output: BytesOutput, manifest: Field, data: any) {
    if (manifest.type == "int") {
        output.writeInt(manifest.size, data, manifest.encoding);
    } else if (manifest.type == "float") {
        output.writeFloat(data);
    } else if (manifest.type == "double") {
        output.writeDouble(data);
    } else if (manifest.type == "bytes") {
        traverseOutput(output, manifest.subint, data.length);
        output.writeBytes(data);
    } else if (manifest.type == "string") {
        let bytes = Buffer.from(data, manifest.encoding as any)
        traverseOutput(output, manifest.subbytes, bytes);
    } else {
        for (let index = 0; index < manifest.fields.length; index ++) {
            const field = manifest.fields[index];
            if (field.index != index) throw "ERROR Improper manifold";

            traverseOutput(output, field.field, data[field.key]);
        }
    }
}
export function traverseInput (input: BytesInput, manifest: Field) {
    if (manifest.type == "int") {
        return input.readInt(manifest.size, manifest.encoding);
    } else if (manifest.type == "float") {
        return input.readFloat();
    } else if (manifest.type == "double") {
        return input.readDouble();
    } else if (manifest.type == "bytes") {
        const size = traverseInput(input, manifest.subint);
        console.log("BYTES OF SIZE " + size)
        return input.readBytes(size);
    } else if (manifest.type == "string") {
        const bytes = traverseInput(input, manifest.subbytes) as Buffer;
        return bytes.toString(manifest.encoding as any);
    } else {
        const result = {};
        for (let index = 0; index < manifest.fields.length; index ++) {
            const field = manifest.fields[index];
            if (field.index != index) throw "ERROR Improper manifold";

            result[field.key] = traverseInput(input, field.field);
        }
        return result;
    }
}

export function packetToBytes (data: any) {
    const field = manifest.payload[data._packet_index].packet as Field;
    
    const buffer = new BytesOutput();
    traverseOutput(buffer, field, data);
    const payload = buffer.asBytes();

    const header = new BytesOutput();
    header.writeInt(8, manifest.pid_sze + payload.length, "big");
    header.writeInt(manifest.pid_sze, data._packet_index, "big");

    return Buffer.concat([ header.asBytes(), payload ]);
}

export function bytesToPacket (bytes: Buffer) {
    if (bytes.length < 8) return undefined;
    const input = new BytesInput(bytes);
    const size  = input.readInt( 8, "big" );

    if (size + 8 > bytes.length) return undefined;

    const pid = input.readInt(manifest.pid_sze, "big");
    console.log("PID " + pid)

    const payload = traverseInput(input, manifest.payload[pid].packet as Field);
    payload._packet_index = pid;

    if (prototypes[pid])
        Object.setPrototypeOf(payload, prototypes[pid]);

    return [ payload, size + 8 ];
}

export class SocketManager {
    uuid: string;

    channelRCV: string;
    channelSND: string;
    channelCLS: string;

    constructor (uuid: number) {
        this.uuid = (uuid as number).toString();
    
        this.channelCLS = `socket.closed+${uuid}`;
        this.channelRCV = `socket.ondata+${uuid}`;
        this.channelSND = `socket.sendpk+${uuid}`;

        const buffer = new RotatingBuffer()

        console.log("CREATED")
        console.log(this.channelRCV)
        ipcRenderer.addListener(this.channelRCV, (event, data: Buffer) => {
            buffer.put(data);

            while (true) {
                console.log("START RUN")
                console.log(buffer.length)
                if (buffer.length < 8) return ;
                
                const _buffer = buffer.view_normal();
                console.log(_buffer);

                let size = new BytesInput( _buffer ).readInt(8, "big");
                console.log("SIZE " + size + " " + buffer.length);
                if (buffer.length < size + 8) return ;

                console.log("READING PACKET")

                const _payload = bytesToPacket(_buffer);
                console.log(_payload)
                if ( _payload === undefined) return ;
                const [ packet, crop ] = _payload;

                callbacks[packet._packet_index](packet);
                
                buffer.pop( crop );
            }
        })
    }

    send (packet) {
        const bytes = packetToBytes( packet );

        ipcRenderer.invoke( this.channelSND, bytes );
    }
    close () {
        ipcRenderer.invoke (this.channelCLS);
    }

    on (channel: string, callback: (packet: any) => void) {
        for (let packet of manifest.payload) {
            if (packet.target === channel) {
                callbacks[packet.index] = callback;
                return packet.index;
            }
        }

        return -1;
    }
};

export async function createSocketManager (ip: string, port: number) {
    return new SocketManager(await ipcRenderer.invoke("socket.create", ip, port));
}

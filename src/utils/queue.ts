
export class RotatingBuffer {
    private _buffer: Buffer;

    private mxsize : number;
    private size   : number;
    private off    : number;

    constructor () {
        this.size = 0;
        this.off  = 0;

        this._buffer = Buffer.alloc( 10_000_000 );
        this.mxsize  = 5_000_000;
    }

    view_normal () {
        return this._buffer.subarray(this.off);
    }
    normalize (target_size: number | undefined = undefined) {
        if (target_size === undefined) target_size = this.mxsize;
        
        const buffer = Buffer.alloc(2 * target_size);
        for (let i = 0; i < this.size; i ++) {
            buffer[i] = this._buffer[i + this.off];
        
            buffer[i + target_size] = buffer[i];
        }

        this._buffer = buffer;

        this.mxsize = target_size;
        this.off    = 0;
    }
    put (data: Buffer) {
        while (data.length + this.size > this.mxsize)
            this.normalize(this.mxsize * 2);
        
        let offset = this.off + this.size;
        for (let i = 0; i < data.length; i ++) {
            if (offset == this.mxsize) offset = 0;
            this._buffer[offset] = data[i];
            this._buffer[offset + this.mxsize] = data[i];
            this.size ++;

            offset ++;
        }
    }
    pop (length: number) {
        this.size -= length;
        this.off  += length;
        this.off  %= this.mxsize;

        if (this.off * 2 >= this.mxsize) this.normalize();
    }

    get length () {
        return this.size;
    }
}

export class Queue<T> {
    private data: (T | undefined)[];

    private offset   : number;
    private inn_size : number;
    private max_size : number;

    private put (target: (T | undefined)[]) {
        for (let idx = 0; idx < this.inn_size && idx < target.length; idx ++) {
            let jdx = (this.offset + idx);
            if (jdx >= this.max_size) jdx -= this.max_size;

            target[idx] = this.data[idx];
        }
    }
    private create_array (size: number): (T | undefined)[] {
        let array: (T | undefined)[] = [];
        for (let i = 0; i < size; i ++) array.push(undefined);
    
        return array;
    }
    private double_size () {
        let new_size = 2 * this.inn_size;
        if (new_size <= 0) new_size = 1;

        let new_data = this.create_array(new_size);
        this.put(new_data);

        this.data = new_data;
        this.offset = 0;
    }
    private remap (index: number): number {
        return index % this.max_size;
    }

    constructor (basis?: T[]) {
        let new_basis: (T | undefined)[];
        let size: number = 0;
        if (basis === undefined || basis.length == 0) new_basis = [ undefined ];
        else {
            new_basis = basis;
            size = basis.length;
        } 
        
        this.data     = new_basis;
        this.offset   = 0;
        this.max_size = new_basis.length;
        this.inn_size = size;
    }

    push (x: T) {
        if (this.inn_size === this.max_size)
            this.double_size();
        
        let push_index = this.remap(this.offset + this.inn_size);
        this.data[push_index] = x;
        this.inn_size ++;
    }
    peek (): T {
        return this.data[this.offset] as T;
    }
    poll (): T {
        let val = this.peek();
        this.offset ++;
        if (this.offset == this.max_size) this.offset = 0;
        this.inn_size --;

        return val;
    }
    isEmpty (): boolean {
        return this.size() == 0;
    }
    size (): number {
        return this.inn_size;
    }
};

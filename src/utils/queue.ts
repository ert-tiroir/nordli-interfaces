
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
        console.log(x)
        if (this.inn_size === this.max_size)
            this.double_size();
        
        let push_index = this.remap(this.offset + this.inn_size);
        this.data[push_index] = x;
        this.inn_size ++;
        console.log(this.data, this.offset, this.inn_size, this.max_size)
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


export abstract class VideoMiddlewareDevice {
    abstract init ( callback: (data: Buffer) => void ): {
        onstart: () => void,
        ondata: (data: Buffer) => void,
        onend: () => void
    };
};

export interface ContainerStats {
    cpu: number;
    io: {
        blockReadBytes: number;
        blockWriteBytes: number;
    };
    network: {
        receiveBytes: number;
        transportBytes: number;
    };
    mem: {
        memUsage: number;
        limit: number
    };
    pidsStats: {
        current: number;
    };
    time: Date;
}
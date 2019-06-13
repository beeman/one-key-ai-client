import { AbstractTerminal } from '../abstract-terminal';

export class Terminal extends AbstractTerminal {
    private pid = -1;

    constructor() {
        super();
    }

    protected startConnect(): void {
        this.socket.emit('terminal', { pid: '', cols: this.term.cols, rows: this.term.rows });
        this.socket.on('pid', (data) => {
            this.pid = data;
        })
    }
}
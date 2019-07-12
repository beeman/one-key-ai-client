import { AbstractTerminal } from '../../../../shared/abstract-terminal';

export class DockerTerminal extends AbstractTerminal {
    constructor(private readonly containerId: string) {
        super();
    }

    protected startConnect(): void {
        this.socket.emit('exec', { id: this.containerId, cols: this.term.cols, rows: this.term.rows });
    }
}

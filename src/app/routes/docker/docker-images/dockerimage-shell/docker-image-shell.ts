import { AbstractTerminal } from '../../../../shared/abstract-terminal';

export class DockerImageShell extends AbstractTerminal {
    constructor() {
        super();
    }

    protected startConnect(): void {
    }

    public startPull(name: string): void {
        this.socket.emit('pullImage', { name: name, cols: this.term.cols, rows: this.term.rows });
    }

    public stopPull(): void {
        this.socket.emit('stop');
    }
}
import { Terminal } from 'xterm/lib/public/Terminal';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

import * as io from 'socket.io-client';

import { Terminal as TerminalType } from 'xterm';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EventEmitter } from 'events';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(winptyCompat);

export abstract class AbstractTerminal {
    protected term: Terminal;
    protected socket: SocketIOClient.Socket;
    private state = new EventEmitter();
    private isAttachDom = false;

    constructor() { }

    public attachDom(dom: HTMLElement): void {
        if (this.isAttachDom) {
            return;
        }
        if (dom.clientWidth === 0 || dom.clientHeight === 0) {
            return;
        }

        if (this.term) {
            this.term.open(dom);
            this.term.winptyCompatInit();
            this.term.webLinksInit();
            this.term.fit();
            this.term.focus();

            this.isAttachDom = true;
        }
    }

    public createTerminal(container: HTMLElement): void {
        this.term = new Terminal({});

        this.createElement(container);
        this.createServerTerminal();
    }

    public clear(): void {
        this.getTerm().clear();
    }

    public destroy(): void {
        this.socket.close();
        this.getTerm().dispose();
    }

    public emit(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
        // this.socket.send(data);
        this.socket.emit('data', data);
    }

    public getTerm(): TerminalType {
        return this.term;
    }

    public getState(): EventEmitter {
        return this.state;
    }

    private createElement(container: HTMLElement): void {
        // this.term.open(container);
        this.attachDom(container);

    }

    private createServerTerminal(): void {
        // fit is called within a setTimeout, cols and rows need this.
        setTimeout(() => {
            this.initOptions(this.term);
            // const port = 3000;
            // const socketURL = location.protocol + '//' + location.hostname + ':' + port;

            this.socket = io(environment.serverUrl);
            this.socket.on('connect', this.runRealTerminal);
            this.socket.on('disconnect', this.disconnectPrompt);
            this.socket.on('error', this.disconnectPrompt);
        }, 0);
    }

    private initOptions(term: TerminalType): void {
        const blacklistedOptions = [
            // Internal only options
            'cancelEvents',
            'convertEol',
            'debug',
            'handler',
            'screenKeys',
            'termName',
            'useFlowControl',
            // Complex option
            'theme'
        ];
        const stringOptions = {
            bellSound: null,
            bellStyle: ['none', 'sound'],
            cursorStyle: ['block', 'underline', 'bar'],
            experimentalCharAtlas: ['none', 'static', 'dynamic'],
            fontFamily: null,
            fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            fontWeightBold: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            rendererType: ['dom', 'canvas']
        };
        const options = Object.keys((<any>term)._core.options);
        const booleanOptions = [];
        const numberOptions = [];
        options.filter(o => blacklistedOptions.indexOf(o) === -1).forEach(o => {
            switch (typeof term.getOption(o)) {
                case 'boolean':
                    booleanOptions.push(o);
                    break;
                case 'number':
                    numberOptions.push(o);
                    break;
                default:
                    if (Object.keys(stringOptions).indexOf(o) === -1) {
                        console.warn(`Unrecognized option: "${o}"`);
                    }
            }
        });
    }

    protected abstract startConnect(): void;

    private runRealTerminal = (): void => {
        this.startConnect();

        if (this.socket.hasListeners('data')) {
            return;
        }

        this.socket.on('data', (data) => {
            this.term.write(data);
        });
        this.socket.on('err', (value) => {
            this.socket.disconnect();
            this.state.emit('err', value);
        });
        this.socket.on('end', (value) => {
            this.socket.disconnect();
            this.state.emit('end', value);
        });
        fromEvent(this.term, 'data').pipe(throttleTime(1)).subscribe(value => {
            this.socket.emit('data', value);
        });
    }

    private disconnectPrompt = (): void => {
        if (this.term._initialized) {
            return;
        }
        this.term.prompt = () => {
            this.term.write('\r\n');
        };

        this.term._initialized = true;

        this.term.writeln('服务器连接失败');
        this.term.prompt();

    }

    private runFakeTerminal = (): void => {
        this.disconnectPrompt();

        this.term._core.register(this.term.addDisposableListener('key', (key, ev) => {
            const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) {
                this.term.prompt();
            } else if (ev.keyCode === 8) {
                // Do not delete the prompt
                if (this.term.x > 2) {
                    this.term.write('\b \b');
                }
            } else if (printable) {
                this.term.write(key);
            }
        }));

        this.term._core.register(this.term.addDisposableListener('paste', (data, ev) => {
            this.term.write(data);
        }));
    }
}

import { Terminal } from 'xterm/lib/public/Terminal';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

import { Terminal as TerminalType } from 'xterm';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(winptyCompat);

export class TerminalController {
    private term: Terminal;
    private socket: WebSocket;

    constructor(private readonly http: HttpClient, private readonly logger: NGXLogger) { }

    public createTerminal(container: HTMLElement): void {
        this.term = new Terminal({});

        this.createElement(container);
        this.createServerTerminal();
    }

    public clear(): void {
        this.getTerm().clear();
    }

    public ctrlC(): void {
        this.socket.send('\u0003');
    }

    public destroy(): void {
        this.socket.close();
        this.getTerm().dispose();
    }

    public emit(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
        this.socket.send(data);
        // (<TerminalType>(this.term)).emit('data', text + '\n');
    }

    public getTerm(): TerminalType {
        return this.term;
    }

    // public socketState(): Observable<string> {
    //     return new Observable(observer => {
    //         const openFun = () => {
    //             observer.next('open');
    //         };
    //         const closeFun = () => {
    //             observer.next('close');
    //             complete();
    //         };
    //         const errorFun = () => {
    //             observer.next('error');
    //             complete();
    //         }
    //         const complete = () => {
    //             observer.complete();
    //             this.socket.removeEventListener('open', openFun);
    //             this.socket.removeEventListener('close', closeFun);
    //             this.socket.removeEventListener('error', errorFun);
    //         }

    //         this.socket.addEventListener('open', openFun);
    //         this.socket.addEventListener('close', closeFun);
    //         this.socket.addEventListener('error', errorFun);
    //     });
    // }

    private createElement(container: HTMLElement): void {
        this.term.open(container);
        this.term.winptyCompatInit();
        this.term.webLinksInit();
        this.term.fit();
        this.term.focus();
    }

    private createServerTerminal(): void {
        // fit is called within a setTimeout, cols and rows need this.
        setTimeout(() => {
            this.initOptions(this.term);
            const url = environment.serverUrl + '/terminals';
            this.http.post(url, { cols: this.term.cols, rows: this.term.rows }).subscribe(value => {
                const pid = value['processId'];
                const port = 3002;
                const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
                const socketURL = protocol + location.hostname + ((port) ? (':' + port) : '') + '/terminals/' + pid;

                this.socket = new WebSocket(<string>socketURL);
                this.socket.onopen = this.runRealTerminal;
                this.socket.onclose = this.runFakeTerminal;
                this.socket.onerror = this.runFakeTerminal;
            });
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

    private runRealTerminal = (): void => {
        this.term.attach(this.socket);
        this.term._initialized = true;
    }

    private runFakeTerminal = (): void => {
        if (this.term._initialized) {
            return;
        }
        this.term.prompt = () => {
            this.term.write('\r\n');
        };

        this.term._initialized = true;

        this.term.writeln('服务器连接失败');
        this.term.prompt();

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

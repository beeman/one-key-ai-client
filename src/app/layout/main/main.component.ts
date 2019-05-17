import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TerminalComponent } from 'src/app/shared/terminal/terminal.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('terminalElement')
  terminalElement: TerminalComponent;

  public isCollapsed = false;
  public isReverseArrow = false;
  public isTerminalModalVisible = false;
  public isDriverSourceModalVisible = false;
  public isAdmin = false;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly router: Router,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.userService.checkAdmin(this.tokenService.get()['userName']).subscribe(value => {
      console.log(value);
      this.isAdmin = <boolean>value;
    });
  }

  public cancelUpdateDriverSource(): void {
    this.hideDriverSourceModal();
    this.installDriver('');
  }

  public cancelTerminalModal(): void {
    this.hideTerminalModal();
  }

  public confirmTerminalModal(): void {
    this.hideTerminalModal();
  }

  public confirmUpdateDriverSource(): void {
    this.hideDriverSourceModal();
    this.installDriver('sudo add-apt-repository ppa:graphics-drivers/ppa -y -u');
  }

  public installDockerCE(): void {
    // GPG证书
    const addGpgKeyCommand = 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -';

    // 软件源
    const addRepositoriesCommand = 'echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker-ce.list';

    // 更新指令
    const updateCommand = 'sudo apt-get update -y';

    //安装指令
    const installCommand = 'sudo apt-get install docker-ce -y';

    const command = `${addGpgKeyCommand} && ${addRepositoriesCommand} && ${updateCommand} && ${installCommand}\n`;
    this.execCommand(command);

    this.showTerminalModal();
  }

  public installGpuDriver(): void {
    this.showDriverSourceModel();
  }

  public installNvidiaDocker(): void {
    // If you have nvidia-docker 1.0 installed: we need to remove it and all existing GPU containers
    const removeNvd1Command = 'sudo docker volume ls -q -f driver=nvidia-docker | xargs -r -I{} -n1 docker ps -q -a -f volume={} | xargs -r docker rm -f && sudo apt-get purge -y nvidia-docker';

    // Add the package repositories
    const addRepositoriesCommand1 = 'curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -';
    const distributionCommand = 'distribution=$(. /etc/os-release;echo $ID$VERSION_ID)';
    const addRepositoriesCommand2 = 'curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list';
    const addRepositoriesCommand = `${addRepositoriesCommand1} && ${distributionCommand} && ${addRepositoriesCommand2}`;

    // update
    const updateCommand = 'sudo apt-get update -y';

    // Install nvidia-docker2 and reload the Docker daemon configuration
    const installNvd2Command = 'sudo apt-get install -y nvidia-docker2 && sudo pkill -SIGHUP dockerd';

    const command = `${removeNvd1Command} ; ${addRepositoriesCommand} && ${updateCommand} && ${installNvd2Command}\n`;
    this.execCommand(command);

    this.showTerminalModal();
  }

  public login():void{
    this.router.navigateByUrl('auth');
  }

  public logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl('auth');
  }

  private hideDriverSourceModal(): void {
    this.isDriverSourceModalVisible = false;
  }

  private hideTerminalModal(): void {
    this.isTerminalModalVisible = false;
  }

  private installDriver(preCommand: string): void {
    // let driver = '';
    // this.driverList.forEach(value => {
    //   if (value.startsWith('nvidia')) {
    //     if (value > driver) {
    //       driver = value;
    //     }
    //   }
    // });
    // if (!driver) {
    //   return;
    // }
    // this.terminalElement.getTerminal().emit(`sudo apt-get install aptitude -y && sudo aptitude install ${driver} -y\n`);

    // this.terminalElement.getTerminal().emit('sudo add-apt-repository ppa:graphics-drivers/ppa -y -u\n');
    const preText = preCommand ? preCommand + ' && ' : '';
    this.execCommand(`${preText}sudo ubuntu-drivers autoinstall\n`);
    this.showTerminalModal();
  }

  private execCommand(command: string): void {
    // this.terminalElement.getTerminal().clear();
    this.terminalElement.getTerminal().emit(command);
  }

  private showDriverSourceModel(): void {
    this.isDriverSourceModalVisible = true;
  }

  private showTerminalModal(): void {
    this.isTerminalModalVisible = true;
  }
}

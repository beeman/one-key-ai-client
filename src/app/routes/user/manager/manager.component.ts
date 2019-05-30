import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/user.service';
import { UserInfoComponent } from '../user-info/user-info.component';
import { User } from '../user';
import { UserEditorComponent } from '../user-editor/user-editor.component';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  @ViewChild(UserInfoComponent)
  private userInfoComponent: UserInfoComponent;

  @ViewChild(UserEditorComponent)
  private userEditorComponent: UserEditorComponent;

  users: User[] = [];
  userInfoVisible: boolean = false;
  userEditorVisible: boolean = false;
  userDeleteVisible: boolean = false;

  currentUser: User = null;

  constructor(private readonly userService: UserService) { }

  ngOnInit() {
    this.updateUsers();
  }

  public addUser(): void {
    this.userInfoVisible = true;
  }

  public doneAddUser(done: boolean): void {
    this.userInfoVisible = false;

    if (done) {
      this.updateUsers();
    }
  }

  public doneEditUser(done: boolean): void {
    this.userEditorVisible = false;

    if (done) {
      this.updateUsers();
    }
  }

  public editUser(user: User): void {
    this.userEditorVisible = true;
    this.userEditorComponent.updateUser(user);
  }

  public delete(user: User): void {
    this.currentUser = user;
    this.userDeleteVisible = true;
  }

  // public delete(name: string): void {
  //   this.userService.deleteUser(name).subscribe(value => {
  //     if (value['msg'] === 'ok') {
  //       this.updateUsers();
  //     }
  //   });
  // }

  public updateUsers(): void {
    this.userService.getAllUsers().subscribe((value: any) => {
      this.users = <User[]>value.data;
    });
  }

  public doneDeleteUser(done: boolean): void {
    if (done) {
      this.userService.deleteUser(this.currentUser.name).subscribe(value => {
        if (value['msg'] === 'ok') {
          this.updateUsers();
        }
      });
    }

    this.userDeleteVisible = false;
  }
}

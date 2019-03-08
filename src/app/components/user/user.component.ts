import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import {UserManager} from '../../managers/user.manager';
import {AppUser} from '../../types/AppUser';
import {UserCredentials} from '../../types/UserCredentials';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  public displayLogin: boolean;
  public currentUser: AppUser;
  public isSynced: boolean;
  public isSkillEnabled: boolean;
  
  private userManager: UserManager;
  
  constructor() {
    this.userManager = new UserManager();
    this.isSkillEnabled = false;
  }
  
  ngOnInit() {
    TitleService.setTitle('Account');
    this.fetchUser();
    this.fetchSyncStatus();
  }
  
  fetchUser() {
    this.userManager.fetchCurrentUser().subscribe((user: AppUser) => {
      this.displayLogin = user.email === undefined;
      if (this.displayLogin) { this.currentUser = user; }
    });
  }
  
  fetchSyncStatus() {
    this.userManager.fetchSyncStatus().subscribe((synced: boolean) => {
      this.isSynced = synced;
    });
  }
  
  initializeSync() {
    this.userManager.initializeSync();
  }
  
  handleCreate(c: UserCredentials) {
    this.userManager.createUser(c).subscribe((user: AppUser) => {
      this.displayLogin = user.email === undefined;
    });
  }
  
  handleLogin(c: UserCredentials) {
    this.userManager.authenticateUser(c).subscribe((user: AppUser) => {
      console.log(user);
      this.displayLogin = user.email === undefined;
    });
  }
  
  handleLogout() {
    this.userManager.logoutUser().subscribe(() => this.displayLogin = true, (err: Error) => console.log(err));
  }
  
  /*
  - fetch user state
    - based on user state, display log in
    - OR display:
      - account information
      - AND:
        - sync button if not synced
        - sync status if synced
   */
  
}

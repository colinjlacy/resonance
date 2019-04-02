import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../services/title.service';
import {UserManager} from '../../managers/user.manager';
import {AppUser} from '../../types/AppUser';
import {UserCredentials} from '../../types/UserCredentials';
import {SyncDoc} from '../../types/SyncDoc';
import {MatDialog, MatDialogRef} from '@angular/material';
import {InstructionsBoxComponent} from '../instructions-box/instructions-box.component';
import {Subject} from 'rxjs';
import {ConfirmationBoxComponent} from '../confirmation-box/confirmation-box.component';
import {WebSocketSubject} from 'rxjs/webSocket';
import {SnackbarService} from '../../services/snackbar.service';

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
  public isCurrentlySyncing: boolean;
  
  readonly cancellationSubject: Subject<boolean>;
  private userManager: UserManager;
  private dialogRef: MatDialogRef<any>;
  private cx: WebSocketSubject<SyncDoc | { [key: string]: boolean }>;
  
  constructor(public dialog: MatDialog) {
    this.userManager = new UserManager();
    this.isSkillEnabled = false;
    this.cancellationSubject = new Subject();
  }
  
  ngOnInit(): void {
    TitleService.setTitle('Account');
    this.fetchUser();
    this.fetchSyncStatus();
  }
  
  fetchUser(): void {
    this.userManager.fetchCurrentUser().subscribe((user: AppUser) => {
      this.displayLogin = user.email === undefined;
      if (this.displayLogin) {
        this.currentUser = user;
      }
    });
  }
  
  fetchSyncStatus(): void {
    this.userManager.fetchSyncStatus().subscribe((synced: boolean) => {
      this.isSynced = synced;
    });
  }
  
  initializeSync(): void {
    this.cx = this.userManager.initializeSync();
    this.setIsSyncing();
    this.cx.subscribe(this.handleConnectionMessage.bind(this), this.handleConnectionError.bind(this), () => {
      this.cleanUp();
      console.log('complete!');
    });
    
    this.cancellationSubject.subscribe(this.checkCancellation.bind(this));
  }
  
  handleCreate(c: UserCredentials): void {
    this.userManager.createUser(c).subscribe((user: AppUser) => {
      this.displayLogin = user.email === undefined;
    });
  }
  
  handleLogin(c: UserCredentials): void {
    this.userManager.authenticateUser(c).subscribe((user: AppUser) => {
      console.log(user);
      this.displayLogin = user.email === undefined;
    });
  }
  
  handleLogout(): void {
    this.userManager.logoutUser().subscribe(() => this.displayLogin = true, (err: Error) => console.log(err));
  }
  
  private setIsSyncing(): void {
    this.isCurrentlySyncing = true;
  }
  
  private setNotSyncing(): void {
    this.isCurrentlySyncing = false;
  }
  
  private displaySyncInstructions(code: string): void {
    this.dialogRef = this.dialog.open(InstructionsBoxComponent, {
      width: '400px',
      disableClose: true,
      data: {
        action: `Begin Alexa Syncing Process`,
        instructions: `Alexa, tell the Reborne skill to sync with the code:`,
        code,
        followUp: `This window will close automatically when a sync code is received.`
      }
    });
    
    this.dialogRef.afterClosed().subscribe(this.emitCancellation.bind(this));
    
  }
  
  private handleConnectionMessage(doc: SyncDoc): void {
    if (doc.a) {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.isSynced = true;
      this.cleanUp();
    } else if (!!doc.v) {
      if (this.dialogRef) {
        this.dialogRef.close(false);
      }
      this.displaySyncConfirmation(doc.l);
    } else {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.displaySyncInstructions(doc.g);
    }
  }
  
  private promptTryAgain(): void {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      disableClose: true,
      data: {
        action: `Try again?`,
        message: `It seems as though that last attempt didn't work out.  Would you like to try syncing again?`,
        negativeLabel: `No, nevermind`
      }
    });
    
    this.dialogRef.afterClosed().subscribe(this.initializeTryAgain.bind(this));
  }
  
  private initializeTryAgain(result: boolean): void {
    this.cleanUp();
    if (result === true) {
      this.initializeSync();
    }
  }
  
  private handleConnectionError(err: Error): void {
    console.log(err);
    // assuming that if the dialogRef hasn't been set, that no connection has been established yet
    if (!this.isCurrentlySyncing) {
      this.setNotSyncing();
      SnackbarService.openSnackBar('A connection to sync to your device could not be established.', 'OK');
    } else if (this.isCurrentlySyncing) {
      // assuming that if the dialogRef has been set, that a connection has been established and was lost
      this.dialogRef.close();
      this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        disableClose: true,
        data: {
          action: 'Uh oh!',
          message: 'It looks like the connection to the device was cut short.  Would you like to retry syncing?',
          positiveLabel: 'Yes, please'
        }
      });
      this.dialogRef.afterClosed().subscribe(this.initializeTryAgain.bind(this));
    }
    this.cleanUp();
  }
  
  private displaySyncConfirmation(voiceUserInfo: string): void {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      disableClose: true,
      data: {action: `Confirm Voice User`, message: `Is the following user information correct? ${voiceUserInfo}`}
    });
    
    this.dialogRef.afterClosed().subscribe(this.parseConfirmation.bind(this));
  }
  
  private confirmSync(): void {
    this.cx.next({approve: true});
  }
  
  private checkCancellation(isCancelled: boolean): void {
    if (isCancelled === true) {
      this.cx.next({cancel: true});
    }
  }
  
  private emitCancellation(result: boolean): void {
    if (result === true) {
      this.cancellationSubject.next(result);
      this.cleanUp();
    }
  }
  
  private parseConfirmation(result: boolean): void {
    if (result === true) {
      this.confirmSync();
    } else if (result === false) {
      this.promptTryAgain();
    } else {
      this.emitCancellation(true);
    }
  }
  
  private cleanUp(): void {
    this.setNotSyncing();
    if (this.cancellationSubject) {
      this.cancellationSubject.complete();
    }
    if (this.cx) {
      this.cx.complete();
    }
  }
  
}

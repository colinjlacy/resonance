import {Observable, Subject, Subscriber, Subscription} from 'rxjs';
import {AppUser} from '../types/AppUser';
import {UserCredentials} from '../types/UserCredentials';
import {RequestResponse} from '../types/RequestResponse';
import {SyncDoc} from '../types/SyncDoc';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {MatSnackBar} from '@angular/material';
import {SnackbarService} from '../services/snackbar.service';

const user: Subject<AppUser> = new Subject<AppUser>();

export class AuthRas {
  
  userUrl: string;
  syncedUrl: string;
  authUrl: string;
  syncWsUrl: string;
  
  constructor() {
    this.userUrl = 'http://localhost:3000/user';
    this.syncedUrl = 'http://localhost:3000/user/synced';
    this.authUrl = 'http://localhost:3000/auth';
    this.syncWsUrl = 'ws://localhost:3000/sync';
    // this.userUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.USER_PATH;
    // this.syncedUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.SYNCED_URL;
    // this.authUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.AUTH_PATH;
    // this.syncWsUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.SYNC_WS_PATH;
  }
  
  public fetchCurrentUser(): Observable<AppUser> {
    fetch(`${this.userUrl}`)
      .then(response => response.json())
      .then((data: AppUser) => {
        user.next(data);
      })
      .catch((err: Error) => console.log(err));
    return user;
  }
  
  public authenticateUser(c: UserCredentials): Observable<AppUser> {
    fetch(`${this.authUrl}`, {
      method: 'POST', body: JSON.stringify({
        email: c.emailAddress,
        password: c.password
      }), headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: any) => {
        user.next(data.user);
      })
      .catch((err: Error) => console.log(err));
    return user;
  }
  
  public createUser(c: UserCredentials): Observable<AppUser> {
    fetch(`${this.userUrl}`, {
      method: 'POST', body: JSON.stringify({
        email: c.emailAddress,
        password: c.password
      }), headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: any) => {
        user.next(data.user);
      })
      .catch((err: Error) => console.log(err));
    return user;
  }
  
  public logoutUser(): Observable<RequestResponse<null>> {
    return Observable.create((subscriber: Subscriber<RequestResponse<null>>) => {
      fetch(`${this.authUrl}`, {method: 'DELETE'})
        .then(response => response.json())
        .then((data: RequestResponse<null>) => {
          subscriber.next(data);
          subscriber.complete();
        });
    });
  }
  
  public fetchSyncStatus(): Observable<boolean> {
    return Observable.create((subscriber: Subscriber<boolean>) => {
      fetch(`${this.syncedUrl}`)
        .then(response => response.json())
        .then((res: RequestResponse<{ synced: boolean }>) => {
          subscriber.next(res.data.synced);
          subscriber.complete();
        });
    });
  }
  
  public initiateSyncConnection(): WebSocketSubject<SyncDoc | { [key: string]: boolean }> {
    return webSocket(this.syncWsUrl);
  }
}

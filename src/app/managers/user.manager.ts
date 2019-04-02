import {AuthRas} from '../ras/auth.ras';
import {Observable} from 'rxjs';
import {AppUser} from '../types/AppUser';
import {UserCredentials} from '../types/UserCredentials';
import {RequestResponse} from '../types/RequestResponse';
import { map } from 'rxjs/operators';
import {WebSocketSubject} from 'rxjs/webSocket';
import {SyncDoc} from '../types/SyncDoc';

export class UserManager {
  private authRas: AuthRas;
  
  constructor() {
    this.authRas = new AuthRas();
  }
  
  public fetchCurrentUser(): Observable<AppUser> {
    return this.authRas.fetchCurrentUser();
  }
  
  public createUser(c: UserCredentials): Observable<AppUser> {
    return this.authRas.createUser(c);
  }
  
  public authenticateUser(c: UserCredentials): Observable<AppUser> {
    return this.authRas.authenticateUser(c);
  }
  
  public fetchSyncStatus(): Observable<boolean> {
    return this.authRas.fetchSyncStatus();
  }
  
  public initializeSync(): WebSocketSubject<SyncDoc | {[key: string]: boolean}> {
    return this.authRas.initiateSyncConnection();
  }
  
  public logoutUser(): Observable<void> {
    return this.authRas.logoutUser().pipe(map((data: RequestResponse<null>) => {
      // TODO: error handling
      if (data.error) { throw new Error(data.message); }
      return null;
    }));
  }
}

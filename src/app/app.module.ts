import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {MatSidenavModule} from '@angular/material/sidenav';

import {AppComponent} from './app.component';
import {LayoutComponent} from './components/layout/layout.component';
import {JoblistComponent} from './components/joblist/joblist.component';
import {AppRoutingModule} from './app.routes';
import {DetailsComponent} from './components/details/details.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {CustomSerializer} from './app.route-serializer';
import {SettingsComponent} from './components/settings/settings.component';
import {ConfirmationBoxComponent} from './components/confirmation-box/confirmation-box.component';
import {AuthFormComponent} from './components/auth-form/auth-form.component';
import {UserComponent} from './components/user/user.component';
import {InstructionsBoxComponent} from './components/instructions-box/instructions-box.component';
import {SnackbarService} from './services/snackbar.service';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    JoblistComponent,
    DetailsComponent,
    ImageViewerComponent,
    SettingsComponent,
    ConfirmationBoxComponent,
    AuthFormComponent,
    UserComponent,
    InstructionsBoxComponent,
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // For the record, I'm very much against using NGRX;
    // but since the Angular Router still doesn't provide a cohesive view of its state,
    // I really have no choice but to use it, or write my own state compiler.
    // Which I hate.
    StoreModule.forRoot({
      router: routerReducer,
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    }),
  ],
  providers: [SnackbarService],
  bootstrap: [AppComponent],
  entryComponents: [ImageViewerComponent, ConfirmationBoxComponent, InstructionsBoxComponent]
})
export class AppModule {
  constructor(private snackbar: SnackbarService) {}
}

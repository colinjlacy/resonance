import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import {DetailsComponent} from './components/details/details.component';
import {LayoutComponent} from './components/layout/layout.component';
import {SettingsComponent} from './components/settings/settings.component';
import {UserComponent} from './components/user/user.component';


const routes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DetailsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: ':jobName',
        component: DetailsComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

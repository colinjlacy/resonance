import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import {UserManager} from '../../managers/user.manager';
import {AppUser} from '../../types/AppUser';
import {UserCredentials} from '../../types/UserCredentials';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  
  constructor() {}

  ngOnInit() {
  }
  
  
}

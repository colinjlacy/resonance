import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    TitleService.setTitle('Settings');
  }

}

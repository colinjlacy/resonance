import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UserCredentials} from '../../types/UserCredentials';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  
  public emailAddress: string;
  public password: string;
  public passwordConf: string;
  @Output() create: EventEmitter<UserCredentials> = new EventEmitter();
  @Output() login: EventEmitter<UserCredentials> = new EventEmitter();
  
  constructor() {
  }
  
  ngOnInit() {
  }
  
  clearForm() {
    this.emailAddress = '';
    this.password = '';
    this.passwordConf = '';
  }
  
  submitForm(type: 'create' | 'login') {
    const errors: string[] = [];
    if (this.emailAddress.trim() === '') {
      errors.push('Your email address cannot be blank');
    }
    if (this.password.trim() === '') {
      errors.push('Your password cannot be blank');
    }
    if (type === 'create' && this.passwordConf.trim() === '') {
      errors.push('Your password confirmation cannot be blank');
    }
    if (type === 'create' && this.password !== this.passwordConf) {
      errors.push('Your password and password confirmation do not match!');
    }
    if (!errors.length) {
      if (type === 'create') {
        this.createUser();
      } else {
        this.loginUser();
      }
    } else {
      // TODO: error messaging
      console.log(errors);
    }
  }
  
  private createUser() {
    this.create.emit({
      emailAddress: this.emailAddress,
      password: this.password,
      action: 'create'
    });
  }
  
  private loginUser() {
    this.login.emit({
      emailAddress: this.emailAddress,
      password: this.password,
      action: 'login'
    });
  }
  
}

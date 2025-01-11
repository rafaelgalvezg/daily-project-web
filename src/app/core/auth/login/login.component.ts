import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../../environments/environment.development';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgOptimizedImage, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm!: FormGroup;
  hidePassword = true;
  message = '';
  error = '';

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  getUsernameErrorMessage() {
    if (this.username.hasError('required')) return 'Username is required.';
    if (this.username.hasError('minlength')) return 'Username must be at least 4 characters long.';
    return '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) return 'Password is required.';
    if (this.password.hasError('minlength')) return 'Password must be at least 3 characters long.';
    return '';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          sessionStorage.setItem(environment.TOKEN_NAME, response.access_token);
          this.router.navigate(['features/dashboard']).then();
        }/*,
        error: (err) => {
          this.error = 'Invalid username or password';
          console.error('Login error:', err)
        },*/
      });
    }
  }

}

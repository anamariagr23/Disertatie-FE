import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthResponse } from "../../shared/models/auth-response.interface";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loggedIn?: boolean;

  constructor(private authService: AuthService) {
  }

  login(): void {
    this.authService.loginWithPassword(this.email, this.password)
      .subscribe({
        next: (response) => this.authService.handleAuthenticationResponse(response),
        error: (error) => this.authService.handleError(error)
      });
  }
}

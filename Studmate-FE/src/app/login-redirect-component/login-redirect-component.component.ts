import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-redirect-component',
  templateUrl: './login-redirect-component.component.html',
  styleUrls: ['./login-redirect-component.component.scss']
})
export class LoginRedirectComponentComponent {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const myCred = sessionStorage.getItem("googleCredential") || "";
    console.log(myCred);
    this.authService.loginWithGoogle(myCred)
      .subscribe({
        next: (response) => this.authService.handleAuthenticationResponse(response),
        error: (error) => this.authService.handleError(error)
      });
  }
}



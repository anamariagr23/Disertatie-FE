import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AuthResponse } from 'src/shared/models/auth-response.interface';
import { NavigationService } from './navigation.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private navigationService: NavigationService, private userService: UserService) { }

  loginWithPassword(email: string, password: string): Observable<AuthResponse> {
    const credentials = { email, password };
    return this.http.post<AuthResponse>('https://127.0.0.1:5000/login', credentials);
  }

  loginWithGoogle(credential: string): Observable<AuthResponse> {
    const form = new FormData();
    form.append('credential', credential);
    return this.http.post<AuthResponse>("https://localhost:5000/google-login", form);
  }


  handleAuthenticationResponse(response: AuthResponse) {
    const token = response.data.token;
    const details_completed = response.data?.details_completed;
    const studentId = response.data.id;
    const idRole = response.data.id_role;

    console.log(response);
    localStorage.setItem('token', token);
    localStorage.setItem('id_role', idRole.toString());

    if (idRole === 3) {
      if (details_completed) {
        localStorage.setItem('details_completed', details_completed.toString());
      }
      this.userService.setStudentId(studentId);
    }

    if (idRole === 1) {
      this.navigationService.navigateToAdminPage();
    } else if (idRole === 2) {
      this.navigationService.navigateToDormAdminPage();
    } else if (idRole === 3 && !details_completed) {
      this.navigationService.navigateToStudentDetails();
    } else {
      this.navigationService.navigateToUsers();
    }
  }


  handleError(error: any) {
    console.error('Login failed:', error);
  }
}

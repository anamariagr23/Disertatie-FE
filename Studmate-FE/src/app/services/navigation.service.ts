import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from 'src/shared/constants/route-paths';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToWithReload(path: string): void {
    this.router.navigate([path]).then(() => {
      window.location.reload();
    });
  }

  navigateToLogin(): void {
    this.navigateTo(ROUTE_PATHS.LOGIN);
  }

  navigateToUsers(): void {
    this.navigateTo(ROUTE_PATHS.USERS);
  }

  navigateToStudentDetails(): void {
    this.navigateTo(ROUTE_PATHS.STUDENT_DETAILS);
  }

  navigateToAdminPage(): void {
    this.navigateTo(ROUTE_PATHS.ADMIN);
  }

  navigateToDormAdminPage(): void {
    this.navigateTo(ROUTE_PATHS.DORM_ADMIN);
  }

  navigateToUserProfile(studentId: number | null): void {
    if (studentId) {
      this.router.navigate(['/profile'], { queryParams: { id: studentId } });
    } else {
      console.error('No student ID found in UserService');
    }
  }

  navigateToRoomateRequests(): void {
    this.navigateTo(ROUTE_PATHS.REQUESTS);
  }

}

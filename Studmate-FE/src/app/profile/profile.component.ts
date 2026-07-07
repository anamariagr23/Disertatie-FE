// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { StudentService } from '../services/student.service';
// import { UtilService } from 'src/shared/utils/util.service';
// import { UserService } from '../services/user.service';
// import { Subscription } from 'rxjs';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss']
// })
// export class ProfileComponent implements OnInit {
//   student: any;
//   compatibilityScore: any;
//   categories!: any[];
//   loggedInUserId?: number | null;
//   studentId?: number;
//   private queryParamsSubscription!: Subscription;
//   requestMade: boolean = false;
//   isLoading: boolean = true;

//   constructor(private router: Router, private route: ActivatedRoute, private utilService: UtilService, private studentService: StudentService, private userService: UserService, private dialog: MatDialog) { }


//   ngOnInit(): void {
//     this.loggedInUserId = this.userService.getStudentId();
//     this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
//       this.studentId = Number(params['id']);
//       this.loadStudentProfile(this.studentId);
//     });

//     if (this.loggedInUserId != this.studentId) {
//       this.checkExistingRequest();
//     }

//   }

//   ngOnDestroy(): void {
//     this.queryParamsSubscription.unsubscribe();
//   }

//   loadStudentProfile(studentId: number): void {
//     this.isLoading = true;
//     this.studentService.getStudentProfile(studentId).subscribe(response => {
//       this.student = response.student;
//       this.compatibilityScore = response.compatibility_score;
//       this.categories = response.categories;
//       console.log(this.student);
//       console.log(this.categories);
//       this.isLoading = false;
//     });

//   }

//   getOrdinalSuffix(year: number): string {
//     return this.utilService.getOrdinalSuffix(year);
//   }

//   getColorForPercentage(pct: number): string {
//     return this.utilService.getColorForPercentage(pct);
//   }

//   //TODO: use this as a setting 
//   getTopCategories(categories: { category: string, score: number }[]): { category: string, score: number }[] {
//     return categories
//       .sort((a, b) => b.score - a.score) // Sort by score descending
//       .slice(0, 10); // Get top <number> categories
//   }

//   sendRoommateRequest(): void {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       width: '250px'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result && this.loggedInUserId != null && this.studentId != null) {
//         this.studentService.sendRoommateRequest(this.loggedInUserId, this.studentId).subscribe({
//           next: response => {
//             console.log('Roommate request sent:', response);
//             // handle response, perhaps show a snackbar message
//           },
//           error: error => {
//             console.error('Failed to send roommate request:', error);
//             // handle error, perhaps show a snackbar message
//           }
//         });
//       }
//     });
//   }

//   checkExistingRequest(): void {
//     const loggedInUserId = this.loggedInUserId; // Ensure this method exists and returns the current user's ID
//     const targetUserId = this.studentId; // Implement logic to obtain the ID of the user whose profile is being viewed

//     if (loggedInUserId && targetUserId) {
//       this.studentService.checkRoommateRequest(loggedInUserId, targetUserId).subscribe({
//         next: (response) => {
//           if (response.exists) {
//             this.requestMade = true; // Disable button if a request already exists
//           }
//         },
//         error: (error) => {
//           console.error('Error checking roommate request:', error);
//         }
//       });
//     }


//   }

//   updateAnswers() {
//     this.router.navigate(['/student-details']);
//   }
// }







import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { UtilService } from 'src/shared/utils/util.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  student: any;
  categories!: any[];
  loggedInUserId?: number | null;
  studentId?: number;
  compatibilityScore?: number;
  private queryParamsSubscription!: Subscription;
  requestMade: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private studentService: StudentService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedInUserId = this.userService.getStudentId();
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.studentId = Number(params['id']);
      if (this.loggedInUserId === this.studentId) {
        this.loadLoggedInStudentProfile();
      } else {
        this.loadStudentProfile(this.studentId);
        this.checkExistingRequest();
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  loadLoggedInStudentProfile(): void {
    this.isLoading = true;
    this.studentService.getStudentDetails().subscribe(response => {
      this.student = response.student;
      this.categories = this.student.categories;
      console.log(this.student);
      console.log(this.categories);
      this.isLoading = false;
    });
  }

  loadStudentProfile(studentId: number): void {
    this.isLoading = true;
    this.studentService.getStudentProfile(studentId).subscribe(response => {
      this.student = response.student;
      this.compatibilityScore = response.compatibility_score;
      this.categories = response.categories;
      console.log(this.student);
      console.log(this.categories);
      this.isLoading = false;
    });
  }

  getOrdinalSuffix(year: number): string {
    return this.utilService.getOrdinalSuffix(year);
  }

  getColorForPercentage(pct: number): string {
    return this.utilService.getColorForPercentage(pct);
  }

  getTopCategories(categories: { category: string, score: number }[]): { category: string, score: number }[] {
    return categories
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  sendRoommateRequest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.loggedInUserId != null && this.studentId != null) {
        this.studentService.sendRoommateRequest(this.loggedInUserId, this.studentId).subscribe({
          next: response => {
            console.log('Roommate request sent:', response);
            this.requestMade = true;
          },
          error: error => {
            console.error('Failed to send roommate request:', error);
          }
        });
      }
    });
  }

  checkExistingRequest(): void {
    const loggedInUserId = this.loggedInUserId;
    const targetUserId = this.studentId;

    if (loggedInUserId && targetUserId) {
      this.studentService.checkRoommateRequest(loggedInUserId, targetUserId).subscribe({
        next: (response) => {
          if (response.exists) {
            this.requestMade = true;
          }
        },
        error: (error) => {
          console.error('Error checking roommate request:', error);
        }
      });
    }
  }

  updateAnswers() {
    this.router.navigate(['/student-details']);
  }
}

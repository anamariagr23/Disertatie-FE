// import { Component } from '@angular/core';
// import { StudentService } from '../services/student.service';
// import { Dorm, DormResponse } from 'src/shared/models/student.interface';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-admin-page',
//   templateUrl: './admin-page.component.html',
//   styleUrls: ['./admin-page.component.scss']
// })
// export class AdminPageComponent {
//   adminEmail: string = '';
//   selectedDormId: number | null = null;
//   dorms: Dorm[] = [];

//   constructor(
//     private studentService: StudentService,
//     private http: HttpClient
//   ) { }

//   ngOnInit(): void {
//     this.getDorms();
//   }

//   getDorms(): void {
//     this.studentService.getDorms().subscribe(
//       response => {
//         this.dorms = response.dorms;
//       },
//       error => {
//         console.error('Error fetching dorms', error);
//       }
//     );
//   }

//   generateRandomPassword(): string {
//     const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//     const digits = '0123456789';

//     const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
//     const getRandomDigit = () => digits[Math.floor(Math.random() * digits.length)];

//     const passwordLength = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
//     let password = '';

//     for (let i = 0; i < passwordLength; i++) {
//       password += getRandomLetter();
//     }

//     password += getRandomDigit();
//     password += getRandomDigit();

//     return password;
//   }

//   onSubmit(): void {
//     const password = this.generateRandomPassword();
//     const newUser = {
//       email: this.adminEmail,
//       password: password,
//       id_role: 2
//     };

//     console.log(`Email: ${this.adminEmail}, Password: ${password}`);

//     this.http.post('https://127.0.0.1:5000/users', newUser).subscribe(
//       response => {
//         console.log('Dorm admin created successfully:', response);
//       },
//       error => {
//         console.error('Error creating dorm admin:', error);
//       }
//     );
//   }

// }

import { Component, Inject } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Dorm } from 'src/shared/models/student.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DormAdminSummary {
  id: number;
  email: string;
  dorms: (string | null)[];
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {
  adminEmail: string = '';
  selectedDormId: number | null = null;
  dorms: Dorm[] = [];
  modalEmail: string = '';
  modalPassword: string = '';

  dormAdmins: DormAdminSummary[] = [];
  isResetting: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private studentService: StudentService,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDorms();
    this.loadDormAdmins();
  }

  getDorms(): void {
    this.studentService.getDorms().subscribe(
      response => {
        this.dorms = response.dorms;
      },
      error => {
        console.error('Error fetching dorms', error);
      }
    );
  }

  loadDormAdmins(): void {
    this.http.get<{ dorm_admins: DormAdminSummary[] }>('https://127.0.0.1:5000/dorm-admins').subscribe({
      next: (response) => this.dormAdmins = response.dorm_admins,
      error: (error) => console.error('Error fetching dorm admins', error)
    });
  }

  generateRandomPassword(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';

    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => digits[Math.floor(Math.random() * digits.length)];

    const passwordLength = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
      password += getRandomLetter();
    }

    password += getRandomDigit();
    password += getRandomDigit();

    return password;
  }

  onSubmit(): void {
    const password = this.generateRandomPassword();
    const newUser = {
      email: this.adminEmail,
      password: password,
      id_role: 2,
      dorm_id: this.selectedDormId
    };

    this.errorMessage = null;
    this.http.post('https://127.0.0.1:5000/users', newUser).subscribe({
      next: response => {
        this.modalEmail = this.adminEmail;
        this.modalPassword = password;
        this.openModal(this.modalEmail, this.modalPassword);
        this.adminEmail = '';
        this.selectedDormId = null;
        this.loadDormAdmins();
      },
      error: error => {
        console.error('Error creating dorm admin:', error);
        this.errorMessage = error?.error?.error || 'Failed to create the dorm admin account.';
      }
    });
  }

  resetPassword(admin: DormAdminSummary): void {
    if (this.isResetting) return;
    this.isResetting = admin.id;
    this.errorMessage = null;
    const newPassword = this.generateRandomPassword();

    this.http.put(`https://127.0.0.1:5000/users/${admin.id}/password`, { password: newPassword }).subscribe({
      next: () => {
        this.isResetting = null;
        this.openModal(admin.email, newPassword);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.errorMessage = error?.error?.error || 'Failed to reset the password.';
        this.isResetting = null;
      }
    });
  }

  openModal(email: string, password: string): void {
    this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { email: email, password: password }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>New Dorm Admin Credentials</h1>
  <div mat-dialog-content>
    <p>Email: {{data.email}}</p>
    <p>Password: {{data.password}}</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Close</button>
  </div>
  `,
  styles: [`
    h1[mat-dialog-title] {
      text-align: center;
      color: #3f51b5;
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    div[mat-dialog-content] {
      text-align: center;
      font-size: 1.1em;
      color: #555;
      padding: 10px;
    }
    div[mat-dialog-actions] {
      display: flex;
      justify-content: center;
      padding: 10px;
    }
    button[mat-button] {
      background-color: #3f51b5;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[mat-button]:hover {
      background-color: #303f9f;
    }
  `]
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  email: string;
  password: string;
}

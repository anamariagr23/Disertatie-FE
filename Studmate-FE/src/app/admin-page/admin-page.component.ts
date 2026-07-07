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

  constructor(
    private studentService: StudentService,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDorms();
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
      id_role: 2
    };

    console.log(`Email: ${this.adminEmail}, Password: ${password}`);

    this.http.post('https://127.0.0.1:5000/users', newUser).subscribe(
      response => {
        console.log('Dorm admin created successfully:', response);
        this.modalEmail = this.adminEmail;
        this.modalPassword = password;
        this.openModal(this.modalEmail, this.modalPassword);
      },
      error => {
        console.error('Error creating dorm admin:', error);
      }
    );
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

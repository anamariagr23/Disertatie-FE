import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../shared/models/student.interface';
import { StudentService } from '../services/student.service';
import { NavigationService } from '../services/navigation.service';
import { UtilService } from 'src/shared/utils/util.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  students: Student[] = [];
  isLoading: boolean = true;

  constructor(private studentService: StudentService, private utilService: UtilService, private navigationService: NavigationService) { }

  // ngOnInit(): void {
  //   this.studentService.getStudents().subscribe(response => {
  //     // TypeScript now knows that response has a property `students`
  //     this.students = response.students;
  //   }, error => {
  //     console.error('Error fetching students:', error);
  //   });
  // }


  ngOnInit(): void {
    this.getStudentMatches();
  }

  getStudentMatches(): void {
    this.studentService.getStudentMatches().subscribe(response => {
      this.students = response.students;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching student matches:', error);
    });
  }

  getOrdinalSuffix(year: number): string {
    return this.utilService.getOrdinalSuffix(year);
  }

  getTopCategories(categories: { category: string, score: number }[]): { category: string, score: number }[] {
    return categories
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 3); // Get top <number> categories
  }

  goToProfile(studentId: number): void {
    this.navigationService.navigateToUserProfile(studentId);
  }

  getColorForPercentage(pct: number): string {
    return this.utilService.getColorForPercentage(pct);
  }
}

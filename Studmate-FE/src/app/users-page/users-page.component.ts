import { Component, OnInit, ViewChild } from '@angular/core';
import { Dorm, Major, Student } from '../../shared/models/student.interface';
import { StudentService } from '../services/student.service';
import { NavigationService } from '../services/navigation.service';
import { UserService } from '../services/user.service';
import { UtilService } from 'src/shared/utils/util.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  students: Student[] = [];
  dorms: Dorm[] = [];
  majors: Major[] = [];
  isLoading: boolean = true;

  searchText = '';
  genderFilter: 'all' | 'female' | 'male' = 'all';
  dormFilter: number | null = null;
  majorFilter: number | null = null;

  constructor(
    private studentService: StudentService,
    private utilService: UtilService,
    private navigationService: NavigationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getStudents();
    this.studentService.getDorms().subscribe({
      next: (response) => this.dorms = response.dorms,
      error: (error) => console.error('Error fetching dorms', error)
    });
    this.studentService.getMajors().subscribe({
      next: (response) => this.majors = response.majors,
      error: (error) => console.error('Error fetching majors', error)
    });
  }

  getStudents(): void {
    const ownId = this.userService.getStudentId();
    this.studentService.getStudents().subscribe(response => {
      this.students = response.students.filter(student => student.id !== ownId);
      this.isLoading = false;
    }, error => {
      console.error('Error fetching students:', error);
      this.isLoading = false;
    });
  }

  get filteredStudents(): Student[] {
    const search = this.searchText.trim().toLowerCase();
    return this.students.filter(student => {
      if (search) {
        const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
        if (!fullName.includes(search)) return false;
      }
      if (this.genderFilter !== 'all' && student.sex !== this.genderFilter) return false;
      if (this.dormFilter !== null && student.dorm_id !== this.dormFilter) return false;
      if (this.majorFilter !== null && student.id_major !== this.majorFilter) return false;
      return true;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.genderFilter = 'all';
    this.dormFilter = null;
    this.majorFilter = null;
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

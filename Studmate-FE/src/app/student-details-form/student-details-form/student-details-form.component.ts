
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation.service';
import { StudentService } from 'src/app/services/student.service';
import { ROUTE_PATHS } from 'src/shared/constants/route-paths';
import { ActivatedRoute } from '@angular/router';
import { Major, Dorm, Sex, Student } from 'src/shared/models/student.interface';

@Component({
  selector: 'app-student-details-form',
  templateUrl: './student-details-form.component.html',
  styleUrls: ['./student-details-form.component.scss']
})
export class StudentDetailsFormComponent implements OnInit {
  studentForm!: FormGroup;
  dorms?: Dorm[];
  majors?: Major[];
  sexes?: Sex[];
  yearsOfStudy: number[] = [1, 2, 3, 4, 5, 6];
  selectedFile: File | null = null;
  availableImportanceScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  usedImportanceScores: Set<number> = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getDorms();
    this.getMajors();
    this.getSexes();
    this.loadStudentDetails();
  }

  private createForm() {
    this.studentForm = this.fb.group({
      dorm: [''],
      major: [''],
      sex: [''],
      yearOfStudy: [''],
      description: [''],
      cleanlinessHabits: [''],
      cleanlinessHabitsImportance: ['', Validators.required],
      sleepingPatterns: [''],
      sleepingPatternsImportance: ['', Validators.required],
      noiseTolerance: [''],
      noiseToleranceImportance: ['', Validators.required],
      belongingsSharing: [''],
      belongingsSharingImportance: ['', Validators.required],
      guestPolicy: [''],
      guestPolicyImportance: ['', Validators.required],
      sharingResponsibilities: [''],
      sharingResponsibilitiesImportance: ['', Validators.required],
      itemsSharing: [''],
      itemsSharingImportance: ['', Validators.required],
      temperaturePreferences: [''],
      temperaturePreferencesImportance: ['', Validators.required],
      hobbies: [''],
      hobbiesImportance: ['', Validators.required],
      personalValues: [''],
      personalValuesImportance: ['', Validators.required],
    });
    this.studentForm.valueChanges.subscribe(values => {
      this.updateAvailableImportanceScores();
    });
  }

  private loadStudentDetails() {
    this.studentService.getStudentDetails().subscribe(
      response => {
        const student = response.student;
        console.log('Loaded student details:', student);
        if (student && student.categories) {
          this.studentForm.patchValue({
            dorm: student.dorm_id,
            major: student.id_major,
            sex: student.id_sex,
            yearOfStudy: student.year_of_study,
            description: student.description,
            cleanlinessHabits: this.getCategoryAnswer(student.categories, 1),
            cleanlinessHabitsImportance: this.getCategoryImportance(student.categories, 1),
            sleepingPatterns: this.getCategoryAnswer(student.categories, 2),
            sleepingPatternsImportance: this.getCategoryImportance(student.categories, 2),
            noiseTolerance: this.getCategoryAnswer(student.categories, 3),
            noiseToleranceImportance: this.getCategoryImportance(student.categories, 3),
            belongingsSharing: this.getCategoryAnswer(student.categories, 4),
            belongingsSharingImportance: this.getCategoryImportance(student.categories, 4),
            guestPolicy: this.getCategoryAnswer(student.categories, 5),
            guestPolicyImportance: this.getCategoryImportance(student.categories, 5),
            sharingResponsibilities: this.getCategoryAnswer(student.categories, 6),
            sharingResponsibilitiesImportance: this.getCategoryImportance(student.categories, 6),
            itemsSharing: this.getCategoryAnswer(student.categories, 7),
            itemsSharingImportance: this.getCategoryImportance(student.categories, 7),
            temperaturePreferences: this.getCategoryAnswer(student.categories, 8),
            temperaturePreferencesImportance: this.getCategoryImportance(student.categories, 8),
            hobbies: this.getCategoryAnswer(student.categories, 9),
            hobbiesImportance: this.getCategoryImportance(student.categories, 9),
            personalValues: this.getCategoryAnswer(student.categories, 10),
            personalValuesImportance: this.getCategoryImportance(student.categories, 10)
          });
        }
      },
      error => {
        console.error('Error loading student details', error);
      }
    );
  }

  private getCategoryAnswer(categories: any[], categoryId: number): string {
    if (!categories) {
      return '';
    }
    const category = categories.find(c => c.category_id === categoryId);
    return category ? category.answer : '';
  }

  private getCategoryImportance(categories: any[], categoryId: number): number | null {
    if (!categories) {
      return null;
    }
    const category = categories.find(c => c.category_id === categoryId);
    return category ? category.importance_score : null;
  }

  updateAvailableImportanceScores(): void {
    this.usedImportanceScores.clear();
    const importanceFields = [
      'cleanlinessHabitsImportance',
      'sleepingPatternsImportance',
      'noiseToleranceImportance',
      'belongingsSharingImportance',
      'guestPolicyImportance',
      'sharingResponsibilitiesImportance',
      'itemsSharingImportance',
      'temperaturePreferencesImportance',
      'hobbiesImportance',
      'personalValuesImportance'
    ];

    importanceFields.forEach(field => {
      const value = this.studentForm.get(field)?.value;
      if (value) {
        this.usedImportanceScores.add(value);
      }
    });
  }

  getAvailableScores(currentImportance: number | null): number[] {
    return this.availableImportanceScores.filter(score => !this.usedImportanceScores.has(score) || score === currentImportance);
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

  getMajors(): void {
    this.studentService.getMajors().subscribe(
      response => {
        this.majors = response.majors;
      },
      error => {
        console.error('Error fetching majors', error);
      }
    );
  }

  getSexes(): void {
    this.studentService.getSexes().subscribe(
      response => {
        this.sexes = response.sexes;
      },
      error => {
        console.error('Error fetching sexes', error);
      }
    );
  }

  onSubmit(): void {
    console.log(this.studentForm.valid);
    if (this.studentForm.valid) {
      const formData = new FormData();
      formData.append('dorm', this.studentForm.value.dorm);
      formData.append('major', this.studentForm.value.major);
      formData.append('sex', this.studentForm.value.sex);
      formData.append('description', this.studentForm.value.description);
      formData.append('year_of_study', this.studentForm.value.yearOfStudy);

      formData.append('cleanlinessHabits', this.studentForm.value.cleanlinessHabits);
      formData.append('cleanlinessHabitsImportance', this.studentForm.value.cleanlinessHabitsImportance);
      formData.append('sleepingPatterns', this.studentForm.value.sleepingPatterns);
      formData.append('sleepingPatternsImportance', this.studentForm.value.sleepingPatternsImportance);
      formData.append('noiseTolerance', this.studentForm.value.noiseTolerance);
      formData.append('noiseToleranceImportance', this.studentForm.value.noiseToleranceImportance);
      formData.append('belongingsSharing', this.studentForm.value.belongingsSharing);
      formData.append('belongingsSharingImportance', this.studentForm.value.belongingsSharingImportance);
      formData.append('guestPolicy', this.studentForm.value.guestPolicy);
      formData.append('guestPolicyImportance', this.studentForm.value.guestPolicyImportance);
      formData.append('sharingResponsibilities', this.studentForm.value.sharingResponsibilities);
      formData.append('sharingResponsibilitiesImportance', this.studentForm.value.sharingResponsibilitiesImportance);
      formData.append('itemsSharing', this.studentForm.value.itemsSharing);
      formData.append('itemsSharingImportance', this.studentForm.value.itemsSharingImportance);
      formData.append('temperaturePreferences', this.studentForm.value.temperaturePreferences);
      formData.append('temperaturePreferencesImportance', this.studentForm.value.temperaturePreferencesImportance);
      formData.append('hobbies', this.studentForm.value.hobbies);
      formData.append('hobbiesImportance', this.studentForm.value.hobbiesImportance);
      formData.append('personalValues', this.studentForm.value.personalValues);
      formData.append('personalValuesImportance', this.studentForm.value.personalValuesImportance);

      this.studentService.updateStudent(formData).subscribe(
        response => {
          console.log('Student created successfully', response);
          this.navigationService.navigateTo(ROUTE_PATHS.USERS);
        },
        error => {
          console.error('Error creating student', error);
        }
      );
    }
  }
}

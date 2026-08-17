
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation.service';
import { StudentService } from 'src/app/services/student.service';
import { ROUTE_PATHS } from 'src/shared/constants/route-paths';
import { ActivatedRoute } from '@angular/router';
import { Major, Dorm, Sex } from 'src/shared/models/student.interface';

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
    this.loadStudentPreferences();
  }

  private createForm() {
    this.studentForm = this.fb.group({
      dorm: ['', Validators.required],
      sex: ['', Validators.required],
      major: [''],
      yearOfStudy: [''],
      description: [''],
      // 6 direct categories, 1-5
      cat_sleep: [3, Validators.required],
      cat_noise: [3, Validators.required],
      cat_clean: [3, Validators.required],
      cat_social: [3, Validators.required],
      cat_sharing: [3, Validators.required],
      cat_lifestyle: [3, Validators.required],
      // 3 hobby proxy sliders (D7 -- see studmate-d7-decision memory note), 1-5
      cat_hobby1: [3, Validators.required],
      cat_hobby2: [3, Validators.required],
      cat_hobby3: [3, Validators.required],
      // 7 importance weights, 1-10
      imp_sleep: [5, Validators.required],
      imp_noise: [5, Validators.required],
      imp_clean: [5, Validators.required],
      imp_social: [5, Validators.required],
      imp_sharing: [5, Validators.required],
      imp_lifestyle: [5, Validators.required],
      imp_hobbies: [5, Validators.required],
    });
  }

  private loadStudentPreferences() {
    this.studentService.getStudentPreferences().subscribe(
      response => {
        const prefs = response.preferences;
        if (!prefs) {
          return;
        }
        const patch: any = {
          dorm: prefs.dorm,
          sex: prefs.sex,
          major: prefs.major,
          yearOfStudy: prefs.year_of_study,
          description: prefs.description,
        };
        // only overwrite the slider defaults if the student already has saved preferences
        const sliderFields = ['cat_sleep', 'cat_noise', 'cat_clean', 'cat_social', 'cat_sharing',
          'cat_lifestyle', 'cat_hobby1', 'cat_hobby2', 'cat_hobby3',
          'imp_sleep', 'imp_noise', 'imp_clean', 'imp_social', 'imp_sharing', 'imp_lifestyle', 'imp_hobbies'];
        sliderFields.forEach(field => {
          const value = (prefs as any)[field];
          if (value !== null && value !== undefined) {
            patch[field] = value;
          }
        });
        this.studentForm.patchValue(patch);
      },
      error => {
        console.error('Error loading student preferences', error);
      }
    );
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
    if (this.studentForm.valid) {
      this.studentService.updateStudentPreferences(this.studentForm.value).subscribe(
        response => {
          console.log('Preferences saved successfully', response);
          this.navigationService.navigateTo(ROUTE_PATHS.USERS);
        },
        error => {
          console.error('Error saving preferences', error);
        }
      );
    }
  }
}

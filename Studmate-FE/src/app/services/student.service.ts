import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DormResponse, Major, MajorResponse, Student, StudentsResponse, SexResponse, StudentMatchesResponse } from 'src/shared/models/student.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  updateStudent(student: any) {
    return this.http.patch(`https://127.0.0.1:5000/students`, student);
  }

  getStudentDetails(): Observable<any> {
    return this.http.get<any>(`https://127.0.0.1:5000/student`);
  }

  getStudents(): Observable<StudentsResponse> {
    return this.http.get<StudentsResponse>(`https://127.0.0.1:5000/students`);
  }

  getMajors(): Observable<MajorResponse> {
    return this.http.get<MajorResponse>(`https://127.0.0.1:5000/majors`);
  }

  getDorms(): Observable<DormResponse> {
    return this.http.get<DormResponse>(`https://127.0.0.1:5000/dorms`);
  }

  getSexes(): Observable<SexResponse> {
    return this.http.get<SexResponse>(`https://127.0.0.1:5000/sexes`);
  }

  getStudentMatches(): Observable<StudentMatchesResponse> {
    return this.http.get<StudentMatchesResponse>(`https://127.0.0.1:5000/student-matches`);
  }

  getStudentProfile(studentId: number): Observable<any> {
    return this.http.get<any>(`https://127.0.0.1:5000/student/${studentId}`);
  }

  sendRoommateRequest(requesterId: number, targetId: number): Observable<any> {
    return this.http.post('https://127.0.0.1:5000/roommate_requests', {
      requester_id: requesterId,
      target_id: targetId
    });
  }

  checkRoommateRequest(requesterId: number, targetId: number): Observable<any> {
    return this.http.get(`https://127.0.0.1:5000/check_request/${requesterId}/${targetId}`);
  }

}




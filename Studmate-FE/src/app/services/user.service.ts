import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly STUDENT_ID_KEY = 'studentId';

  setStudentId(id: number): void {
    sessionStorage.setItem(this.STUDENT_ID_KEY, id.toString());
  }

  getStudentId(): number | null {
    const id = sessionStorage.getItem(this.STUDENT_ID_KEY);
    return id ? Number(id) : null;
  }

  clearStudentId(): void {
    sessionStorage.removeItem(this.STUDENT_ID_KEY);
  }
}

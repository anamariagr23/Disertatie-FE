import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BondGroupMember {
  student_id: number;
  firstname: string;
  lastname: string;
}

export interface BondGroupResponse {
  group_size: number;
  members: BondGroupMember[];
  max_room_capacity: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class BondService {
  private apiUrl = 'https://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getMyBondGroup(): Observable<BondGroupResponse> {
    return this.http.get<BondGroupResponse>(`${this.apiUrl}/bonds/my-group`);
  }
}

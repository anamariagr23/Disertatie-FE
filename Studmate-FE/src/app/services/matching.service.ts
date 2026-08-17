import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchingRequest {
  method: 'random' | 'greedy' | 'greedy+hc' | 'greedy+sa';
  seed?: number;
  source?: 'csv' | 'db';
  dorm_id?: number;
}

export interface RoomResult {
  room: string;
  gender: 'female' | 'male';
  members: number[];
  member_names?: { [studentId: string]: string };
  group_score: number;
}

export interface GenderMetrics {
  gender: 'female' | 'male';
  avg_cohesion: number;
  worst_min_pairwise: number;
  mean_within_variance: number;
  bond_satisfaction: number;
}

export interface RunResponse {
  method: string;
  seed: number;
  rooms: number;
  metrics: GenderMetrics[];
}

export interface ResultsResponse {
  method: string;
  rooms: RoomResult[];
}

export interface MetricsResponse {
  method: string;
  metrics: GenderMetrics[];
}

export interface Roommate {
  student_id: number;
  firstname: string;
  lastname: string;
}

export interface MyAssignmentResponse {
  assignment_id: number;
  status: 'proposed' | 'confirmed' | 'rejected';
  run_id: string;
  group_score: number;
  room: { id: number; label: string; capacity: number; dorm: string | null } | null;
  roommates: Roommate[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private apiUrl = 'https://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  runMatching(request: MatchingRequest): Observable<RunResponse> {
    return this.http.post<RunResponse>(
      `${this.apiUrl}/matching/run`,
      request
    );
  }

  getResults(): Observable<ResultsResponse> {
    return this.http.get<ResultsResponse>(
      `${this.apiUrl}/matching/results`
    );
  }

  getMetrics(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(
      `${this.apiUrl}/matching/metrics`
    );
  }

  getMyAssignment(): Observable<MyAssignmentResponse> {
    return this.http.get<MyAssignmentResponse>(
      `${this.apiUrl}/matching/my-assignment`
    );
  }

  respondToAssignment(assignmentId: number, action: 'accept' | 'reject'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/matching/assignment/${assignmentId}/respond`,
      { action }
    );
  }
}

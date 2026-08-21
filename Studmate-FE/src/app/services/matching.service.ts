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
  gender: 'female' | 'male' | 'mixed';
  members: number[];
  member_names?: { [studentId: string]: string };
  group_score: number | null;
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
  waitlisted_count: number;
  excluded_count?: number;
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
  avatar_link: string | null;
}

export interface MyAssignmentResponse {
  assignment_id: number;
  status: 'proposed' | 'confirmed' | 'rejected';
  run_id: string;
  group_score: number | null;
  room: { id: number; label: string; capacity: number; dorm: string | null } | null;
  roommates: Roommate[];
}

export interface PendingChangesResponse {
  run_id: string;
  rejected_count: number;
  new_arrival_count: number;
  still_waitlisted_count: number;
  excluded_count: number;
  confirmed_count: number;
  unmet_bond_count: number;
}

export interface DiffEntry {
  student_id: number;
  name: string | null;
  old_room: string | null;
  new_room: string | null;
  change: 'unchanged' | 'moved' | 'newly_placed' | 'waitlisted';
}

export interface ReoptimizeResponse {
  old_run_id: string;
  new_run_id: string;
  rooms: number;
  moved_count: number;
  waitlisted_count: number;
  metrics: GenderMetrics[];
  diff: DiffEntry[];
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

  getPendingChanges(dormId: number | null): Observable<PendingChangesResponse> {
    const params = dormId ? `?dorm_id=${dormId}` : '';
    return this.http.get<PendingChangesResponse>(
      `${this.apiUrl}/matching/pending-changes${params}`
    );
  }

  reoptimize(dormId: number | null, method: string, seed: number): Observable<ReoptimizeResponse> {
    return this.http.post<ReoptimizeResponse>(
      `${this.apiUrl}/matching/reoptimize`,
      { dorm_id: dormId, method, seed }
    );
  }
}

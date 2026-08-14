import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchingRequest {
  method: 'random' | 'greedy' | 'greedy+hc' | 'greedy+sa';
  seed?: number;
}

export interface RoomResult {
  room: string;
  gender: 'female' | 'male';
  members: number[];
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
}

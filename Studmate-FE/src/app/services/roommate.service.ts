import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoommateRequestDetails, RoommateRequestsResponse } from 'src/shared/models/roommate.interface';

@Injectable({
  providedIn: 'root'
})
export class RoommateService {

  constructor(private http: HttpClient) { }

  getRoommateRequestsForTarget(targetId: number): Observable<RoommateRequestsResponse> {
    return this.http.get<RoommateRequestsResponse>(`https://127.0.0.1:5000/roommate_requests/target/${targetId}`, {
      headers: { 'Accept': 'application/json' }
    });
  }

  fetchUnviewedRequests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://127.0.0.1:5000/get_unviewed_requests/${userId}`);
  }

  markRequestsAsViewed(requestIds: number[]): Observable<any> {
    return this.http.post('https://127.0.0.1:5000/mark_requests_viewed', { request_ids: requestIds });
  }

  getAllRoommateRequests(): Observable<RoommateRequestDetails> {
    return this.http.get<RoommateRequestDetails>(`https://127.0.0.1:5000/roommate_requests_all`, {
      headers: { 'Accept': 'application/json' }
    });
  }

  acceptRequest(requestId: number): Observable<void> {
    return this.http.patch<void>(`https://127.0.0.1:5000/roommate_requests/${requestId}`, { accepted: true });
  }
}

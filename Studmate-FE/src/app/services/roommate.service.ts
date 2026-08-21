import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrossGenderPendingResponse, RoommateRequestDetails, RoommateRequestsResponse, SentRoommateRequestsResponse } from 'src/shared/models/roommate.interface';

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

  declineRequest(requestId: number): Observable<void> {
    return this.http.patch<void>(`https://127.0.0.1:5000/roommate_requests/${requestId}`, { accepted: false });
  }

  getSentRequests(requesterId: number): Observable<SentRoommateRequestsResponse> {
    return this.http.get<SentRoommateRequestsResponse>(`https://127.0.0.1:5000/roommate_requests/sent/${requesterId}`);
  }

  withdrawRequest(requesterId: number, requestId: number): Observable<any> {
    return this.http.delete(`https://127.0.0.1:5000/roommate_requests/sent/${requesterId}`, { body: { request_id: requestId } });
  }

  getCrossGenderPending(): Observable<CrossGenderPendingResponse> {
    return this.http.get<CrossGenderPendingResponse>(`https://127.0.0.1:5000/roommate_requests/cross-gender-pending`);
  }

  reviewCrossGenderRequest(requestId: number, approve: boolean): Observable<any> {
    return this.http.post(`https://127.0.0.1:5000/roommate_requests/cross-gender-pending/${requestId}`, { approve });
  }
}

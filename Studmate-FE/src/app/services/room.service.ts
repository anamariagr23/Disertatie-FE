import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Room {
  id: number;
  label: string;
  capacity: number;
  floor: number | null;
  sex: string | null;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface BulkCreateRequest {
  floors: number;
  rooms_per_floor: number;
  capacity: number;
  floor_gender: { [floor: string]: 'female' | 'male' };
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getRooms(dormId: number): Observable<RoomsResponse> {
    return this.http.get<RoomsResponse>(`${this.apiUrl}/dorms/${dormId}/rooms`);
  }

  bulkCreateRooms(dormId: number, request: BulkCreateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/dorms/${dormId}/rooms/bulk`, request);
  }

  updateRoom(dormId: number, roomId: number, changes: Partial<Room>): Observable<any> {
    return this.http.put(`${this.apiUrl}/dorms/${dormId}/rooms/${roomId}`, changes);
  }

  deleteRoom(dormId: number, roomId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dorms/${dormId}/rooms/${roomId}`);
  }

  deleteAllRooms(dormId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dorms/${dormId}/rooms`);
  }
}

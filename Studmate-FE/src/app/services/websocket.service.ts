import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { RequestViewedNotification, RoommateRequestNotification } from 'src/shared/models/roommate.interface';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) { }

  joinUserRoom(userId: number) {
    this.socket.emit('join', { room: `user_${userId}` });
  }

  getNewRoommateRequests(): Observable<RoommateRequestNotification> {
    return this.socket.fromEvent<RoommateRequestNotification>('new_roommate_request');
  }

  getRoommateRequestViewed(): Observable<RequestViewedNotification> {
    return this.socket.fromEvent<RequestViewedNotification>('request_viewed');
  }
}

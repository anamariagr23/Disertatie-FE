import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ConversationsResponse } from 'src/shared/models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messageReceivedSubject = new Subject<any>();

  constructor(private http: HttpClient, private socket: Socket) {

  }
  connect(user_id: string) {
    this.socket.emit('user_connect', { user_id })
  }

  logout(user_id: string) {
    this.socket.emit('user_disconnect', { user_id });
  }


  getConversations(): Observable<ConversationsResponse> {
    return this.http.get<ConversationsResponse>(`https://127.0.0.1:5000/get-conversations`);
  }

  getMessageReceivedObservable(): Observable<any> {
    return this.messageReceivedSubject.asObservable();
  }

  getConversationMessages(userId: number): Observable<any> {
    return this.http.get<any>(`https://127.0.0.1:5000/get-conversation/${userId}`);
  }

  getLatestMessages(): Observable<any> {
    return this.http.get<any>('https://127.0.0.1:5000/get-conversations');
  }

  joinRoom(room: string, username: string) {
    this.socket.emit('join', { room, username });
  }

  leaveRoom(room: string, username: string) {
    this.socket.emit('leave', { room, username });
  }

  sendMessage(room: string, message: string, author_id: number) {
    console.log("send message service");
    this.socket.emit('message', { room, message, author_id });
  }

  getMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }

  getUserStatus(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_status', (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('user_status');
      };
    });
  }

  getOnlineUsers(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('update_user_list', (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('update_user_list');
      };
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { DrawerService } from '../services/drawer.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer?: MatSidenav;
  title = 'Studmate-FE';

  drawerContent: 'userList' | 'chat' = 'userList';
  users: any[] = [];
  conversations: any[] = [];
  selectedConversation: any;
  showChat = false;
  selectedUserId!: number | null;

  constructor(private chatService: ChatService, public drawerService: DrawerService) { }


  ngOnInit(): void {
    this.drawerService.drawerState$.subscribe(isOpen => {
      if (isOpen) {
        this.drawer?.open();
      } else {
        this.drawer?.close();
      }
    });
    this.loadConversations();

    this.chatService.getMessageReceivedObservable().subscribe(data => {
      this.updateConversationList(data);
    });
  }

  loadConversations(): void {
    this.chatService.getConversations().subscribe(response => {
      this.conversations = response.conversation_summary;
    }, error => {
      console.error('Error fetching conversations', error);
    });
  }

  updateConversationList(newMessage: any): void {
    const conversation = this.conversations.find(c => c.conversation_id === newMessage.conversation_id);
    if (conversation) {
      conversation.last_message = newMessage.last_message;
    } else {
      this.conversations.push({
        conversation_id: newMessage.conversation_id,
        last_message: newMessage.last_message,
        messages: [newMessage.last_message]
      });
    }
  }

  openChat(userId: number): void {
    this.selectedUserId = userId;
    this.showChat = true;
  }

  goBack(): void {
    this.showChat = false;
    this.selectedUserId = null;
  }

}

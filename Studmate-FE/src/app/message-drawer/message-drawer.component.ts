import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConversationSummary } from 'src/shared/models/chat.interface';

@Component({
  selector: 'app-message-drawer',
  templateUrl: './message-drawer.component.html',
  styleUrls: ['./message-drawer.component.scss']
})
export class MessageDrawerComponent {
  @Output() openChat = new EventEmitter<number>();
  conversations: any[] = [];
  messageSubscription?: Subscription;
  onlineuserStatusSubscription?: Subscription;
  selectedUserId?: number;

  constructor(private chatService: ChatService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loadConversations();

    this.chatService.getLatestMessages().subscribe({
      next: (response) => {
        this.conversations.forEach(convo => {
          let lastMessage = response.conversations.find((c: { conversation_id: any; }) => c.conversation_id === convo.id)?.last_message;
          if (lastMessage) {
            convo.last_message = lastMessage;
          }
        });
      },
      error: (error) => console.error('Error fetching latest messages', error)
    });

    const studentId = this.userService.getStudentId()?.toString()!;
    if (studentId != undefined) {
      this.chatService.connect(studentId);
    }

    this.onlineuserStatusSubscription = this.chatService.getOnlineUsers().subscribe(data => {
      this.updateOnlineStatus(data);
      console.log(this.conversations)
    });

    this.messageSubscription = this.chatService.getMessageReceivedObservable().subscribe(data => {
      this.updateConversationList(data);
    });

  }

  updateOnlineStatus(onlineUserIds: string[]) {
    const onlineUserIdsNumber = onlineUserIds.map(id => Number(id));

    this.conversations.forEach(conversation => {
      conversation.online_status = onlineUserIdsNumber.includes(conversation.id);
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
      });
    }
  }

  selectConversation(userId: number): void {
    console.log('Selected User ID:', userId);
    this.selectedUserId = userId;
    this.openChat.emit(userId);
  }

  clearConversation(): void {
    this.selectedUserId = undefined;
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() userId!: number | null;
  @Output() back = new EventEmitter<void>();
  messages: any[] = [];
  messageSubscription?: Subscription;
  message: string = '';
  currentUser!: number | null;
  conversationId: number | null = null;

  constructor(private chatService: ChatService, private userService: UserService) { }

  ngOnInit(): void {

    this.currentUser = this.userService.getStudentId();
    console.log('Current User ID:', this.currentUser);
    console.log('Selected User ID:', this.userId);

    if (this.userId !== undefined) {
      this.loadMessages(this.userId!);
    }

    this.messageSubscription = this.chatService.getMessage().subscribe(data => {
      if (data.conversation_id == this.conversationId) {
        this.messages.push(data);
      }
    });
  }


  loadMessages(userId: number): void {
    this.chatService.getConversationMessages(userId).subscribe(response => {
      this.conversationId = response.conversation_id;
      this.messages = response.messages;
      console.log('Loaded conversation ID:', this.conversationId);
      console.log('Loaded messages:', this.messages);

      this.chatService.joinRoom(this.conversationId!.toString(), this.currentUser!.toString());
    }, error => {
      console.error('Error fetching messages', error);
    });
  }

  sendMessage(): void {
    if (this.conversationId !== null) {
      console.log(this.conversationId.toString(), this.message, this.currentUser);
      this.chatService.sendMessage(this.conversationId.toString(), this.message, this.currentUser!);
      this.message = '';
    } else {
      console.error('Conversation ID is null');
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.conversationId !== null) {
      this.chatService.leaveRoom(this.conversationId.toString(), this.currentUser!.toString());
    }
  }

  goBack(): void {
    this.back.emit(); // Emit the back event
  }
}


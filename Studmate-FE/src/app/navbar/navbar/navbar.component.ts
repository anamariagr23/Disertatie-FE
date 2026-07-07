import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { ROUTE_PATHS } from 'src/shared/constants/route-paths';
import { MatSidenav } from '@angular/material/sidenav';
import { DrawerService } from 'src/app/services/drawer.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { RequestViewedNotification, RoommateRequestNotification } from 'src/shared/models/roommate.interface';
import { RoommateService } from 'src/app/services/roommate.service';
import { ChatService } from 'src/app/services/chat.service';
declare var handleSignout: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Output() openDrawerEvent = new EventEmitter<void>();
  notificationCount: number = 0;
  userId: number | null = null;
  retryInterval: any;
  idRole: number | null = null;


  constructor(
    private roommateService: RoommateService,
    private navigationService: NavigationService,
    private userService: UserService,
    private drawerService: DrawerService,
    private websocketService: WebsocketService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.checkUserId();
    this.idRole = this.getIdRoleFromLocalStorage();
    console.log(this.userId);
  }

  checkUserId() {
    this.userId = this.userService.getStudentId();
    if (this.userId != null) {
      this.initializeWebSocket();
      this.fetchUnviewedRequests();
      clearInterval(this.retryInterval);
    } else {
      this.retryInterval = setInterval(() => {
        this.userId = this.userService.getStudentId();
        if (this.userId != null) {
          this.initializeWebSocket();
          this.fetchUnviewedRequests();
          clearInterval(this.retryInterval);
        }
      }, 1000);
    }
  }

  getIdRoleFromLocalStorage(): number | null {
    const idRole = localStorage.getItem('id_role');
    return idRole ? parseInt(idRole, 10) : null;
  }

  initializeWebSocket() {
    if (this.userId != null) {
      this.websocketService.joinUserRoom(this.userId);

      this.websocketService.getNewRoommateRequests().subscribe((data) => {
        console.log(data.message);
        this.notificationCount++;
        console.log(this.notificationCount);
      });

      this.websocketService.getRoommateRequestViewed().subscribe((data) => {
        console.log(data.message);
      });
    }
  }

  fetchUnviewedRequests() {
    if (this.userId != null) {
      this.roommateService.fetchUnviewedRequests(this.userId).subscribe((requests: any[]) => {
        this.notificationCount = requests.length;
        console.log(this.notificationCount);
      });
    }
  }

  logout(): void {
    if (this.userId != null) {
      this.chatService.logout(this.userId.toString());
    }

    localStorage.removeItem('token');
    localStorage.removeItem('details_completed');
    localStorage.removeItem('id_role');
    handleSignout();
    sessionStorage.removeItem('googleCredential');
    this.userService.clearStudentId();
    this.navigationService.navigateToWithReload(ROUTE_PATHS.LOGIN);
  }

  navigateToUsers(): void {
    this.navigationService.navigateToUsers();
  }

  navigateToPersonalProfile(): void {
    const studentId = this.userService.getStudentId();
    if (studentId != null) {
      this.navigationService.navigateToUserProfile(studentId);
    }
  }

  navigateToRoomateRequests(): void {
    this.navigationService.navigateToRoomateRequests();
  }

  openDrawer() {
    this.drawerService.openDrawer();
  }

}

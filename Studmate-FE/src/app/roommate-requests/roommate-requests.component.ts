import { Component } from '@angular/core';
import { RoommateService } from '../services/roommate.service';
import { RoommateRequest } from 'src/shared/models/roommate.interface';
import { UserService } from '../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roommate-requests',
  templateUrl: './roommate-requests.component.html',
  styleUrls: ['./roommate-requests.component.scss']
})
export class RoommateRequestsComponent {
  roommateRequests: RoommateRequest[] = [];
  targetId?: number | null;

  constructor(private roommateRequestService: RoommateService, private userService: UserService, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.targetId = this.userService.getStudentId();
    if (this.targetId) {
      this.loadRoommateRequests(this.targetId);
    }
  }

  private loadRoommateRequests(targetId: number): void {
    this.roommateRequestService.getRoommateRequestsForTarget(targetId).subscribe({
      next: (response) => {
        this.roommateRequests = response.requests;
        console.log(this.roommateRequests);
        this.markRequestsAsViewed();
      },
      error: (error) => console.error('Error fetching roommate requests:', error)
    });
  }

  private markRequestsAsViewed(): void {
    const requestIds = this.roommateRequests.map(request => request.request_id);
    if (requestIds.length > 0) {
      this.roommateRequestService.markRequestsAsViewed(requestIds).subscribe(() => {
        console.log('Requests marked as viewed');
      });
    }
  }


  acceptRequest(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.roommateRequestService.acceptRequest(requestId).subscribe({
          next: () => {
            console.log('Request accepted');
            this.loadRoommateRequests(this.targetId!);
          },
          error: (error) => console.error('Error accepting request:', error)
        });
      }
    });
  }

}

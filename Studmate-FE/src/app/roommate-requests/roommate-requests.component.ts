import { Component } from '@angular/core';
import { RoommateService } from '../services/roommate.service';
import { RoommateRequest, SentRoommateRequest } from 'src/shared/models/roommate.interface';
import { UserService } from '../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BondService, BondGroupResponse } from '../services/bond.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-roommate-requests',
  templateUrl: './roommate-requests.component.html',
  styleUrls: ['./roommate-requests.component.scss']
})
export class RoommateRequestsComponent {
  roommateRequests: RoommateRequest[] = [];
  sentRequests: SentRoommateRequest[] = [];
  targetId?: number | null;
  bondGroup: BondGroupResponse | null = null;
  errorMessage: string | null = null;

  daysRemaining: number | null = null;
  deadlinePassed = false;

  constructor(
    private roommateRequestService: RoommateService,
    private userService: UserService,
    private bondService: BondService,
    private studentService: StudentService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.targetId = this.userService.getStudentId();
    if (this.targetId) {
      this.loadRoommateRequests(this.targetId);
      this.loadSentRequests();
    }
    this.loadBondGroup();
    this.loadDeadline();
  }

  private loadDeadline(): void {
    this.studentService.getStudentDetails().subscribe({
      next: (response) => {
        const dormId = response?.student?.dorm_id;
        if (!dormId) return;
        this.studentService.getDorms().subscribe({
          next: (dormsResponse) => {
            const dorm = dormsResponse.dorms.find(d => d.id === dormId);
            if (!dorm?.registration_deadline) return;
            const deadline = new Date(dorm.registration_deadline).getTime();
            const now = Date.now();
            this.deadlinePassed = now > deadline;
            this.daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          },
          error: (error) => console.error('Error fetching dorms', error)
        });
      },
      error: (error) => console.error('Error fetching student details', error)
    });
  }

  private loadSentRequests(): void {
    this.roommateRequestService.getSentRequests(this.targetId!).subscribe({
      next: (response) => this.sentRequests = response.requests,
      error: (error) => console.error('Error fetching sent requests:', error)
    });
  }

  withdrawRequest(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Withdraw Roommate Request',
        message: 'Withdraw this pending roommate request?'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.errorMessage = null;
        this.roommateRequestService.withdrawRequest(this.targetId!, requestId).subscribe({
          next: () => this.loadSentRequests(),
          error: (error) => {
            console.error('Error withdrawing request:', error);
            this.errorMessage = error?.error?.error || 'Failed to withdraw the request.';
          }
        });
      }
    });
  }

  private loadBondGroup(): void {
    this.bondService.getMyBondGroup().subscribe({
      next: (response) => this.bondGroup = response,
      error: (error) => console.error('Error fetching bond group', error)
    });
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
      width: '250px',
      data: {
        title: 'Accept Roommate Request',
        message: 'This action is irreversible. Are you sure you want to accept this roommate request?'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.errorMessage = null;
        this.roommateRequestService.acceptRequest(requestId).subscribe({
          next: () => {
            console.log('Request accepted');
            this.loadRoommateRequests(this.targetId!);
            this.loadBondGroup();
          },
          error: (error) => {
            console.error('Error accepting request:', error);
            this.errorMessage = error?.error?.error || 'Failed to accept the request.';
          }
        });
      }
    });
  }

  declineRequest(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Decline Roommate Request',
        message: 'Are you sure you want to decline this roommate request?'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.errorMessage = null;
        this.roommateRequestService.declineRequest(requestId).subscribe({
          next: () => {
            console.log('Request declined');
            this.loadRoommateRequests(this.targetId!);
          },
          error: (error) => {
            console.error('Error declining request:', error);
            this.errorMessage = error?.error?.error || 'Failed to decline the request.';
          }
        });
      }
    });
  }

}

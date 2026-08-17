import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatchingService, MyAssignmentResponse } from '../services/matching.service';

@Component({
  selector: 'app-my-room',
  templateUrl: './my-room.component.html',
  styleUrls: ['./my-room.component.scss']
})
export class MyRoomComponent implements OnInit {
  assignment: MyAssignmentResponse | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(private matchingService: MatchingService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadAssignment();
  }

  private loadAssignment(): void {
    this.loading = true;
    this.matchingService.getMyAssignment().subscribe({
      next: (response) => {
        this.assignment = response;
        this.loading = false;
      },
      error: (error) => {
        this.assignment = null;
        this.loading = false;
        if (error?.status !== 404) {
          console.error('Error loading room assignment:', error);
          this.errorMessage = 'Failed to load your room assignment.';
        }
      }
    });
  }

  formatScore(score: number): string {
    return (score * 100).toFixed(1);
  }

  accept(): void {
    this.respond('accept', 'Accept Room', 'Confirm this room? Once accepted, your spot is locked in.');
  }

  reject(): void {
    this.respond('reject', 'Reject Room', 'Reject this room? You will return to the unassigned pool until an admin re-runs matching.');
  }

  private respond(action: 'accept' | 'reject', title: string, message: string): void {
    if (!this.assignment) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.assignment) {
        this.matchingService.respondToAssignment(this.assignment.assignment_id, action).subscribe({
          next: () => this.loadAssignment(),
          error: (error) => {
            console.error(`Error responding (${action}) to assignment:`, error);
            this.errorMessage = 'Failed to submit your response.';
          }
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { RoommateService } from '../services/roommate.service';
import { CrossGenderPendingRequest } from 'src/shared/models/roommate.interface';

@Component({
  selector: 'app-cross-gender-bond-queue',
  templateUrl: './cross-gender-bond-queue.component.html',
  styleUrls: ['./cross-gender-bond-queue.component.scss']
})
export class CrossGenderBondQueueComponent implements OnInit {
  requests: CrossGenderPendingRequest[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  processingId: number | null = null;

  constructor(private roommateService: RoommateService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.roommateService.getCrossGenderPending().subscribe({
      next: (response) => {
        this.requests = response.requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cross-gender pending requests', error);
        this.errorMessage = 'Failed to load pending requests.';
        this.isLoading = false;
      }
    });
  }

  review(requestId: number, approve: boolean): void {
    if (this.processingId) return;
    this.processingId = requestId;
    this.errorMessage = null;
    this.roommateService.reviewCrossGenderRequest(requestId, approve).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.request_id !== requestId);
        this.processingId = null;
      },
      error: (error) => {
        console.error('Error reviewing cross-gender request', error);
        this.errorMessage = error?.error?.error || 'Failed to review this request.';
        this.processingId = null;
      }
    });
  }
}

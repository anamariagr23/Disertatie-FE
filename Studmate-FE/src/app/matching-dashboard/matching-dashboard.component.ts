import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatchingService, MatchingRequest, RoomResult, GenderMetrics, PendingChangesResponse, DiffEntry } from '../services/matching.service';
import { StudentService } from '../services/student.service';
import { Dorm } from 'src/shared/models/student.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-matching-dashboard',
  templateUrl: './matching-dashboard.component.html',
  styleUrls: ['./matching-dashboard.component.scss']
})
export class MatchingDashboardComponent implements OnInit {
  selectedMethod: 'random' | 'greedy' | 'greedy+hc' | 'greedy+sa' = 'greedy+hc';
  seed = 42;
  selectedSource: 'csv' | 'db' = 'csv';
  selectedDormId: number | null = null;
  dorms: Dorm[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  rooms: RoomResult[] = [];
  metrics: GenderMetrics[] = [];
  lastSeed: number | null = null;
  lastRunWaitlistedCount: number | null = null;
  genderFilter: 'all' | 'female' | 'male' | 'mixed' = 'all';

  pendingChanges: PendingChangesResponse | null = null;
  isReoptimizing = false;
  reoptimizeDiff: DiffEntry[] | null = null;
  reoptimizeSummary: { oldRunId: string; newRunId: string; moved: number; waitlisted: number } | null = null;
  diffFilter: 'all' | 'moved' | 'newly_placed' | 'waitlisted' = 'all';

  readonly methods = [
    { value: 'random', label: 'Random Assignment' },
    { value: 'greedy', label: 'Greedy Algorithm' },
    { value: 'greedy+hc', label: 'Greedy + Hill Climbing' },
    { value: 'greedy+sa', label: 'Greedy + Simulated Annealing' }
  ];

  constructor(
    private matchingService: MatchingService,
    private studentService: StudentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadResults();
    this.studentService.getDorms().subscribe({
      next: (response) => this.dorms = response.dorms,
      error: (error) => console.error('Error fetching dorms', error)
    });
    this.loadPendingChanges();
  }

  onSourceOrDormChange(): void {
    this.loadPendingChanges();
  }

  loadPendingChanges(): void {
    if (this.selectedSource !== 'db') {
      this.pendingChanges = null;
      return;
    }
    this.matchingService.getPendingChanges(this.selectedDormId).subscribe({
      next: (response) => this.pendingChanges = response,
      error: (error) => {
        this.pendingChanges = null;
        if (error?.status !== 404) {
          console.error('Error loading pending changes', error);
        }
      }
    });
  }

  reoptimize(): void {
    if (this.isReoptimizing || !this.pendingChanges) return;

    this.isReoptimizing = true;
    this.errorMessage = null;
    this.matchingService.reoptimize(this.selectedDormId, this.selectedMethod === 'greedy+sa' ? 'greedy+sa' : 'greedy+hc', this.seed).subscribe({
      next: (response) => {
        this.isReoptimizing = false;
        this.reoptimizeDiff = response.diff;
        this.reoptimizeSummary = {
          oldRunId: response.old_run_id, newRunId: response.new_run_id,
          moved: response.moved_count, waitlisted: response.waitlisted_count
        };
        this.metrics = response.metrics;
        this.loadResults();
        this.loadPendingChanges();
      },
      error: (error) => {
        console.error('Error re-optimizing:', error);
        this.errorMessage = error?.error?.error || 'Failed to re-optimize.';
        this.isReoptimizing = false;
      }
    });
  }

  get filteredDiff(): DiffEntry[] {
    if (!this.reoptimizeDiff) return [];
    if (this.diffFilter === 'all') return this.reoptimizeDiff;
    return this.reoptimizeDiff.filter(d => d.change === this.diffFilter);
  }

  get hasPendingChanges(): boolean {
    if (!this.pendingChanges) return false;
    return this.pendingChanges.rejected_count > 0
      || this.pendingChanges.new_arrival_count > 0
      || this.pendingChanges.still_waitlisted_count > 0
      || this.pendingChanges.unmet_bond_count > 0;
  }

  get wouldWipeConfirmations(): boolean {
    return this.selectedSource === 'db'
      && !!this.pendingChanges && this.pendingChanges.confirmed_count > 0;
  }

  runMatching(): void {
    if (this.isLoading) return;

    if (this.wouldWipeConfirmations) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '380px',
        data: {
          title: 'Overwrite confirmed rooms?',
          message: `This dorm already has ${this.pendingChanges!.confirmed_count} student(s) ` +
            `with a CONFIRMED room. "Run Matching" starts completely fresh and does not ` +
            `protect confirmed assignments -- it can move or separate them. If you just want ` +
            `to place rejections/new arrivals without disturbing confirmed students, use ` +
            `"Re-optimize" instead. Continue with a full fresh run anyway?`
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.doRunMatching();
        }
      });
    } else {
      this.doRunMatching();
    }
  }

  private doRunMatching(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const request: MatchingRequest = {
      method: this.selectedMethod,
      seed: this.seed,
      source: this.selectedSource
    };
    if (this.selectedSource === 'db' && this.selectedDormId) {
      request.dorm_id = this.selectedDormId;
    }

    this.matchingService.runMatching(request).subscribe({
      next: (response) => {
        this.lastSeed = response.seed;
        this.metrics = response.metrics;
        this.lastRunWaitlistedCount = response.waitlisted_count > 0 ? response.waitlisted_count : null;
        this.reoptimizeDiff = null;
        this.reoptimizeSummary = null;
        this.loadResults();
        this.loadPendingChanges();
      },
      error: (error) => {
        console.error('Error running matching:', error);
        this.errorMessage = error?.error?.error || 'Failed to run matching. Is the backend running?';
        this.isLoading = false;
      }
    });
  }

  loadResults(): void {
    this.matchingService.getResults().subscribe({
      next: (data) => {
        this.rooms = data.rooms;
        this.isLoading = false;
      },
      error: (error) => {
        if (error?.status !== 404) {
          console.error('Error loading results:', error);
          this.errorMessage = error?.error?.error || 'Failed to load results.';
        }
        this.isLoading = false;
      }
    });
  }

  get filteredRooms(): RoomResult[] {
    if (this.genderFilter === 'all') return this.rooms;
    return this.rooms.filter(r => r.gender === this.genderFilter);
  }

  getScoreClass(score: number | null): string {
    if (score === null) return 'score-exception';
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-good';
    if (score >= 0.7) return 'score-fair';
    return 'score-poor';
  }

  getScoreColor(score: number | null): string {
    if (score === null) return '#9e9e9e';
    if (score >= 0.9) return '#4caf50';
    if (score >= 0.8) return '#ffc107';
    if (score >= 0.7) return '#ff9800';
    return '#f44336';
  }

  formatScore(score: number | null): string {
    return score === null ? '—' : (score * 100).toFixed(1);
  }
}

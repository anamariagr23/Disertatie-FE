import { Component, OnInit } from '@angular/core';
import { MatchingService, MatchingRequest, RoomResult, GenderMetrics } from '../services/matching.service';
import { StudentService } from '../services/student.service';
import { Dorm } from 'src/shared/models/student.interface';

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
  genderFilter: 'all' | 'female' | 'male' = 'all';

  readonly methods = [
    { value: 'random', label: 'Random Assignment' },
    { value: 'greedy', label: 'Greedy Algorithm' },
    { value: 'greedy+hc', label: 'Greedy + Hill Climbing' },
    { value: 'greedy+sa', label: 'Greedy + Simulated Annealing' }
  ];

  constructor(private matchingService: MatchingService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadResults();
    this.studentService.getDorms().subscribe({
      next: (response) => this.dorms = response.dorms,
      error: (error) => console.error('Error fetching dorms', error)
    });
  }

  runMatching(): void {
    if (this.isLoading) return;

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
        this.loadResults();
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

  getScoreClass(score: number): string {
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-good';
    if (score >= 0.7) return 'score-fair';
    return 'score-poor';
  }

  getScoreColor(score: number): string {
    if (score >= 0.9) return '#4caf50';
    if (score >= 0.8) return '#ffc107';
    if (score >= 0.7) return '#ff9800';
    return '#f44336';
  }

  formatScore(score: number): string {
    return (score * 100).toFixed(1);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class Analytics implements OnInit {

  apiUrl = 'http://localhost/myapis/getAnalytics.php';

  electionTitle = '';
  analyticsData: any = {};
  loading = true;
  error = '';

  winners: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.electionTitle = res.active_election_title;
          this.analyticsData = res.data;
          this.calculateWinners();
        } else {
          this.error = 'Failed to load analytics';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Server error occurred';
        this.loading = false;
      }
    });
  }

  calculateWinners() {
    this.winners = [];

    Object.keys(this.analyticsData).forEach(key => {
      const candidates = this.analyticsData[key];
      if (!candidates || candidates.length === 0) return;

      const winner = candidates.reduce((max: any, curr: any) =>
        curr.vote_count > max.vote_count ? curr : max
      );

      this.winners.push({
        position: winner.position_name,
        candidate: winner.candidate_name,
        votes: winner.vote_count
      });
    });
  }

  getPositionKeys() {
    return Object.keys(this.analyticsData);
  }
}

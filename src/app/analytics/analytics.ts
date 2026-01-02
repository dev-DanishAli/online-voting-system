import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ElectionService } from '../services/election';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {

  chartsData: { positionName: string, chartConfig: ChartConfiguration<'bar'> }[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  electionId: string = '9';

  constructor(private http: HttpClient, private electionService: ElectionService) {}

  ngOnInit() {
    // Call the new function to load active election
    // this.loadActiveElection();
     this.fetchAnalytics(9);
  }

  // New function to fetch the active election
  private loadActiveElection() {
    this.electionService.getActiveElectionId().subscribe({
      next: (res: any) => {
        console.log('Active Election API Response:', res); // DEBUG

        if (res && res.status === 'active' && res.election_id) {
          this.electionId = res.election_id;
          console.log('Active Election ID:', this.electionId);

          // Call fetchAnalytics for this election
          this.fetchAnalytics(9);
        } else {
          this.loading = false;
          this.errorMessage = 'No active election found.';
        }
      },
      error: (err) => {
        console.error('Failed to fetch active election:', err);
        this.loading = false;
        this.errorMessage = 'Failed to fetch active election.';
      }
    });
  }

  // Fetch analytics data for a given election
  private fetchAnalytics(electionId: number) {
    this.http.get<any>(`http://localhost/myapis/getAnalytics.php?election_id=${electionId}`)
      .subscribe({
        next: (data) => {
          console.log('Analytics API response:', data); // DEBUG
          const analytics = data.data;

          if (!analytics || Object.keys(analytics).length === 0) {
            this.loading = false;
            this.errorMessage = 'No analytics data available for this election.';
            return;
          }

          for (const position in analytics) {
            if (analytics[position].length > 0) {
              const sortedCandidates: any[] = analytics[position]
                .sort((a: any, b: any) => b.vote_count - a.vote_count);

              const labels = sortedCandidates.map((c: any) => c.candidate_name);
              const votes = sortedCandidates.map((c: any) => c.vote_count);

              const backgroundColors = labels.map(() => this.getRandomColor());
              const borderColors = backgroundColors.map(c => c.replace('0.6', '1'));

              const chartConfig: ChartConfiguration<'bar'> = {
                type: 'bar',
                data: {
                  labels,
                  datasets: [{
                    label: 'Votes',
                    data: votes,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { ticks: { autoSkip: false } }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `Votes: ${ctx.raw}` } }
                  }
                }
              };

              this.chartsData.push({
                positionName: sortedCandidates[0].position_name,
                chartConfig
              });
            }
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch analytics data:', err);
          this.loading = false;
          this.errorMessage = 'Failed to fetch analytics data.';
        }
      });
  }

  // Random color generator for charts
  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 200 + 30);
    const g = Math.floor(Math.random() * 200 + 30);
    const b = Math.floor(Math.random() * 200 + 30);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  }
}

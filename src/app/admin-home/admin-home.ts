import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.css'],
})
export class AdminHome implements OnInit {

  totalCandidates: number = 0;
  totalRegisteredStudents: number = 0;
  votesCast: number = 0;
  ongoingElection: any = null;
  completedElections: number = 0;

  topCandidates: any[] = [];
  activeDepartments: string[] = [];

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AdminHome initialized');

    this.http
      .get<any>('http://localhost/myapis/dashboardStats.php')
      .subscribe({
        next: (res) => {
          this.totalCandidates = Number(res.total_candidates) || 0;
          this.totalRegisteredStudents = Number(res.reg_voters) || 0;
          this.votesCast = Number(res.casted_voters) || 0;
          this.completedElections = Number(res.ended_elections) || 0;

          // ongoing election (string → object to keep HTML unchanged)
          this.ongoingElection = res.ongoing_elections
            ? { name: res.ongoing_elections }
            : null;

          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching dashboard stats:', err);
        }
      });
  }

  get remainingVoters(): number {
    return this.totalRegisteredStudents - this.votesCast;
  }

  get votingProgress(): number {
    return this.totalRegisteredStudents
      ? (this.votesCast / this.totalRegisteredStudents) * 100
      : 0;
  }
}

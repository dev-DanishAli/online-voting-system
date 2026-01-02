import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard implements OnInit {

  voterName: string = '';
  electionId: number = 0; // Active election ID
  hasVoted: boolean = false; // Track if voter already voted
  loadingElection: boolean = true; // Track election loading status

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const voterId = localStorage.getItem('voter_id')?.trim();
    if (!voterId) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    // 1️⃣ Get voter info
    this.authService.getAllStudents().subscribe({
      next: (res: any) => {
        const students = Array.isArray(res) ? res : res?.students || [];
        const voter = students.find((s: any) =>
          String(s.reg_number).trim() === voterId
        );

        if (voter) {
          this.voterName = voter.name;
          this.cdr.detectChanges();
        } else {
          alert('Voter record not found. Please login again.');
          this.logout();
        }
      },
      error: err => {
        console.error('Error fetching students:', err);
        alert('Unable to load voter data.');
      }
    });

    // 2️⃣ Get active election ID
    this.http.get<any>('http://localhost/myapis/activeElection.php').subscribe({
      next: res => {
        this.electionId = res?.election_id || 0;
        this.loadingElection = false;

        if (this.electionId) {
          // 3️⃣ Check if voter has already voted
          this.checkIfVoted(voterId, this.electionId);
        }
      },
      error: err => {
        console.error('Error fetching active election:', err);
        this.loadingElection = false;
      }
    });
  }

  // Check if voter already voted
  checkIfVoted(voterId: string, electionId: number) {
    this.http.post<any>(
      'http://localhost/myapis/check_vote.php',
      { voter_id: voterId, election_id: electionId },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: res => {
        if (res.status === 409) {
          this.hasVoted = true;
          alert(res.message || 'You have already cast your vote.');
        } else if (res.status === 200) {
          this.hasVoted = false;
        } else {
          console.warn('Unable to determine vote status.');
        }
      },
      error: err => {
        console.error(err);
        alert('Server error while checking vote status.');
      }
    });
  }

  castVote() {
    if (this.loadingElection) {
      alert('Election is still loading. Please wait.');
      return;
    }

    if (!this.electionId) {
      alert('No active election found.');
      return;
    }

    if (this.hasVoted) {
      alert('You have already voted in this election.');
      return;
    }

    this.router.navigate(['/cast-vote']);
  }

  viewCandidates() {
    this.router.navigate(['/candidates']);
  }

  logout() {
    localStorage.removeItem('voter_id');
    this.router.navigate(['/login']);
  }
}

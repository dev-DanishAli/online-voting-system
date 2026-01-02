import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';

interface Candidate {
  candidate_id: string;
  name: string;
  email?: string;
  cnic_number?: string;
  dept?: string;
  semester?: string;
  position?: string;
  votes?: number;
  election_sign?: string;
  sign_url?: string;
}

@Component({
  selector: 'app-view-candidates',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './view-candidates.html',
  styleUrls: ['./view-candidates.css']
})
export class ViewCandidates implements OnInit {

  @Input() isAdmin: boolean = true;
  electionId!: number; // ✅ election id from route
  groupedCandidates$!: Observable<{ position: string; list: Candidate[] }[]>;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Read electionId from route params or query params
    // Option 1: Route param
    this.electionId = Number(this.route.snapshot.paramMap.get('electionId'));

    // Option 2 (if using query params instead):
    // this.route.queryParams.subscribe(params => {
    //   this.electionId = Number(params['electionId']);
    // });

    this.loadCandidates();
  }

  loadCandidates(): void {
    if (!this.electionId) return; // safety check

    this.groupedCandidates$ = this.candidateService.getCandidates(this.electionId).pipe(
      map((res: any) => {
        const candidates: Candidate[] = Array.isArray(res?.candidates) ? res.candidates : [];

        const mapped: Candidate[] = candidates.map((c: Candidate) => ({
          candidate_id: c.candidate_id,
          name: c.name,
          email: c.email,
          cnic_number: c.cnic_number,
          dept: c.dept || c.dept,
          semester: c.semester,
          position: c.position || 'Other',
          votes: c.votes,
          election_sign: c.election_sign,
          sign_url: c.election_sign ? `data:image/png;base64,${c.election_sign}` : ''
        }));

        const positionOrder: string[] = ['President','Vice President','General Secretary','Representatives'];

        const grouped: Record<string, Candidate[]> = {};
        mapped.forEach(c => {
          const pos = c.position || 'Other';
          grouped[pos] = grouped[pos] || [];
          grouped[pos].push(c);
        });

        const sortedPositions: string[] = Object.keys(grouped).sort((a,b)=>{
          const indexA = positionOrder.indexOf(a);
          const indexB = positionOrder.indexOf(b);
          if(indexA === -1 && indexB === -1) return a.localeCompare(b);
          if(indexA === -1) return 1;
          if(indexB === -1) return -1;
          return indexA - indexB;
        });

        return sortedPositions.map(position => ({
          position,
          list: grouped[position]
        }));
      })
    );
  }

  deleteCandidate(candidateId: string): void {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this candidate?')) return;

    this.candidateService.deleteCandidate(candidateId).subscribe({
      next: () => {
        alert('Candidate deleted successfully');
        this.loadCandidates();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete candidate');
      }
    });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateService } from '../services/candidate';
import { ElectionService } from '../services/election';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Candidate {
  candidate_id: number;
  name: string;
  dept: string;
  semester: number;
  position: string;
  election_sign: string;
}

@Component({
  selector: 'app-cast-vote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cast-vote.html',
  styleUrls: ['./cast-vote.css']
})
export class CastVoteComponent implements OnInit {

  currentStep = 0;
  votingForm!: FormGroup;

  candidates: Candidate[] = [];
  groupedCandidates: Record<string, Candidate[]> = {};
  selectedVotes: Record<string, number> = {};

  electionId = 0;
  hasActiveElection = false;
  loading = true;

  positions = [
    { key: 'president', label: 'President' },
    { key: 'vicePresident', label: 'Vice President' },
    { key: 'generalSecretary', label: 'General Secretary' },
    { key: 'csRep', label: 'CS Representative' },
    { key: 'bbaRep', label: 'BBA Representative' },
    { key: 'afRep', label: 'A&F Representative' },
    { key: 'seRep', label: 'SE Representative' }
  ];

  // DB column mapping
  positionToColumn: Record<string, string> = {
    'President': 'pres_id',
    'Vice President': 'vp_id',
    'General Secretary': 'gs_id',
    'CS Representative': 'cs_rep',
    'BBA Representative': 'bba_rep',
    'A&F Representative': 'asaf_rep',
    'SE Representative': 'se_rep'
  };

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const voterId = localStorage.getItem('voter_id');
    if (!voterId) {
      alert('You must be logged in to vote!');
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.getActiveElectionId();
  }

  initForm() {
    const controls: any = {};
    this.positions.forEach(pos => {
      controls[pos.key] = ['', Validators.required];
    });
    this.votingForm = this.fb.group(controls);
  }

  getActiveElectionId() {
    this.loading = true;
    this.electionService.getActiveElectionId().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.electionId = res?.election_id || 0;
        this.hasActiveElection = !!this.electionId;
        if (this.hasActiveElection) {
          this.getCandidates();
        }
      },
      error: err => {
        this.loading = false;
        this.hasActiveElection = false;
        console.error(err);
      }
    });
  }

  getCandidates() {
    this.candidateService.getCandidates(this.electionId).subscribe({
      next: (res: any) => {
        if (res?.status === 200 && Array.isArray(res.candidates)) { 
          this.candidates = res.candidates.map((c: any) => ({
            candidate_id: Number(c.candidate_id),
            name: c.name,
            dept: c.department || '',
            semester: Number(c.semester),
            position: c.position?.trim(),
            election_sign: c.election_sign
          }));
        }
        this.groupCandidates();
        this.cd.detectChanges();
      },
      error: err => {
        console.error(err);
        this.groupCandidates();
      }
    });
  }

  groupCandidates() {
    this.groupedCandidates = {};
    this.positions.forEach(pos => {
      this.groupedCandidates[pos.label] =
        this.candidates.filter(c => c.position === pos.label);
    });
  }

  selectVote(positionLabel: string, candidateId: number) {
    this.selectedVotes[positionLabel] = candidateId;

    const patch: any = {};
    this.positions.forEach(pos => {
      patch[pos.key] = this.selectedVotes[pos.label] || '';
    });

    this.votingForm.patchValue(patch);
  }

  nextStep() {
    if (this.currentStep < this.positions.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isFormComplete(): boolean {
    return this.positions.every(pos => !!this.selectedVotes[pos.label]);
  }

  submitVote() {
    const voterId = localStorage.getItem('voter_id'); 
    if (!voterId) {
      alert('You must be logged in to vote!');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isFormComplete()) {
      alert('Please vote for all positions.');
      return;
    }

    if (!this.electionId) {
      alert('No active election found!');
      return;
    }

    const payload: any = {
      voter_id: voterId,
      election_id: this.electionId
    };

    Object.keys(this.selectedVotes).forEach(position => {
      const column = this.positionToColumn[position];
      if (column) {
        payload[column] = this.selectedVotes[position];
      }
    });

    this.http.post<any>(
      'http://localhost/myapis/cast_vote.php',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: res => {
        if (res?.status === 200) {
          alert('Vote submitted successfully!');
          this.resetForm();
          this.router.navigate(['/']);
        } else {
          alert(res?.message || 'Vote submission failed');
        }
      },
      error: err => {
        console.error(err);
        alert('Server error while submitting vote');
      }
    });
  }

  resetForm() {
    this.currentStep = 0;
    this.selectedVotes = {};
    this.votingForm.reset();
  }

  getImage(base64: string) {
    return base64
      ? `data:image/png;base64,${base64}`
      : 'https://via.placeholder.com/150';
  }
}

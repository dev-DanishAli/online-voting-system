import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate';
import { ElectionService } from '../services/election';

@Component({
  selector: 'app-add-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-candidates.html',
  styleUrls: ['./add-candidates.css']
})
export class AddCandidates implements OnInit {

  candidate: any = this.getEmptyCandidate();
  elections: any[] = [];
  departments: any[] = [];
  positions: any[] = [];
  message = '';

  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService
  ) {}

  ngOnInit() {
    this.loadElections();
    this.getDepartments();
    this.getPositions();
  }

  loadElections() {
    this.electionService.getElections().subscribe(res => {
      this.elections = res.elections || res;
    });
  }

  getDepartments() {
    this.candidateService.getDepartments().subscribe(res => {
      if (res?.status === 200) {
        this.departments = res.departments;
      }
    });
  }

  getPositions() {
    this.candidateService.getPositions().subscribe(res => {
      if (res?.status === 200) {
        this.positions = res.positions;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.candidate.election_sign = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  submitCandidate(form: NgForm) {
    if (!this.candidate.dept_name || !this.candidate.position_name) {
      this.message = 'Department and Position are required';
      return;
    }

    this.candidateService.addCandidate(this.candidate).subscribe({
      next: res => {
        this.message = res.message || 'Candidate added successfully';
        form.resetForm();
        this.candidate = this.getEmptyCandidate();
        this.imagePreview = null;
        this.fileInput.nativeElement.value = '';
      },
      error: () => {
        this.message = 'Error adding candidate';
      }
    });
  }

getEmptyCandidate() {
  return {
    candidate_id: this.generateRandomId(),
    name: '',
    email: '',
    cnic_number: '',
    dept_name: '',
    semester: '',
    position_name: '',
    election_id: '',
    election_sign: null
  };
}

generateRandomId(): number {
  return Math.floor(10000 + Math.random() * 90000);
}
}

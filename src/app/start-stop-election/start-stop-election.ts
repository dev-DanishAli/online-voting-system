import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../services/election';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-start-stop-election',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './start-stop-election.html',
  styleUrls: ['./start-stop-election.css']
})
export class StartStopElection implements OnInit {

  elections: any[] = [];
  showModal = false;
  showDeleteModal = false;
  showStatusModal = false;

  electionIdtoDelete = 0;
  currentElection: any = null;
  statusAction: string = '';

  electionData = {
    title: '',
    status: 'pending',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  constructor(private electionsService: ElectionService, private router: Router) {}

  ngOnInit() {
    this.getElections();
  }

  // GET
  getElections() {
    this.electionsService.getElections().subscribe((res: any) => {
      this.elections = res.elections || [];
    });
  }

  // ======= STATUS MODAL HANDLERS =======
  confirmStatusAction(election: any) {
    this.currentElection = election;
    this.statusAction = election.status === 'pending' ? 'start' : 'stop';
    this.showStatusModal = true;
  }

  cancelStatus() {
    this.showStatusModal = false;
    this.currentElection = null;
  }

  confirmStatus() {
    if (!this.currentElection) return;

    const newStatus = this.statusAction === 'start' ? 'active' : 'ended';

    this.electionsService.updateStatus(this.currentElection.election_id, newStatus)
      .subscribe({
        next: (res: any) => {
          if (res.success) this.currentElection.status = newStatus;
          else alert('Failed to update status');
        },
        error: () => alert('Server error during update'),
        complete: () => {
          this.showStatusModal = false;
          this.currentElection = null;
        }
      });
  }

  // ======= DELETE HANDLERS =======
  deleteElection(election: any) {
    this.currentElection = election;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.currentElection) return;

    this.electionsService.deleteElection(this.currentElection.election_id)
      .subscribe({
        next: () => {
          this.elections = this.elections.filter(
            e => e.election_id !== this.currentElection.election_id
          );
        },
        error: () => alert('Failed to delete election'),
        complete: () => {
          this.showDeleteModal = false;
          this.currentElection = null;
        }
      });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.currentElection = null;
  }

  // ADD ELECTION
  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }

  postElection(form: NgForm) {
    if (form.invalid) return;
    this.electionsService.postElection(form.value).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.getElections();
          this.closeModal();
          form.resetForm();
        }
      },
      error: () => alert('Failed to add election')
    });
  }

  // OTHER ACTIONS
  updateElection(election: any) { console.log('Update election:', election); }
  deleteAllElections() { console.log('Delete all elections clicked'); }
  viewCandidates(electionId: number) { this.router.navigate(['/admin-dashboard/candidates', electionId]); }
}

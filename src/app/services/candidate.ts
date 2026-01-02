import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private apiUrl = 'http://localhost/myapis/candidates.php';

  constructor(private http: HttpClient) {}

  // GET → All candidates
  getCandidates(electionId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?electionId=${electionId}`);
  }

  // POST → Add candidate
  addCandidate(candidate: any): Observable<any> {
    const formData = new FormData();

    formData.append('candidate_id', candidate.candidate_id);
    formData.append('name', candidate.name);
    formData.append('email', candidate.email);
    formData.append('cnic_number', candidate.cnic_number);
    formData.append('dept_name', candidate.dept_name);          // ✅ FIXED
    formData.append('semester', candidate.semester);
    formData.append('position_name', candidate.position_name);  // ✅ FIXED
    formData.append('election_id', candidate.election_id);

    if (candidate.election_sign instanceof File) {
      formData.append(
        'election_sign',
        candidate.election_sign,
        candidate.election_sign.name
      );
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  // DELETE → Candidate
  deleteCandidate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }

  // PUT → Update candidate
  updateCandidate(id: string, candidate: any): Observable<any> {
    const formData = new FormData();

    formData.append('candidate_id', candidate.candidate_id);
    formData.append('name', candidate.name);
    formData.append('email', candidate.email);
    formData.append('cnic_number', candidate.cnic_number);
    formData.append('dept_name', candidate.dept_name);          // ✅ FIXED
    formData.append('semester', candidate.semester);
    formData.append('position_name', candidate.position_name);  // ✅ FIXED
    formData.append('election_id', candidate.election_id);

    if (candidate.election_sign instanceof File) {
      formData.append(
        'election_sign',
        candidate.election_sign,
        candidate.election_sign.name
      );
    }

    return this.http.put<any>(`${this.apiUrl}?id=${id}`, formData);
  }

  // ---------------- FORM DATA APIs ----------------

  private deptUrl = 'http://localhost/myapis/departments.php';

  getDepartments(): Observable<any> {
    return this.http.get<any>(this.deptUrl);
  }

  private posUrl = 'http://localhost/myapis/positions.php';

  getPositions(): Observable<any> {
    return this.http.get<any>(this.posUrl);
  }
}

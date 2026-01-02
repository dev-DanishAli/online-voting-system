import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoterService {

  private apiUrl = 'http://localhost/myapis/voters.php';

  constructor(private http: HttpClient) {}

   getVoters(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

   // Cast vote
  castVote(payload: { voter_id: string; votes: { [key: string]: string }; voted_at: string }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}

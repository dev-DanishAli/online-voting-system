import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private apiUrl = 'http://localhost/myapis/votes.php';

  constructor(private http: HttpClient) {}

  castVote(payload: { voter_id: string, votes: { [position: string]: string } }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}

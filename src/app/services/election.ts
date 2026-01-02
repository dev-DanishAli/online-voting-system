import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  private electionsUrl = 'http://localhost/myapis/elections.php';

  constructor(private http: HttpClient) {}

  getElections(): Observable<any> {
    return this.http.get<any>(this.electionsUrl);
  }

  getElectionStatus(id:number){
    return this.http.get<any>(`${this.electionsUrl}/${id}`);
  }

  getActiveElectionId(){
    return this.http.get<any>('http://localhost/myapis/activeElection.php');
  }

  updateStatus(id: number, status: string) {
  const body = {
    id: id,
    status: status
  };

  return this.http.put<any>(
    'http://localhost/myapis/electionStatus.php',
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );
}

  postElection(data:any){
    return this.http.post(this.electionsUrl,data);
  }

  deleteElection(id: number): Observable<any> {
  return this.http.delete<any>(`${this.electionsUrl}?id=${id}`);
}



}

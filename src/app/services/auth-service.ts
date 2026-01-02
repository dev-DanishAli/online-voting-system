import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "http://localhost/myapis/studentsInfo.php";

  constructor(private http: HttpClient) {}

  loginUser(regNumber: string): Observable<boolean> {
    return this.http.get<any>(this.url).pipe(
      map(response => {
        const students = response.studentsdata;
        const found = students.find((s: any) => s.reg_number == regNumber);
        return found ? true : false;
      }),
      catchError(err => {
        console.error("API ERROR:", err);
        return of(false);
      })
    );
  }

  loginAdmin(username: string, password: string): boolean {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    return username.trim() === adminUsername && password.trim() === adminPassword;
  }

  getAllStudents(): Observable<any[]> {
  return this.http.get<any>(this.url).pipe(
    map(response => {
      console.log('Full API response:', response);
      return response?.studentsdata ?? [];
    }),
    catchError(error => {
      console.error('Students API error:', error);
      return of([]);
    })
  );
}
}

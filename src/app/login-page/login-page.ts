import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage implements OnInit {

  regNumber: string = '';
  username: string = '';
  password: string = '';
  isAdminRoute: boolean = false;
  errorMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdminRoute = this.route.snapshot.routeConfig?.path === 'admin';
  }

  login() {
    this.errorMsg = '';
    this.cd.detectChanges();

    /* ===== ADMIN LOGIN (UNCHANGED) ===== */
    if (this.isAdminRoute) {
      const username = this.username.trim();
      const password = this.password.trim();

      if (!username || !password) {
        this.showError('Username and password are required');
        return;
      }

      if (this.authService.loginAdmin(username, password)) {
        this.router.navigate(['admin-dashboard']);
      } else {
        this.showError('Invalid admin credentials');
      }
      return;
    }

    /* ===== USER LOGIN ===== */
    const reg = this.regNumber.trim();
    if (!reg) {
      this.showError('Please enter a registration number');
      return;
    }

    this.authService.loginUser(reg).subscribe({
      next: (isValid) => {
        if (isValid) {
          // ✅ FIX: store regNumber AS voter_id
          localStorage.setItem('voter_id', reg);

          this.router.navigate(['user']);
        } else {
          this.showError('Registration number not found');
        }
      },
      error: () => {
        this.showError('Server error, please try again');
      }
    });
  }

  private showError(message: string) {
    this.errorMsg = message;
    this.cd.detectChanges();

    setTimeout(() => {
      this.errorMsg = '';
      this.cd.detectChanges();
    }, 1500);
  }
}

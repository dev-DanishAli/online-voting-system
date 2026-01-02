import { Routes } from "@angular/router";
import { LoginPage } from "./login-page/login-page";
import { UserDashboard } from "./user-dashboard/user-dashboard";
import { AdminDashboard } from "./admin-dashboard/admin-dashboard";
import { AdminHome } from "./admin-home/admin-home";
import { AddCandidates } from "./add-candidates/add-candidates";
import { Analytics } from "./analytics/analytics";
import { ViewCandidates } from "./view-candidates/view-candidates";
import { StartStopElection } from "./start-stop-election/start-stop-election";
import { ElectionHistory } from "./election-history/election-history";
import { CastVoteComponent } from "./cast-vote/cast-vote";

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'user', component: UserDashboard },
  { path: 'admin', component: LoginPage },
  { path: 'cast-vote', component: CastVoteComponent },
  { path: 'candidates', component: ViewCandidates },

  // ADMIN DASHBOARD WITH CHILD ROUTES
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminHome },
      { path: 'add-candidate', component: AddCandidates },
      { path: 'analytics', component: Analytics },
      { path: 'candidates/:electionId', component: ViewCandidates },
      { path: 'start-election', component: StartStopElection },
      { path: 'history', component: ElectionHistory }
    ]
  },

  { path: '**', redirectTo: '' } //Ya Jaega Login Ka Pas
];

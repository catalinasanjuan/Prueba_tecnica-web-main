import "reflect-metadata";
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './app/components/login/login.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { UserFormComponent } from './app/components/user-form/user-form.component';
import { AuthGuard } from './app/guards/auth.guard';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: 'login', component: LoginComponent },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users/new',
        component: UserFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users/edit/:id',
        component: UserFormComponent,
        canActivate: [AuthGuard]
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ])
  ]
}).catch(err => console.error(err));
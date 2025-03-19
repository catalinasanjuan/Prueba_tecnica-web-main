import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <h1>User Management</h1>
      
      <!-- Search -->
      <div class="search-container">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="onSearch()"
          placeholder="Search users..."
          class="search-input"
        />
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  [checked]="areAllSelected()" 
                  (change)="toggleAllSelection()"
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of displayedUsers">
              <td>
                <input 
                  type="checkbox" 
                  [checked]="selectedUsers.includes(user.id)"
                  (change)="toggleSelection(user.id)"
                />
              </td>
              <td>{{user.firstName}} {{user.lastName}}</td>
              <td>{{user.email}}</td>
              <td>{{user.role}}</td>
              <td>
                <button (click)="editUser(user)" class="btn-edit">Edit</button>
                <button (click)="deleteUser(user.id)" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button 
          [disabled]="currentPage === 1" 
          (click)="changePage(currentPage - 1)"
        >Previous</button>
        <span>Page {{currentPage}} of {{totalPages}}</span>
        <button 
          [disabled]="currentPage === totalPages" 
          (click)="changePage(currentPage + 1)"
        >Next</button>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions" *ngIf="selectedUsers.length > 0">
        <button (click)="deleteSelectedUsers()" class="btn-delete">
          Delete Selected ({{selectedUsers.length}})
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-container {
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f5f5f5;
    }

    .btn-edit, .btn-delete {
      padding: 0.25rem 0.5rem;
      margin: 0 0.25rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-edit {
      background-color: #007bff;
      color: white;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background-color: white;
      cursor: pointer;
    }

    .pagination button:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .bulk-actions {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = [];
  selectedUsers: number[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.users];
    
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = filtered.slice(start, end);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  toggleSelection(userId: number) {
    const index = this.selectedUsers.indexOf(userId);
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  areAllSelected(): boolean {
    return this.displayedUsers.length > 0 && 
           this.displayedUsers.every(user => this.selectedUsers.includes(user.id));
  }

  toggleAllSelection() {
    if (this.areAllSelected()) {
      this.selectedUsers = this.selectedUsers.filter(id => 
        !this.displayedUsers.some(user => user.id === id)
      );
    } else {
      this.displayedUsers.forEach(user => {
        if (!this.selectedUsers.includes(user.id)) {
          this.selectedUsers.push(user.id);
        }
      });
    }
  }

  editUser(user: User) {
    // Navigate to edit page
    // This will be implemented in the next step
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
        this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
      });
    }
  }

  deleteSelectedUsers() {
    if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`)) {
      // We'll implement batch delete in the next step
      Promise.all(
        this.selectedUsers.map(id => this.userService.deleteUser(id).toPromise())
      ).then(() => {
        this.loadUsers();
        this.selectedUsers = [];
      });
    }
  }
}
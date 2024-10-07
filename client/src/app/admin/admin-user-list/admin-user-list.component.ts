import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [FormsModule, PaginationModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit{
  adminService = inject(AdminService);
  toastrService = inject(ToastrService);
  roleList = [
    {value: 'all', display: 'Wszyscy'}, 
    {value: 'user', display: 'Użytkownicy'},
    {value: 'moderator', display: 'Moderatorzy'}, 
    {value: 'admin', display: 'Administratorzy'}
  ];

  ngOnInit(): void {
    if (!this.adminService.paginatedResultUser()) this.loadUsers();
  }

  loadUsers(){
    this.adminService.getUsers();
  }

  editUser(username: string, role: string){
    this.adminService.editUser(username, role).subscribe({
      next: _ => {},
      error: error => this.toastrService.error(error.error)
    })
  }

  resetFilters(){
    this.adminService.resetUserParams();
    this.loadUsers();
  }

  pageChanged(event: any){
    if (this.adminService.userParams().pageNumber != event.page){
      this.adminService.userParams().pageNumber = event.page;
      this.loadUsers();
    }
  }
}

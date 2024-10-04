import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [RouterLink, FormsModule, PaginationModule],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css'
})
export class AdminGroupsComponent implements OnInit{
  adminService = inject(AdminService);
  private router = inject(Router);
  orderByList = [
    {value: 'oldest', display: 'Najstarsze'}, 
    {value: 'newest', display: 'Najnowsze'},
    {value: 'members', display: 'Członkowie rosnąco'}, 
    {value: 'membersDesc', display: 'Członkowie malejąco'}
  ];

  ngOnInit(): void {
    if (!this.adminService.paginatedResult()) this.loadGroups();
  }

  loadGroups(){
    this.adminService.getGroups();
  }

  deleteGroup(groupId: number){
    this.adminService.deleteGroup(groupId);
  }

  resetFilters(){
    this.adminService.resetGroupParams();
    this.loadGroups();
  }

  pageChanged(event: any){
    if (this.adminService.groupParams().pageNumber != event.page){
      this.adminService.groupParams().pageNumber = event.page;
      this.loadGroups();
    }
  }
}

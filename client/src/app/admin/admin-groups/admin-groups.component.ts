import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [RouterLink, FormsModule, PaginationModule, TooltipModule],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css'
})
export class AdminGroupsComponent implements OnInit{
  adminService = inject(AdminService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);
  orderByList = [
    {value: 'oldest', display: 'Najstarsze'}, 
    {value: 'newest', display: 'Najnowsze'},
    {value: 'members', display: 'Członkowie rosnąco'}, 
    {value: 'membersDesc', display: 'Członkowie malejąco'}
  ];

  ngOnInit(): void {
    if (!this.adminService.paginatedResultGroup()) this.loadGroups();
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

  addTimersForAll(){
    this.adminService.addTimersForAll().subscribe({
      next: () => this.toastrService.success("Dodano timery dla wszystkich grup"),
      error: error => this.toastrService.error(error.error)
    })
  }

  deleteTimersForAll(){
    this.adminService.deleteTimersForAll().subscribe({
      next: () => this.toastrService.success("Usunięto timery dla wszystkich grup"),
      error: error => this.toastrService.error(error.error)
    })
  }

  addTimersForGroup(groupId: number){
    this.adminService.addTimersForGroup(groupId).subscribe({
      next: () => this.toastrService.success("Dodano timery dla grupy"),
      error: error => this.toastrService.error(error.error)
    })
  }

  deleteTimersForGroup(groupId: number){
    this.adminService.deleteTimersForGroup(groupId).subscribe({
      next: () => this.toastrService.success("Usunięto timery dla grupy"),
      error: error => this.toastrService.error(error.error)
    })
  }
}

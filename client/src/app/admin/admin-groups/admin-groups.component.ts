import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css'
})
export class AdminGroupsComponent implements OnInit{
  adminService = inject(AdminService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.adminService.groups().length == 0) this.loadGroups();
  }

  loadGroups(){
    this.adminService.getGroups();
  }

  deleteGroup(groupId: number){
    this.adminService.deleteGroup(groupId);
  }
}

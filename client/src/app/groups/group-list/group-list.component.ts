import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../_services/group.service';
import { Group } from '../../_models/group';
import { Router, RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit{
  groupService = inject(GroupService);
  orderByList = [
    {value: 'oldest', display: 'Najstarsze'}, 
    {value: 'newest', display: 'Najnowsze'},
    {value: 'members', display: 'Członkowie rosnąco'}, 
    {value: 'membersDesc', display: 'Członkowie malejąco'}
  ];

  ngOnInit(): void {
    if (!this.groupService.paginatedResult()) this.loadGroups();
  }

  loadGroups(){
    this.groupService.getGroups();
  }

  resetFilters(){
    this.groupService.resetGroupParams();
    this.loadGroups();
  }

  pageChanged(event: any){
    if (this.groupService.groupParams().pageNumber != event.page){
      this.groupService.groupParams().pageNumber = event.page;
      this.loadGroups();
    }
  }
}

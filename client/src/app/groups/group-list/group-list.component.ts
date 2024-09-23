import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../_services/group.service';
import { Group } from '../../_models/group';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit{
  groupService = inject(GroupService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.groupService.groups().length == 0) this.loadGroups();
  }

  loadGroups(){
    this.groupService.getGroups();
  }
}

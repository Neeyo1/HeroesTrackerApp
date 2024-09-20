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
  private groupService = inject(GroupService);
  private router = inject(Router);
  groups: Group[] = [];

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(){
    this.groupService.getGroups().subscribe({
      next: groups => this.groups = groups
    })
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../_services/group.service';
import { Group } from '../../_models/group';

@Component({
  selector: 'app-group-timers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-timers.component.html',
  styleUrl: './group-timers.component.css'
})
export class GroupTimersComponent implements OnInit{
  private groupService = inject(GroupService);
  private route = inject(ActivatedRoute);
  group?: Group;

  ngOnInit(): void {
    this.loadGroup();
  }

  loadGroup(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.groupService.getGroup(groupId).subscribe({
      next: group => this.group = group
    })
  }
}
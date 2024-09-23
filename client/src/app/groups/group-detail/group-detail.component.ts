import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../_services/group.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from '../../_models/group';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css'
})
export class GroupDetailComponent implements OnInit{
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
      next: group => {
        this.group = group;
        //this.groupService.groupCache.set(`group-${group.id}`, group);
      }
    })
  }
}

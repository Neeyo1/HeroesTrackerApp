import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from '../../_models/group';
import { GroupService } from '../../_services/group.service';
import { GroupMember } from '../../_models/groupMember';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.css'
})
export class GroupMembersComponent implements OnInit{
  private accountService = inject(AccountService);
  private groupService = inject(GroupService);
  private route = inject(ActivatedRoute);
  group?: Group;
  groupMembers: GroupMember[] = [];
  role: string = "user";

  ngOnInit(): void {
    this.loadGroup();
    this.loadGroupMembers();
  }

  loadGroup(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.groupService.getGroup(groupId).subscribe({
      next: group => this.group = group
    })
  }

  loadGroupMembers(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.groupService.getGroupMembers(groupId).subscribe({
      next: groupMembers => {
        this.groupMembers = groupMembers;
        this.checkUserRole();
      }
    })
  }

  checkUserRole(){
    const user = this.groupMembers.find(x => x.username == this.accountService.currentUser()?.username);
    if (!user) return;
    if (user.username == this.group?.owner.username) this.role = "owner";
    if (user.isModerator == true) this.role = "moderator";
  }
}
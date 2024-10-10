import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from '../../_models/group';
import { GroupService } from '../../_services/group.service';
import { GroupMember } from '../../_models/groupMember';
import { AccountService } from '../../_services/account.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [RouterLink, FormsModule, TooltipModule],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.css'
})
export class GroupMembersComponent implements OnInit{
  accountService = inject(AccountService);
  private groupService = inject(GroupService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  group = signal<Group | null>(null);
  groupMembers = signal<GroupMember[]>([]);
  role: string = "user";
  model: any = {};

  ngOnInit(): void {
    this.loadGroup();
    //this.loadGroupMembers();
  }

  loadGroup(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.groupService.getGroup(groupId).subscribe({
      next: group => {
        this.group.set(group);
        this.groupMembers.set(this.group()!.members);
        //this.groupService.groupCache.set(`group-${group.id}`, group);
        this.checkUserRole();
      }
    })
  }

  // loadGroupMembers(){
  //   const groupId = Number(this.route.snapshot.paramMap.get("id"));
  //   if (!groupId) return;

  //   this.groupService.getGroup(groupId).subscribe({
  //     next: group => {
  //       this.groupMembers = group.members;
  //       this.checkUserRole();
  //     }
  //   });
  // }

  checkUserRole(){
    const user = this.groupMembers().find(x => x.username == this.accountService.currentUser()?.username);
    if (!user) return;
    if (user.username == this.group()?.owner.username) this.role = "owner";
    if (user.isModerator == true) this.role = "moderator";
  }

  addMember(){
    if (this.group() == null) return;
    if (this.groupMembers().find(x => x.username == this.model.username)){
      this.toastr.error("Użytkownik już jest w tej grupie");
      return;
    }
    this.groupService.addOrRemoveMember(this.model.username, this.group()!.id).subscribe({
      next: newMember => {
        if (newMember == null) return;
        this.toastr.success("Użytkownik dodany do grupy");
        const newGroupMember: GroupMember = {
          id: newMember.id,
          username: newMember.username,
          knownAs: newMember.knownAs,
          isModerator: false
        };
        var newGroup: Group = this.group()!;
        newGroup.members.push(newGroupMember);
        newGroup.membersCount++;
        this.group.set(newGroup);
        // if (this.groupService.groupCache.has(`group-${newGroup.id}`)){
        //   this.groupService.groupCache.set(`group-${newGroup.id}`, newGroup);
        // }
      },
      error: error => this.toastr.error(error.error)
    });
  }

  removeMember(username: string){
    if (this.group == null) return;
    if (!this.groupMembers().find(x => x.username == username)){
      this.toastr.error("Użytkownik nie należy do tej grupy");
      return;
    }
    this.groupService.addOrRemoveMember(username, this.group()!.id).subscribe({
      next: () => {
        this.toastr.success("Użytkownik usunięty z grupy");
        var newGroup: Group = this.group()!;
        newGroup.members = newGroup.members.filter(x => x.username != username);
        newGroup.membersCount--;
        this.group.set(newGroup);
        this.groupMembers.set(newGroup.members);
      },
      error: error => this.toastr.error(error.error)
    });
  }

  addModerator(username: string){
    if (this.group() == null) return;
    var editedMember = this.groupMembers().find(x => x.username == username);
    if (editedMember == null){
      this.toastr.error("Użytkownik nie należy do tej grupy");
      return;
    }
    if (editedMember.isModerator == true){
      this.toastr.error("Użytkownik już jest moderatorem");
      return;
    }
    this.groupService.addOrRemoveModerator(username, this.group()!.id, true).subscribe({
      next: () => {
        this.toastr.success("Użytkownik otrzymał rangę moderator");

        editedMember!.isModerator = true;

        var newGroup: Group = this.group()!;
        newGroup.members.forEach(x => x.username == username ? editedMember : x)
        this.group.set(newGroup);
      },
      error: error => this.toastr.error(error.error)
    });
  }

  removeModerator(username: string){
    if (this.group() == null) return;
    var editedMember = this.groupMembers().find(x => x.username == username);
    if (editedMember == null){
      this.toastr.error("Użytkownik nie należy do tej grupy");
      return;
    }
    if (editedMember.isModerator == false){
      this.toastr.error("Użytkownik nie jest moderatorem");
      return;
    }
    this.groupService.addOrRemoveModerator(username, this.group()!.id, false).subscribe({
      next: () => {
        this.toastr.success("Użytkownik utracił rangę moderator");

        editedMember!.isModerator = false;

        var newGroup: Group = this.group()!;
        newGroup.members.forEach(x => x.username == username ? editedMember : x)
        this.group.set(newGroup);
      },
      error: error => this.toastr.error(error.error)
    });
  }
}
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from '../../_models/group';
import { GroupService } from '../../_services/group.service';
import { GroupMember } from '../../_models/groupMember';
import { AccountService } from '../../_services/account.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmService } from '../../_services/confirm.service';

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
  private confirmService = inject(ConfirmService);
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
    const user = this.groupMembers().find(x => x.id == this.accountService.currentUser()?.id);
    if (!user) return;
    if (user.id == this.group()?.owner.id) this.role = "owner";
    if (user.isModerator == true) this.role = "moderator";
  }

  addMember(){
    if (this.group() == null) return;
    if (this.groupMembers().find(x => x.knownAs == this.model.knownAs)){
      this.toastr.error("Użytkownik już jest w tej grupie");
      return;
    }
    this.groupService.addOrRemoveMember(this.model.knownAs, this.group()!.id).subscribe({
      next: newMember => {
        if (newMember == null) return;
        this.toastr.success("Użytkownik dodany do grupy");
        const newGroupMember: GroupMember = {
          id: newMember.id,
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

  removeMember(userKnownAs: string){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          if (this.group == null) return;
          if (!this.groupMembers().find(x => x.knownAs == userKnownAs)){
            this.toastr.error("Użytkownik nie należy do tej grupy");
            return;
          }
          this.groupService.addOrRemoveMember(userKnownAs, this.group()!.id).subscribe({
            next: () => {
              this.toastr.success("Użytkownik usunięty z grupy");
              var newGroup: Group = this.group()!;
              newGroup.members = newGroup.members.filter(x => x.knownAs != userKnownAs);
              newGroup.membersCount--;
              this.group.set(newGroup);
              this.groupMembers.set(newGroup.members);
            },
            error: error => this.toastr.error(error.error)
          });
        }
      }
    })
  }

  addModerator(userId: number){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          if (this.group() == null) return;
          var editedMember = this.groupMembers().find(x => x.id == userId);
          if (editedMember == null){
            this.toastr.error("Użytkownik nie należy do tej grupy");
            return;
          }
          if (editedMember.isModerator == true){
            this.toastr.error("Użytkownik już jest moderatorem");
            return;
          }
          this.groupService.addOrRemoveModerator(userId, this.group()!.id, true).subscribe({
            next: () => {
              this.toastr.success("Użytkownik otrzymał rangę moderator");

              editedMember!.isModerator = true;

              var newGroup: Group = this.group()!;
              newGroup.members.forEach(x => x.id == userId ? editedMember : x)
              this.group.set(newGroup);
            },
            error: error => this.toastr.error(error.error)
          });
        }
      }
    })
  }

  removeModerator(userId: number){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          if (this.group() == null) return;
          var editedMember = this.groupMembers().find(x => x.id == userId);
          if (editedMember == null){
            this.toastr.error("Użytkownik nie należy do tej grupy");
            return;
          }
          if (editedMember.isModerator == false){
            this.toastr.error("Użytkownik nie jest moderatorem");
            return;
          }
          this.groupService.addOrRemoveModerator(userId, this.group()!.id, false).subscribe({
            next: () => {
              this.toastr.success("Użytkownik utracił rangę moderator");

              editedMember!.isModerator = false;

              var newGroup: Group = this.group()!;
              newGroup.members.forEach(x => x.id == userId ? editedMember : x)
              this.group.set(newGroup);
            },
            error: error => this.toastr.error(error.error)
          });
        }
      }
    })
  }
}
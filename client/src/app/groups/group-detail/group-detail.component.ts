import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../_services/group.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Group } from '../../_models/group';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { ConfirmService } from '../../_services/confirm.service';

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
  private toastrServie = inject(ToastrService);
  private router = inject(Router);
  group?: Group;
  accountService = inject(AccountService);
  private confirmService = inject(ConfirmService);

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

  leaveGroup(groupId: number){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          this.groupService.leaveGroup(groupId).subscribe({
            next: () => {
              this.toastrServie.success("Opuściłeś grupę");
              this.router.navigateByUrl('/')
            },
            error: error => this.toastrServie.error(error.error)
          })
        }
      }
    })
  }
}

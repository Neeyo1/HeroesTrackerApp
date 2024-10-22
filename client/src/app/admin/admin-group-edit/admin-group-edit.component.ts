import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../_services/group.service';
import { Group } from '../../_models/group';
import { GroupMember } from '../../_models/groupMember';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-group-edit',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './admin-group-edit.component.html',
  styleUrl: './admin-group-edit.component.css'
})
export class AdminGroupEditComponent implements OnInit{
  private adminService = inject(AdminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  group = signal<Group | null>(null);
  groupMembers = signal<GroupMember[]>([]);
  editGroupForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.loadGroup();
    this.initializeForm();
  }

  loadGroup(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId){
      this.toastr.error("Niepoprawny adres");
      this.router.navigateByUrl("/admin/groups");
      return;
    }

    this.adminService.getGroup(groupId).subscribe({
      next: group => {
        this.group.set(group);
        this.groupMembers.set(this.group()!.members);
      },
      error: error => {
        this.toastr.error(error);
        this.router.navigateByUrl("/admin/groups");
        return;
      }
    })
  }

  initializeForm(){
    const owner = this.groupMembers().find(member => member.id == this.group()?.owner.id);
    const groupName = this.group()?.groupName;
    const serverName = this.group()?.serverName;

    if (owner == undefined || groupName == undefined || serverName == undefined){
      this.toastr.error("Nie znaleziono danych grupy");
      this.router.navigateByUrl("/admin/groups");
      return;
    }

    this.editGroupForm = this.fb.group({
      groupName: [groupName, [Validators.required]],
      serverName: [serverName, [Validators.required]],
      owner: [owner.knownAs, [Validators.required]]
    })
  }

  editGroup(){
    this.adminService.editGroup(this.group()!.id, this.editGroupForm.value).subscribe({
      next: () => this.router.navigateByUrl("/admin/groups"),
      error: error => this.validationErrors = error
    });
  }
}

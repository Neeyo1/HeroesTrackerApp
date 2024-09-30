import { Component, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-group-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-group-create.component.html',
  styleUrl: './admin-group-create.component.css'
})
export class AdminGroupCreateComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  createGroup(){
    this.adminService.createGroup(this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/groups"),
      error: error => this.toastr.error(error.error)
    });
  }
}

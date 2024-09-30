import { Component, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-map-area-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-map-area-create.component.html',
  styleUrl: './admin-map-area-create.component.css'
})
export class AdminMapAreaCreateComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  createMapArea(){
    this.adminService.createMapArea(this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/map-areas"),
      error: error => this.toastr.error(error.error)
    });
  }
}

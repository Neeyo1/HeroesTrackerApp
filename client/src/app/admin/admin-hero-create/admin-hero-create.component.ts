import { Component, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-hero-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-hero-create.component.html',
  styleUrl: './admin-hero-create.component.css'
})
export class AdminHeroCreateComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  createHero(){
    this.adminService.createHero(this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/heroes"),
      error: error => this.toastr.error(error.error)
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-map-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-map-create.component.html',
  styleUrl: './admin-map-create.component.css'
})
export class AdminMapCreateComponent implements OnInit{
  adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  ngOnInit(): void {
    if (this.adminService.heroes().length == 0) this.loadHeroes();
    if (this.adminService.mapAreas().length == 0) this.loadMapAreas();
  }

  loadHeroes(){
    this.adminService.getHeroes();
  }

  loadMapAreas(){
    this.adminService.getMapAreas();
  }

  createMap(){
    this.adminService.createMap(this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/maps"),
      error: error => this.toastr.error(error.error)
    });
  }
}

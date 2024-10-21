import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmService } from '../../_services/confirm.service';

@Component({
  selector: 'app-admin-map-areas',
  standalone: true,
  imports: [RouterLink, TooltipModule],
  templateUrl: './admin-map-areas.component.html',
  styleUrl: './admin-map-areas.component.css'
})
export class AdminMapAreasComponent implements OnInit{
  adminService = inject(AdminService);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.adminService.mapAreas().length == 0) this.loadMapAreas();
  }

  loadMapAreas(){
    this.adminService.getMapAreas();
  }

  deleteMapArea(mapAreaId: number){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          this.adminService.deleteMapArea(mapAreaId);
        }
      }
    })
  }

  deleteMapAreas(){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          this.adminService.deleteMapAreas();
        }
      }
    })
  }

  editMapArea(mapAreaId: number){
    this.router.navigateByUrl(`/admin/event/map-areas/${mapAreaId}/edit`);
  }
}

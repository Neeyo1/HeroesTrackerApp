import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-map-areas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-map-areas.component.html',
  styleUrl: './admin-map-areas.component.css'
})
export class AdminMapAreasComponent implements OnInit{
  adminService = inject(AdminService);

  ngOnInit(): void {
    if (this.adminService.mapAreas().length == 0) this.loadMapAreas();
  }

  loadMapAreas(){
    this.adminService.getMapAreas();
  }

  deleteMapArea(mapAreaId: number){
    this.adminService.deleteMapArea(mapAreaId);
  }
}

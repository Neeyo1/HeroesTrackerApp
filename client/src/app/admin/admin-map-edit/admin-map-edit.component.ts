import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Map } from '../../_models/map';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-map-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-map-edit.component.html',
  styleUrl: './admin-map-edit.component.css'
})
export class AdminMapEditComponent implements OnInit{
  adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  model: any = {};
  map?: Map;

  ngOnInit(): void {
    if (this.adminService.heroes().length == 0) this.loadHeroes();
    if (this.adminService.mapAreas().length == 0) this.loadMapAreas();
    this.loadMap();
  }

  loadHeroes(){
    this.adminService.getHeroes();
  }

  loadMapAreas(){
    this.adminService.getMapAreas();
  }

  loadMap(){
    const mapId = Number(this.route.snapshot.paramMap.get("id"));
    if (!mapId){
      this.toastr.error("Niepoprawny adres");
      this.router.navigateByUrl("/admin/event/maps");
      return;
    }

    this.map = this.adminService.maps().find(x => x.id == mapId);
    if (this.map == undefined){
      this.toastr.error("Nie znaleziono mapy");
      this.router.navigateByUrl("/admin/event/maps");
      return;
    }

    this.model.name = this.map?.name;
    this.model.heroId = this.map?.heroId;
    this.model.mapAreaId = this.map?.mapAreaId;
  }

  editMap(){
    this.adminService.editMap(this.map!.id, this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/maps"),
      error: error => this.toastr.error(error.error)
    });
  }
}

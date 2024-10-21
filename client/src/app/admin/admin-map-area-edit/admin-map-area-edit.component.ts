import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MapArea } from '../../_models/mapArea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-map-area-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-map-area-edit.component.html',
  styleUrl: './admin-map-area-edit.component.css'
})
export class AdminMapAreaEditComponent implements OnInit{
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  model: any = {};
  mapArea?: MapArea;

  ngOnInit(): void {
    this.loadMapArea();
  }

  loadMapArea(){
    const mapAreaId = Number(this.route.snapshot.paramMap.get("id"));
    if (!mapAreaId){
      this.toastr.error("Niepoprawny adres");
      this.router.navigateByUrl("/admin/event/map-areas");
      return;
    }

    this.mapArea = this.adminService.mapAreas().find(x => x.id == mapAreaId);
    if (this.mapArea == undefined){
      this.toastr.error("Nie znaleziono okolicy");
      this.router.navigateByUrl("/admin/event/map-areas");
      return;
    }

    this.model.name = this.mapArea?.name;
  }

  editMapArea(){
    this.adminService.editMapArea(this.mapArea!.id, this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/map-areas"),
      error: error => this.toastr.error(error.error)
    });
  }
}

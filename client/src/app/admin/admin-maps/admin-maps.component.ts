import { Component, inject } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmService } from '../../_services/confirm.service';

@Component({
  selector: 'app-admin-maps',
  standalone: true,
  imports: [RouterLink, TooltipModule],
  templateUrl: './admin-maps.component.html',
  styleUrl: './admin-maps.component.css'
})
export class AdminMapsComponent {
  adminService = inject(AdminService);
  private confirmService = inject(ConfirmService);

  ngOnInit(): void {
    if (this.adminService.maps().length == 0) this.loadMaps();
  }

  loadMaps(){
    this.adminService.getMaps();
  }

  deleteMap(mapId: number){
    this.confirmService.confirm()?.subscribe({
      next: result => {
        if (result){
          this.adminService.deleteMap(mapId);
        }
      }
    })
  }
}

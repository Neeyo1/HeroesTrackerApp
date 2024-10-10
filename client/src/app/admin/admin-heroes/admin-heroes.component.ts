import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-admin-heroes',
  standalone: true,
  imports: [RouterLink, TooltipModule],
  templateUrl: './admin-heroes.component.html',
  styleUrl: './admin-heroes.component.css'
})
export class AdminHeroesComponent implements OnInit{
  adminService = inject(AdminService);

  ngOnInit(): void {
    if (this.adminService.heroes().length == 0) this.loadHeroes();
  }

  loadHeroes(){
    this.adminService.getHeroes();
  }

  deleteHero(heroId: number){
    this.adminService.deleteHero(heroId);
  }
}

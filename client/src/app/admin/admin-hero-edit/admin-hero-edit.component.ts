import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../_models/hero';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-hero-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-hero-edit.component.html',
  styleUrl: './admin-hero-edit.component.css'
})
export class AdminHeroEditComponent implements OnInit{
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  model: any = {};
  hero?: Hero;

  ngOnInit(): void {
    this.loadHero();
  }

  loadHero(){
    const heroId = Number(this.route.snapshot.paramMap.get("id"));
    if (!heroId){
      this.toastr.error("Niepoprawny adres");
      this.router.navigateByUrl("/admin/event/heroes");
      return;
    }

    this.hero = this.adminService.heroes().find(x => x.id == heroId);
    if (this.hero == undefined){
      this.toastr.error("Nie znaleziono herosa");
      this.router.navigateByUrl("/admin/event/heroes");
      return;
    }

    this.model.name = this.hero?.name;
    this.model.level = this.hero?.level;
  }

  editHero(){
    this.adminService.editHero(this.hero!.id, this.model).subscribe({
      next: () => this.router.navigateByUrl("/admin/event/heroes"),
      error: error => this.toastr.error(error.error)
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../_services/group.service';
import { Group } from '../../_models/group';
import { Timer } from '../../_models/timer';
import { TimerService } from '../../_services/timer.service';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-group-timers',
  standalone: true,
  imports: [RouterLink, TimeagoModule],
  templateUrl: './group-timers.component.html',
  styleUrl: './group-timers.component.css'
})
export class GroupTimersComponent implements OnInit{
  private groupService = inject(GroupService);
  timerService = inject(TimerService);
  private route = inject(ActivatedRoute);
  group = signal<Group | null>(null);

  ngOnInit(): void {
    this.loadGroup();
    if (this.timerService.timers().length == 0) this.loadTimers();
  }

  loadGroup(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.groupService.getGroup(groupId).subscribe({
      next: group => this.group.set(group)
    })
  }

  loadTimers(){
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    if (!groupId) return;

    this.timerService.getTimers(groupId);
  }
}

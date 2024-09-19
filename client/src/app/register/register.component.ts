import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  model: any = {};

  register(){
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        //return to home page
      },
      error: error => console.log(error)
    });
  }
}

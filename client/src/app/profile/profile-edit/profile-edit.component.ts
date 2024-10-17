import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit{
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  editProfileForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.editProfileForm = this.fb.group({
      knownAs: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    })
  }

  editProfile(){
    this.accountService.editProfile(this.editProfileForm.value).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: error => this.validationErrors = error
    });
  }
}

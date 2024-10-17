import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  changePasswordForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmNewPassword: ['', [this.matchValues('newPassword')]]
    })
    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.changePasswordForm.controls['confirmNewPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
  }

  hasNumber(): ValidatorFn{
    return (control: AbstractControl) => {
      return /\d/.test(control.value) === true ? null : {hasNumber: true};
    }
  }

  hasLowerCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[a-z]/.test(control.value) === true ? null : {hasLowerCase: true};
    }
  }

  hasUpperCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[A-Z]/.test(control.value) === true ? null : {hasUpperCase: true};
    }
  }

  changePassword(){
    this.accountService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: error => this.validationErrors = error
    });
  }
}

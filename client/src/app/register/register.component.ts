import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { TextInputComponent } from '../_forms/text-input/text-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  //model: any = {};

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      knownAs: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
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

  register(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => this.router.navigateByUrl('/'),
      error: error => this.validationErrors = error
    })
  }
}

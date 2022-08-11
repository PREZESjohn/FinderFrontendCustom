import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroup
} from '@angular/forms';

export class CustomValidators {
  constructor() {}
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      // !matchingControl.errors.mustMatch  na dole powinno byc
      if (matchingControl.errors) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }
}

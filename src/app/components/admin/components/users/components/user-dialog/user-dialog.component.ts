import { Component, inject } from '@angular/core';
import { IHotelSearchResponse } from '../../../../../../interfaces/hotel/hotel-search-response.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { RoomDialogComponent } from '../../../rooms/components/room-dialog/room-dialog.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IUserResponse } from '../../../../../../interfaces/user/user-response.interface';
import { EmailValidatorService } from '../../../../../../validators/email-validator.service';
import { CpfValidatorService } from '../../../../../../validators/cpf-validator.service';
import { passwordValidator } from '../../../../../../validators/password.validator';
import { RolePipe } from '../../../../../../pipes/role.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgxMaskDirective,
    RolePipe,
    MatSlideToggleModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {

  dialogTitle: string = 'Visualizar Hotel';
  buttonAction: string = 'Salvar';
  isCreateForm: boolean = false;
  isUpdateForm: boolean = false;
  isView: boolean = false;
  userData: IUserResponse = {} as IUserResponse;

  isOnlyOperator: boolean = false;
  isAdmin: boolean = false;

  userForm: FormGroup = {} as FormGroup;

  hotelsList: IHotelSearchResponse[] = [];
  filteredHotelsList!: Observable<IHotelSearchResponse[]>;

  rolesIds = [1, 2, 3];

  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogRef = inject(MatDialogRef<RoomDialogComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);
  private readonly emailValidatorService = inject(EmailValidatorService);
  private readonly cpfValidatorService = inject(CpfValidatorService);

  ngOnInit(): void {    
    this.setDialogData();
    if (this.isAdmin) {
      this.filteredHotelsList = this.hotel.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.hotelsList.slice();
        }),
      );
    }
  }

  get fullName(): FormControl {
    return this.userForm.get('fullName') as FormControl;
  }
  get email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
  get phone(): FormControl {
    return this.userForm.get('phone') as FormControl;
  }
  get cpf(): FormControl {
    return this.userForm.get('cpf') as FormControl;
  }
  get birthDate(): FormControl {
    return this.userForm.get('birthDate') as FormControl;
  }
  get activated(): FormControl {
    return this.userForm.get('activated') as FormControl;
  }
  get roles(): FormControl {
    return this.userForm.get('roles') as FormControl;
  }
  get hotel(): FormControl {
    return this.userForm.get('hotel') as FormControl;
  }

  getUserRolesForView() {
    return this.userData.roles.map(role => {
      if (role.authority === 'ROLE_ADMIN') return 'Gerente';
      if (role.authority === 'ROLE_OPERATOR') return 'Funcionário';
      return 'Hóspede';
    }).join(', ');
  }

  setDialogData() {
    this.hotelsList = this._data.hotelsList;
    this.isAdmin = this._data.isAdmin;
    this.isOnlyOperator = this._data.isOnlyOperator;
    if (this._data.isCreateForm) {
      this.dialogTitle = 'Cadastrar Usuário';
      this.buttonAction = 'Cadastrar';
      this.isCreateForm = true;
      this.createFormForCreateUser();
    }
    if (this._data.isUpdateForm) {
      this.dialogTitle = 'Atualizar Usuário';
      this.buttonAction = 'Atualizar';
      this.isUpdateForm = true;
      this.userData = this._data.user;
      this.createFormForUpdateUser();
    }
    if (this._data.isView) {
      this.dialogTitle = 'Visualizar Quarto';
      this.isView = true;
      this.userData = this._data.user;
    }
  }   

  onCloseDialog() {
    const isWorkingHotelIdRequired = this.isAdmin && (this.isCreateForm || this.isUpdateForm) && (this.roles.value.includes(2) || this.roles.value.includes(3)) && !this.hotel.value;
    if (isWorkingHotelIdRequired) {
      this.hotel.markAsTouched();
      this.hotel.setErrors({ required: true });
    }
    else this.hotel.setErrors(null);
    if (this.userForm.invalid || isWorkingHotelIdRequired) {
      this.userForm.markAllAsTouched();
      return;
    }
    this._dialogRef.close(this.getUserFormValue());
  }

  displayFn(hotel: IHotelSearchResponse): string {
    return hotel && hotel.name ? hotel.name : '';
  }

  private _filter(name: string): IHotelSearchResponse[] {
    const filterValue = name.toLowerCase();
    return this.hotelsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private getUserFormValue() {
    let isCreatedUserOperatorOrAdmin;
    if (this.isOnlyOperator && (this.isCreateForm || this.isUpdateForm)) isCreatedUserOperatorOrAdmin = false;
    if (this.roles) {
      if (this.roles.value.includes(2) || this.roles.value.includes(3)) isCreatedUserOperatorOrAdmin = true;
    }
    const rolesIds = this.isAdmin ? this.roles.value : this.isUpdateForm && this.isOnlyOperator ? this.userData.roles.map(role => role.id) : [1];
    const workingHotelId = this.isAdmin && isCreatedUserOperatorOrAdmin ? this.hotel.value.id : this.isUpdateForm && this.isOnlyOperator ? this.userData.workingHotelId : null;
    const cpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.cpf.value) ? this.cpf.value : `${this.cpf.value.substring(0,3)}.${this.cpf.value.substring(3,6)}.${this.cpf.value.substring(6,9)}-${this.cpf.value.substring(9)}`;
    const birthDateRaw = this.birthDate.value.replace('/', '');
    const birthDate = `${birthDateRaw.substring(4)}-${birthDateRaw.substring(2,4)}-${birthDateRaw.substring(0,2)}`.replace('/', '');
    const phone = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(this.phone.value.trim()) ? this.phone.value : `(${this.phone.value.substring(0,2)}) ${this.phone.value.substring(2, 7)}-${this.phone.value.substring(7)}`
    return {
      fullName: this.fullName.value,
      email: this.email.value,
      password: this.isCreateForm ? this.password.value : null,
      phone,
      cpf,
      birthDate,
      activated: this.isCreateForm ? true : this.isUpdateForm && this.isOnlyOperator ? this.userData.activated : this.activated.value,
      rolesIds,
      workingHotelId
    }
  }

  private createFormForCreateUser() {
    if (this.isAdmin) {
      this.userForm = this._fb.group({
        fullName: ['', Validators.required],
        email: [
          '', 
          {
            validators: [Validators.required, Validators.pattern(this.emailPattern)],
            asyncValidators: [this.emailValidatorService.validate.bind(this.emailValidatorService)],
            updateOn: 'blur'
          }
        ],
        password: ['', [ Validators.required, passwordValidator() ]],
        phone: ['', Validators.required],
        cpf: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [this.cpfValidatorService.validate.bind(this.cpfValidatorService)],
            updateOn: 'blur'
          }
        ],
        birthDate: [null, Validators.required],
        roles: [[], Validators.required],
        hotel: new FormControl<string | IHotelSearchResponse>('')
      })
    }
    if (this.isOnlyOperator) {
      this.userForm = this._fb.group({
        fullName: ['', Validators.required],
        email: [
          '', 
          {
            validators: [Validators.required, Validators.pattern(this.emailPattern)],
            asyncValidators: [this.emailValidatorService.validate.bind(this.emailValidatorService)],
            updateOn: 'blur'
          }
        ],
        password: ['', [ Validators.required, passwordValidator() ]],
        phone: ['', Validators.required],
        cpf: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [this.cpfValidatorService.validate.bind(this.cpfValidatorService)],
            updateOn: 'blur'
          }
        ],
        birthDate: [null, Validators.required],
      })
    }
  }

  private createFormForUpdateUser() {
    const birthDate = `${this.userData.birthDate.substring(8)}/${this.userData.birthDate.substring(5, 7)}/${this.userData.birthDate.substring(0, 4)}`;
    if (this.isAdmin) {
      this.userForm = this._fb.group({
        fullName: ['', Validators.required],
        email: [
          '', 
          {
            validators: [Validators.required, Validators.pattern(this.emailPattern)]
          }
        ],
        phone: ['', Validators.required],
        cpf: [
          '',
          {
            validators: [Validators.required]
          }
        ],
        birthDate: [null, Validators.required],
        activated: [null, Validators.required],
        roles: [[] as number[], Validators.required],
        hotel: new FormControl<string | IHotelSearchResponse>('')
      });
      this.userForm.setValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        phone: this.userData.phone,
        cpf: this.userData.cpf,
        birthDate: birthDate,
        activated: this.userData.activated,
        roles: this.userData.roles.map(role => role.id),
        hotel: this.userData.workingHotelId ? this.hotelsList.find(hotel => hotel.id === this.userData.workingHotelId) : null
      });
    }
    if (this.isOnlyOperator) {
      this.userForm = this._fb.group({
        fullName: ['', Validators.required],
        email: [
          '', 
          {
            validators: [Validators.required, Validators.pattern(this.emailPattern)],
            asyncValidators: [this.emailValidatorService.validate.bind(this.emailValidatorService)],
            updateOn: 'blur'
          }
        ],
        phone: ['', Validators.required],
        cpf: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [this.cpfValidatorService.validate.bind(this.cpfValidatorService)],
            updateOn: 'blur'
          }
        ],
        birthDate: [null, Validators.required],
      });
      this.userForm.setValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        phone: this.userData.phone,
        cpf: this.userData.cpf,
        birthDate: birthDate,
      });
    }
    
  }

}

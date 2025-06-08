import { Component, inject } from '@angular/core';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { IUserResponse } from '../../../../interfaces/user/user-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { UserList } from '../../../../types/user-list.type';
import { UserService } from '../../../../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { IHotelSearchResponse } from '../../../../interfaces/hotel/hotel-search-response.interface';
import { HotelService } from '../../../../services/hotel.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    CommonModule,
    MatTableModule,
    PaginationComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  isAdmin: boolean = false;
  isOnlyOperator: boolean = false;

  searchForm: FormGroup = {} as FormGroup;
  users$!: Observable<IPageResponse<UserList>>;
  displayedColumns = ['id', 'fullName', 'email', 'phone', 'cpf', 'birthDate', 'actions'];

  hotelsList: IHotelSearchResponse[] = [];
  
  private readonly _userService = inject(UserService);
  private readonly _hotelService = inject(HotelService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _snackBarServce = inject(SnackBarService);
  private readonly _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.obtainUserAuthority();
    this.findAllUsers();
    this.createUserQueryForm();
    if (this.isAdmin) this.populateHotelsList();
  }

  get query(): FormControl {
    return this.searchForm.get('query') as FormControl;
  }

  onSearchSubmit() {
    this.findAllUsers(1, 10, this.query.value);
  }

  onPageChange(page: number) {
    this.findAllUsers(page);
  }


  onPdfExportButtonClick() {
    this._userService.exportToPdf().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  onExcelExportButtonClick() {
    this._userService.exportToExcel().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  onCreateButtonClick() {
    this.openDialog('create', undefined, (result) => {
      this._userService.createUser(result).subscribe({
        next: () => {
          this._snackBarServce.showSnackBar('Usuário criado com sucesso!', 'Fechar');
          this.findAllUsers();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      })
    });
  }

  onViewButtonClick(userId: number) {
    this._userService.findById(userId).subscribe({
      next: (user) => {
        this.openDialog('view', user);
      }
    })
  }

  onEditButtonClick(userId: number) {
    this._userService.findById(userId).subscribe({
      next: (user) => {
        this.openDialog('update', user, (result) => {
          this._userService.updateUser(userId, result).subscribe({
            next: () => {
              this._snackBarServce.showSnackBar('Usuário atualizado com sucesso!', 'Fechar');
              this.findAllUsers();
            },
            error: (error: HttpErrorResponse) => {
              const NOT_FOUND_ERROR = error.status === 404;
              const EMAIL_ALREADY_EXISTS_ERROR = error.status === 409 && error.error.message.includes('E-mail');
              const CPF_ALREADY_EXISTS_ERROR = error.status === 409 && error.error.message.includes('CPF');
              const INVALID_DATA_ERROR = error.status === 422;
              const SERVER_ERROR = error.status >= 500;
              if (NOT_FOUND_ERROR) {
                this._snackBarServce.showSnackBar('Usuário não encontrado.', 'Fechar');
              }
              if (EMAIL_ALREADY_EXISTS_ERROR) {
                this._snackBarServce.showSnackBar('Este E-mail já está em uso por outro usuário.', 'Fechar');
              }
              if (CPF_ALREADY_EXISTS_ERROR) {
                this._snackBarServce.showSnackBar('Este CPF já está em uso por outro usuário.', 'Fechar');
              }
              if (INVALID_DATA_ERROR) {
                this._snackBarServce.showSnackBar('Dados inválidos. Verifique os campos e tente novamente.', 'Fechar');
              }
              if (SERVER_ERROR) {
                this._snackBarServce.showSnackBar('Ocorreu um erro inesperado. Tente novamente mais tarde.', 'Fechar');
              }
            }
          });
        });
      }
    });
  }

  private openDialog(option: 'view' | 'create' | 'update', user?: IUserResponse, callback?: (result: any) => void, ) {
    const data = this.buildDialogData(option, user);
    const dialogRef = this._matDialog.open(UserDialogComponent, {
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (!callback) return;
      callback(result);
    });
  }

  private buildDialogData(option: 'view' | 'create' | 'update', user?: IUserResponse) {
    switch (option) {
      case 'view':
        return { user, isCreateForm: false, isUpdateForm: false, isView: true };
      case 'create':
        return { isCreateForm: true, isUpdateForm: false, isView: false, hotelsList: this.hotelsList, isAdmin: this.isAdmin, isOnlyOperator: this.isOnlyOperator };
      case 'update':
        return { user, isCreateForm: false, isUpdateForm: true, isView: false, hotelsList: this.hotelsList, isAdmin: this.isAdmin, isOnlyOperator: this.isOnlyOperator };
    }
  }

  private findAllUsers(page: number = 1, size: number = 10, query: string = '') {
    this.users$ = this._userService.findAllUsers(page, size, query);
  }

  private obtainUserAuthority() {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
  }

  private createUserQueryForm() {
    this.searchForm = this._fb.group({
      query: ['']
    });
  }

  private populateHotelsList() {
    this._hotelService.findAllByName('').subscribe(response => this.hotelsList = response);
  }

}

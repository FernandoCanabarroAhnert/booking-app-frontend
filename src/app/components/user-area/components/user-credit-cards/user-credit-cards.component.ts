import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { CreditCardComponent } from '../../../credit-card/credit-card.component';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { CreditCardList } from '../../../../types/credit-card-list.type';
import { CreditCardService } from '../../../../services/credit-card.service';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ICreditCardRequest } from '../../../../interfaces/credit-card/credit-card-request.interface';
import { CreditCardFormComponent } from '../../../credit-card-form/credit-card-form.component';

@Component({
  selector: 'app-user-credit-cards',
  standalone: true,
  imports: [
    PaginationComponent,
    CreditCardComponent,
    CommonModule
  ],
  templateUrl: './user-credit-cards.component.html',
  styleUrl: './user-credit-cards.component.scss'
})
export class UserCreditCardsComponent implements OnInit {

  creditCards$!: Observable<IPageResponse<CreditCardList>>;

  private readonly _creditCardService = inject(CreditCardService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _matDialog = inject(MatDialog);

  ngOnInit(): void {
    this.findCreditCards(1);
  }

  findCreditCards(page: number): void {
    this.creditCards$ = this._creditCardService.getMyCreditCards(page, 6);
  }

  openAddDialog() {
    const dialogRef = this._matDialog.open(CreditCardFormComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.findCreditCards(1);
      this._snackBarService.showSnackBar('Cartão adicionado com sucesso!', 'Fechar');
    })
  }

  onDeleteClick(creditCardId: number) {
    const dialogRef = this._matDialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: {
        resource: 'Cartão'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._creditCardService.deleteCreditCard(creditCardId).subscribe({
        next: () => {
          this.findCreditCards(1);
          this._snackBarService.showSnackBar('Cartão deletado com sucesso!', 'Fechar');
        }
      });
    });
  }

}

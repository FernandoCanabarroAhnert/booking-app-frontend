import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-boleto',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './boleto.component.html',
  styleUrl: './boleto.component.scss'
})
export class BoletoComponent {

  @Output()
  printBoletoEmitter = new EventEmitter<void>();

  iconToolTipMessage = 'Copiar código de barras';

  swapIcon(event: Event) {
    const button = event.target as HTMLButtonElement;
    this.iconToolTipMessage = 'Código Copiado!';
    button.innerHTML = '<mat-icon (click)="copyText()" class="cursor-pointer">check_circle</mat-icon>'
  }

  copyText() {
    navigator.clipboard.writeText('55664.48814 8947.5479 77841.48415 2 8897787000070000');
  }

  printBoletoEmit() {
    this.printBoletoEmitter.emit();
  }

}

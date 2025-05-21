import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pix',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './pix.component.html',
  styleUrl: './pix.component.scss'
})
export class PixComponent {

  iconToolTipMessage = 'Copiar código';

  swapIcon(event: Event) {
    const button = event.target as HTMLButtonElement;
    this.iconToolTipMessage = 'Código Copiado!';
    button.innerHTML = '<mat-icon (click)="copyText()" class="cursor-pointer">check_circle</mat-icon>'
  }

  copyText() {
    navigator.clipboard.writeText('08979530dfdsf548700ausgaygs0000000');
  }

}

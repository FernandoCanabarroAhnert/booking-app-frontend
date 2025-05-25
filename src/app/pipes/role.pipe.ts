import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'rolePipe',
    standalone: true
})
export class RolePipe implements PipeTransform {

    transform(value: number): string {
        const roleMap: { [key: number]: string } = {
            1: 'Hóspede',
            2: 'Funcionário',
            3: 'Gerente'
        }
        return roleMap[value];
    }

}
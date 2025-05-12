import { Pipe, PipeTransform } from '@angular/core';
import { RoomTypeEnum } from '../enums/room-type.enum';

@Pipe({
  name: 'roomType',
  standalone: true
})
export class RoomTypePipe implements PipeTransform {

  transform(value: number): string {
    const roomTypeEnumMap: { [key in RoomTypeEnum]: string } = {
      [RoomTypeEnum.SINGLE]: 'Solteiro',
      [RoomTypeEnum.DOUBLE]: 'Casal',
      [RoomTypeEnum.SUITE]: 'Suite'
    };
    return roomTypeEnumMap[value as RoomTypeEnum];
  }

}

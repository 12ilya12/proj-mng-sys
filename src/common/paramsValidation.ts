/*import { BadRequestException } from '@nestjs/common'
import { isInt, isNumberString, isPositive } from 'class-validator'
import { IPagingOptions } from '../pagination/pagination'

 export class ParamsValidation {
  static validateId(id: number) {
    if (
      !(
        isNumberString(id) &&
        isPositive(Number(id)) &&
        isInt(Number(id))
      )
    )
      throw new BadRequestException(
        'Идентификатор должен быть положительным целым числом'
      )
  }

  static validatePagingOptions(
    pagingOptions: Partial<IPagingOptions>
  ) {
    if (
      pagingOptions.page != null &&
      !(
        pagingOptions.pageSize !== null &&
        isNumberString(pagingOptions.page) &&
        isPositive(Number(pagingOptions.page)) &&
        isInt(Number(pagingOptions.page))
      )
    )
      throw new BadRequestException(
        'Номер страницы должен быть положительным целым числом'
      )
    if (
      pagingOptions.pageSize != null &&
      !(
        pagingOptions.pageSize !== null &&
        isNumberString(pagingOptions.pageSize) &&
        isPositive(Number(pagingOptions.pageSize)) &&
        isInt(Number(pagingOptions.pageSize))
      )
    )
      throw new BadRequestException(
        'Размер страницы должен быть положительным целым числом'
      )
    if (
      pagingOptions.order != null &&
      !(
        pagingOptions.order === 'asc' ||
        pagingOptions.order === 'desc'
      )
    )
      throw new BadRequestException(
        'Порядок сортировки может быть только "asc"(по возрастанию) и "desc"(по убыванию)'
      )
    if (pagingOptions.orderBy != null && pagingOptions.orderBy === '')
      throw new BadRequestException(
        'Название столбца, по которому требуется сортировка, не может быть пустым'
      )
  }
} */

import { BadRequestException } from "@nestjs/common";
import { isInt, isNegative, isNumberString } from "class-validator";

export class ParamsValidation {
    static validateId(id : number) {
        if (!isNumberString(id)||isNegative(Number(id))||!isInt(Number(id)))
            throw new BadRequestException('Идентификатор должен быть положительным целым числом');
    }
}
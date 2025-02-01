import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateDependencyDto {
    @IsNumber()
    @IsNotEmpty()
    childTaskId: number;
}
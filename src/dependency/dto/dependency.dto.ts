import { IsNotEmpty, IsNumber } from "class-validator"

export class DependencyDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    parentTaskId: number;

    @IsNumber()
    @IsNotEmpty()
    childTaskId: number;
}
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CategoryHasTasksDto {
    @IsBoolean()
    @IsNotEmpty()
    hasTasks: boolean;
}
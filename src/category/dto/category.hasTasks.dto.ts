import { IsBoolean, IsNotEmpty } from "class-validator"

export class CategoryHasTasksDto {
    @IsBoolean()
    @IsNotEmpty()
    hasTasks: boolean;
}
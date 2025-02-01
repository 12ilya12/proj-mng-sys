import { CategoryDto } from '../category/dto/category.dto';
import { CategoryPersistType } from '../category/category.persistType';

export const toCategoryDto = (data: CategoryPersistType): CategoryDto => {
  const { id, name } = data;

  const categoryDto: CategoryDto = {
    id,
    name,
  };

  return categoryDto;
};

export const toCategoryDtoArray = (data: CategoryPersistType[]): CategoryDto[] => {
    let categoryDtos = [];
    
    data.forEach(function(categoryPersist) {
        const { id, name } = categoryPersist;
        categoryDtos.push({id, name});
    });

    return categoryDtos;
  };
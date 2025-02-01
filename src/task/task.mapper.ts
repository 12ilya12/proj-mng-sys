import { TaskDto } from '../task/dto/task.dto';
import { TaskPersistType } from '../task/task.persistType';

export const toTaskDto = (data: TaskPersistType): TaskDto => {
  const { id, name, description, categoryId, statusId, userId } = data;

  const taskDto: TaskDto = {
    id,
    name,
    description,
    categoryId,
    statusId,
    userId
  };

  return taskDto;
};

export const toTaskDtoArray = (data: TaskPersistType[]): TaskDto[] => {
    let taskDtos = [];
    
    data.forEach(function(taskPersist) {
        const { id, name, description, categoryId, statusId, userId } = taskPersist;
        taskDtos.push({ id, name, description, categoryId, statusId, userId });
    });

    return taskDtos;
  };
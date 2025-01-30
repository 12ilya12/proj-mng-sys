import { StatusDto } from '../status/dto/status.dto';
import { StatusPersistType } from '../status/status.persistType';

export const toStatusDto = (data: StatusPersistType): StatusDto => {
  const { id, name } = data;

  const statusDto: StatusDto = {
    id,
    name,
  };

  return statusDto;
};

export const toStatusDtoArray = (data: StatusPersistType[]): StatusDto[] => {
    let userDtos = [];
    
    data.forEach(function(statusPersist) {
        const { id, name } = statusPersist;
        userDtos.push({id, name});
    });

    return userDtos;
  };
import { DependencyDto } from '../dependency/dto/dependency.dto'
import { DependencyPersistType } from '../dependency/dependency.persistType'

export const toDependencyDto = (
  data: DependencyPersistType
): DependencyDto => {
  const { id, parentTaskId, childTaskId } = data

  const dependencyDto: DependencyDto = {
    id,
    parentTaskId,
    childTaskId
  }

  return dependencyDto
}

export const toDependencyDtoArray = (
  data: DependencyPersistType[]
): DependencyDto[] => {
  let dependencyDtos = []

  data.forEach(function (dependencyPersist) {
    const { id, parentTaskId, childTaskId } = dependencyPersist
    dependencyDtos.push({ id, parentTaskId, childTaskId })
  })

  return dependencyDtos
}

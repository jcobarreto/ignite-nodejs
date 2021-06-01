import { Specification } from "../model/Specification";

interface ICreateSpecificationsDTO {
  name: string;
  description: string;
}

interface ISpecificationRepository {
  create({ description, name }: ICreateSpecificationsDTO): void;
  findByName(name: string): Specification;
}

export { ISpecificationRepository, ICreateSpecificationsDTO };

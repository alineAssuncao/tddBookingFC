import { Property } from "../entities/property";

export interface PropertyRepository {
  findPropertyById(id: string): Promise<Property | null>;  
  saveProperty(property: Property): Promise<void>;
}
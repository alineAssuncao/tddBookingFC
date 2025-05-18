import { Property } from "../domain/entities/property";
import { PropertyRepository } from "../domain/repositories/property_repository";

export class PropertyService {
    constructor(private readonly propertyRepository: PropertyRepository) {}

    async findPropertyById(id: string): Promise<Property | null> {
        return this.propertyRepository.findPropertyById(id);
    }   
}
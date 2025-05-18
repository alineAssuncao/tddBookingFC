import { PropertyRepository } from "../../domain/repositories/property_repository";
import { Property } from "../../domain/entities/property";  

export class FakePropertyRepository implements PropertyRepository {
    private properties: Property[] = [
        new Property("1", "Casa de Campo", "Uma linda casa no campo", 6, 200),
        new Property("2", "Chalé na Montanha", "Um chalé aconchegante nas montanhas", 4, 150),
        new Property("3", "Apartamento no Centro", "Um apartamento moderno no centro da cidade", 2, 100),
    ];

    async findPropertyById(id: string): Promise<Property | null> {
        return this.properties.find((property) => property.getId() === id) || null;
    }

    async saveProperty(property: Property): Promise<void> {
        this.properties.push(property);
    }
}
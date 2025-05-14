export class Property{
    constructor(
        private id: string,
        private name: string,
        private description: string,
        private maxGuests: number,
        private basePricePerNight: number
    ){
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxGuests = maxGuests;
        this.basePricePerNight = basePricePerNight;
    }

    
    getId(): string{
        return this.id;
    }

    getName(): string{
        return this.name;
    }

    getDescription(): string{
        return this.description;
    }

    geMaxGuests(): number{
        return this.maxGuests;
    }

    getBasePrice(): number{
        return this.basePricePerNight;
    }
    
}
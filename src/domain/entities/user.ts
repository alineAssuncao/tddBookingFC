export class User{
    private readonly id: string;
    private readonly name: string;

    constructor(id: string, name: string){
        this.id = id;
        this.name = name;   
        
        if(!id) {
            throw new Error("O id é obrigatório.");
        }

        if(!name) {
            throw new Error("O nome é obrigatório.");
        }
    }

    getId(): string{
        return this.id;
    }

    getName(): string{
        return this.name;
    }
}
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { BookingEntity } from "./booking_entity";

@Entity("properties")
export class PropertyEntity {
    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ name: "max_guests" })
    maxGuests!: number;

    @Column({ name: "base_price_per_night", type: "decimal" })
    basePricePerNight!: number;

    @OneToMany(() => BookingEntity, (booking) => booking.property)
    bookings!: BookingEntity[];

}
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PropertyEntity } from "./property_entity";
import { User } from "../../../domain/entities/user";
import { UserEntity } from "./user_entity";

@Entity("bookings")
export class BookingEntity {
    @PrimaryColumn("uuid")
    id!: string;

    @ManyToOne(() => PropertyEntity, (property) => property.bookings, {
        nullable: false,
    })

    @JoinColumn({ name: "property_id" })
    property!: PropertyEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: "guest_id" })
    guest!: UserEntity;

    @Column({ type: "datetime", name: "start_date" })
    startDate!: Date;

    @Column({ type: "datetime", name: "end_date" })
    endDate!: Date;

    @Column({ name: "guest_count"})
    guestCount!: number;

    @Column({ name: "total_price", type: "decimal" })
    totalPrice!: number;

    @Column()
    status!: "CONFIRMED" | "CANCELLED" ;
}
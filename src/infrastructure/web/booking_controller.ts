import { Request, Response } from "express";
import { BookingService } from "../../application/services/booking_service";
import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";
import { DateRange } from "../../domain/value_objects/date_range";
import { IDateRange } from "../../domain/interfaces/idate_range";

export class BookingController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req: Request, res: Response): Promise<Response> {
        try{
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Data de início ou fim inválida" });
            }

            const dto: CreateBookingDTO = {
                propertyId: req.body.propertyId,
                guestId: req.body.userId,
                startDate: startDate,
                endDate: endDate,
                guestCount: req.body.guestCount,
            }

            const getDateRange = new DateRange(startDate, endDate);
            
            const booking = await this.bookingService.createBooking(dto, getDateRange);

            return res.status(201).json(
                { message: "Reserva criada com sucesso", 
                    booking: {
                        id: booking.getId(),
                        propertyId: booking.getProperty().getId(),
                        guestId: booking.getGuest().getId(),
                        startDate: booking.getDateRange().getStartDate(),
                        endDate: booking.getDateRange().getEndDate(),
                        guestCount: booking.getGuestCount(),
                        totalPrice: booking.getTotalPrice(),
                        status: booking.getStatus(),
                    },
                });
        } 
        catch (error) {
            return res.status(400).json({ message: (error as Error).message || "Unexpected error"});

        }
    }

    async cancelBooking(req: Request, res: Response): Promise<Response> {
        try{
            const bookingId = req.params.id;
            await this.bookingService.cancelBooking(bookingId);
            return res.status(200).json({ message: "Reserva cancelada com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ message: "Reserva não encontrada" });
        }
        
    }
}
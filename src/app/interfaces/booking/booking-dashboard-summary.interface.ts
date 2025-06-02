import { IBookingStatsSummary } from "./booking-stats-summary.interface";

export interface IBookingDashboardSummary {
    occupationPercentage: number;
    totalAmount: number;
    averageStayDays: number;
    averageRating: number;
    bookingStatsSummaries: IBookingStatsSummary[];
}
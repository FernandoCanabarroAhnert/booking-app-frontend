export interface IRoomRatingResponse {
    id: number;
    roomId: number;
    userFullName: string;
    userEmail: string;
    rating: number;
    description: string;
    createdAt: Date;
}
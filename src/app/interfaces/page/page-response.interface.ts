export interface IPageResponse<T> {
    content: T,
    number: number;
    totalPages: number;
    numberOfElements: number;
    totalElements: number;
}
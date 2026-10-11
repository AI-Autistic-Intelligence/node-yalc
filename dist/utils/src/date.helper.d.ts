export declare class DateHelper {
    /**
     * Function that returns interface of startDate being current date and endDate being 1 week earlier
     * @returns
     */
    static getWeekEdgeDates(): {
        startDate: string;
        endDate: string;
    };
    /**
     *
     * @param num number of day or month
     * @returns formatted number, like 3rd month (number 3 passed) returns string '03'
     */
    static formatMonth(month: number): string;
    static formatDay(day: number): string;
    static subsMinutes(date: Date, minutes: number): Date;
    static addMinutes(date: Date, minutes: number): Date;
    static dateToSQLDateTime(date: Date): string;
    static dateToPlainISO(date: Date): string;
}

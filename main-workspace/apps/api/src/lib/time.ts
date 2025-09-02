export type TimeUnitValue = {
    unit: TimeUnit;
    value: number;
};

/**
 * Enum representing different time units
 */
export enum TimeUnit {
    Millisecond = "millisecond",
    Second = "second",
    Minute = "minute",
    Hour = "hour",
    Day = "day",
    Week = "week",
    Month = "month",
    Year = "year",
}

/**
 * Namespace for TimeUnit methods
 */
export namespace TimeUnit {
    /**
     * Convert a value to milliseconds
     *
     * @param unit the unit to convert to
     * @param value the value to convert
     * @returns the value in milliseconds
     */
    export const toMillis = (unit: TimeUnit, value: number): number => {
        const multipliers: Record<TimeUnit, number> = {
            [TimeUnit.Millisecond]: 1,
            [TimeUnit.Second]: 1000,
            [TimeUnit.Minute]: 60 * 1000,
            [TimeUnit.Hour]: 60 * 60 * 1000,
            [TimeUnit.Day]: 24 * 60 * 60 * 1000,
            [TimeUnit.Week]: 7 * 24 * 60 * 60 * 1000,
            [TimeUnit.Month]: 30 * 24 * 60 * 60 * 1000,
            [TimeUnit.Year]: 365 * 24 * 60 * 60 * 1000,
        };
        return value * multipliers[unit];
    };
}
/**
 * Parse a time string and convert to milliseconds
 *
 * @param timeStr the time string (e.g., "1d", "30s", "30m", "2h", "1w", "6mo", "1y")
 * @returns the time in milliseconds or null if invalid
 */
export const parseToMillis = (timeStr: string): number | undefined => {
    // Extract the numeric part
    const valueMatch = timeStr.match(/^\d+/);
    if (!valueMatch) return undefined;

    const value = parseInt(valueMatch[0], 10);
    const unit = parseTimeUnit(timeStr);

    if (!unit) return undefined;

    return TimeUnit.toMillis(unit, value);
};

/**
 * Parse a time string and return the corresponding TimeUnit
 *
 * @param timeStr the time string (e.g., "1d", "30s", "30m")
 * @returns the TimeUnit or null if invalid
 */
export const parseTimeUnit = (timeStr: string): TimeUnit | undefined => {
    const unitMap: Record<string, TimeUnit> = {
        ms: TimeUnit.Millisecond,
        s: TimeUnit.Second,
        m: TimeUnit.Minute,
        h: TimeUnit.Hour,
        d: TimeUnit.Day,
        w: TimeUnit.Week,
        mo: TimeUnit.Month,
        y: TimeUnit.Year,
    };

    // Extract the unit part (last characters that aren't digits)
    const unitMatch = timeStr.match(/[a-zA-Z]+$/);
    if (!unitMatch) return undefined;

    const unit = unitMatch[0].toLowerCase();
    return unitMap[unit] || null;
};

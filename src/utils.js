/**
 * @format
 * @flow strict-local
 */
import type {WebMode, DatePickerOptions, TimePickerOptions} from './types';

/**
 * Convert a Date to a timestamp.
 */
export function toMilliseconds(
  options: DatePickerOptions | TimePickerOptions,
  ...keys: Array<string>
) {
  keys.forEach(function each(key) {
    const value = options[key];

    // Is it a Date object?
    if (Object.prototype.toString.call(value) === '[object Date]') {
      options[key] = value.getTime();
    }
  });
}

// pad time with a leading zero
const twoDigits = (n: Int): string => (n < 10 ? '0' : '') + n;

export const toWebInputFormat = (mode: WebMode, dateOrTime: Date): string => {
  if (mode === 'time') {
    return (
      twoDigits(dateOrTime.getHours()) +
      ':' +
      twoDigits(dateOrTime.getMinutes())
    );
  } else if (mode === 'date') {
    return (
      dateOrTime.getFullYear() +
      '-' +
      twoDigits(dateOrTime.getMonth() + 1) +
      '-' +
      twoDigits(dateOrTime.getDate())
    );
  } else {
    // return dateOrTime.toISOString(); // invalid, because 'Z' is not recognised. Need local time.
    return (
      toWebInputFormat('date', dateOrTime) +
      'T' +
      toWebInputFormat('time', dateOrTime)
    );
  }
};

export const fromWebEventFormat = (
  originalValue: Date,
  mode: WebMode,
  rawValue: string,
): Date => {
  /*
   * interestingly, `new Date().getTimezoneOffset()` and `new Date(int).getTimezoneOffset()` returned different
   * values for me when I developed this code during daylight savings time. Using `originalValue` works around this
   * by using whatever timezone offset the calling developer provides.
   */
  if (mode === 'time') {
    let [rawHours: string, rawMinutes: string] = rawValue.split(':');
    return new Date(
      originalValue.getFullYear(),
      originalValue.getMonth(),
      originalValue.getDate(),
      parseInt(rawHours, 10),
      parseInt(rawMinutes, 10),
      0,
    );
  } else if (mode === 'date') {
    let [rawYears: string, rawMonths: string, rawDays: string] = rawValue.split(
      '-',
    );
    return new Date(
      parseInt(rawYears, 10),
      parseInt(rawMonths, 10) - 1,
      parseInt(rawDays, 10),
    );
  } else {
    return new Date(rawValue); // Date constructor supports ISO datetime format out of the box
  }
};

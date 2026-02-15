import { isAfter, subYears } from "date-fns";

export function isAtLeastAge(date: Date, age: number) {
  const minDate = subYears(new Date(), age);
  return !isAfter(date, minDate);
}

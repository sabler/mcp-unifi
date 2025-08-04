import { type Duration, sub } from "date-fns";

interface Range {
  startDate: string;
  endDate: string;
}

function getDateRange(startDate: Duration): Range {
  if (startDate.days && startDate.days > 30) {
    throw new Error("Logs have a maximum history of 30 days.");
  }

  const now = new Date(Date.now()).toISOString();
  const flux = startDate;
  const result = sub(now, flux).toISOString();

  const rangeCalc = {
    startDate: result,
    endDate: now,
  };

  return rangeCalc;
}

let calcResult = getDateRange({ days: 1 });
console.log(calcResult)

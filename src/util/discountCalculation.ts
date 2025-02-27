// import { useState } from "react";

interface TicketBand {
  child: number;
  adult: number;
  pensioner: number;
}

interface TicketData {
  bands: {
    A: TicketBand;
    B: TicketBand;
    C: TicketBand;
  };
  isSocialClub: boolean;
  totalTickets: number;
  day: string;
  showTime: string;
}

export const calculateDiscount = (data: TicketData): number => {
  let discount: number = 0;

  //   const [childrenDiscount, setChildrenDiscount] = useState(0);
  //   const [pensionersDiscount, setPensionersDiscount] = useState(0);
  //   const [socialClubDiscount, setSocialClubDiscount] = useState(0);
  //   const [normalPrice, setNormalPrice] = useState(0);

  const weekdaySpecials: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  const isWithinOneHour = (timeString: string): boolean => {
    // Parse the provided time string
    const targetTime: Date = new Date(timeString);

    // Get current time
    const currentTime: Date = new Date();

    // Calculate the difference in milliseconds
    const timeDifference: number = Math.abs(
      currentTime.getTime() - targetTime.getTime()
    );

    // Convert milliseconds to hours (1 hour = 3,600,000 milliseconds)
    const hoursDifference: number = timeDifference / 3600000;

    // Check if the difference is less than or equal to 1 hour
    const isWithinHour: boolean = hoursDifference <= 1;

    return isWithinHour;
  };

  if (isWithinOneHour(data.showTime)) {
    discount += 10;
    if (weekdaySpecials.includes(data.day)) {
      discount += 10;
      if (data.isSocialClub) {
        discount += 5;
        if (data.totalTickets > 20) {
          discount += 5;
        }
      }
    }
  } else if (weekdaySpecials.includes(data.day)) {
    discount += 10;
    if (data.isSocialClub) {
      discount += 5;
      if (data.totalTickets > 20) {
        discount += 5;
      }
    }
  } else if (data.isSocialClub) {
    discount += 5;
    if (data.totalTickets > 20) {
      discount += 5;
    }
  }

  return discount; // Added return statement to return the calculated discount
};

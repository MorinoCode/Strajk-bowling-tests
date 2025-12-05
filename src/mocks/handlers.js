import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
    async () => {
      return HttpResponse.json({
        bookingDetails: {
          when: "2024-10-10T10:30",
          lanes: 2,
          people: 3,
          price: 560,
          bookingId: "ABC123",
        },
      });
    }
  ),
];

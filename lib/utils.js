// utils.js

import { supabase } from "./supabase";

export const searchTrips = async (from, to, departureDate) => {
  // Define the date and time range for your trip
  let start = new Date(departureDate).toISOString();
  let end = new Date(departureDate).setHours(departureDate.getHours() + 24);
  end = new Date(end).toISOString();

  // Query routes table to get route_id
  let { data: route, error: routeError } = await supabase
    .from("routes")
    .select("route_id")
    .eq("start_location_id", from.id)
    .eq("end_location_id", to.id);

  if (routeError) {
    console.error("Error fetching route: ", routeError);
    return;
  }

  // Query trips table to get matching trips
  let { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("*")
    .eq("route_id", route[0].route_id)
    .gte("trip_time", start)
    .lte("trip_time", end);

  if (tripsError) {
    console.error("Error fetching trips: ", tripsError);
    return;
  }
  // console.log("trips: ", trips[0]);

  return trips;
};
export const searchTripsN = async (from, to, departureDate) => {
  // Define the date and time range for your trip
  const start = new Date(departureDate).toISOString();
  const end = new Date(departureDate).setHours(departureDate.getHours() + 24);
  const endISO = new Date(end).toISOString();

  let { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("bus_id,created_at,route_id,trip_id,trip_time,updated_at, routes (start_location_id,end_location_id)")
    .eq("routes.start_location_id", from.id)
    .eq("routes.end_location_id", to.id)
    .gte("trip_time", start)
    .lte("trip_time", endISO);

  if (tripsError) {
    console.error("Error fetching trips: ", tripsError);
    return;
  }
  console.log("trip Gotten: ", trips[0]);

  return trips;
};


export const checkSeatAvailability = async (trips, adults) => {
  try {
    const availableTrips = [];
    const promises = trips.map(async (trip) => {
      // Fetch all seats and booked seats in parallel
      const [seatsData, bookedSeatsData] = await Promise.all([
        supabase.from("seats").select("seat_id").eq("bus_id", trip.bus_id),
        supabase.from("tickets").select("seat_id").eq("trip_id", trip.trip_id),
      ]);

      const seats = seatsData.data;
      const bookedSeats = bookedSeatsData.data;

      // Identify available seats by filtering out booked ones
      const availableSeats = seats.filter(
        (seat) =>
          !bookedSeats.some((bookedSeat) => bookedSeat.seat_id === seat.seat_id)
      );

      if (availableSeats.length >= adults) {
        availableTrips.push({
          ...trip,
          availableSeats,
        });
      }
    });

    // Wait for all promises to complete
    await Promise.all(promises);
    return availableTrips;
  } catch (error) {
    console.error("Error in checkSeatAvailability: ", error);
    return [];
  }
};


export const checkSeatAvailabilityOld = async (trips, adults) => {
  let availableTrips = [];
  let counter = 0;

  for (let trip of trips) {
    counter++;
    // Fetch all seats of the bus
    let { data: seats, error: seatsError } = await supabase
      .from("seats")
      .select("seat_id")
      .eq("bus_id", trip.bus_id);

    if (seatsError) {
      console.error("Error fetching seats: ", seatsError);
      return;
    }

    // Fetch all booked seats for the trip
    let { data: bookedSeats, error: bookedSeatsError } = await supabase
      .from("tickets")
      .select("seat_id")
      .eq("trip_id", trip.trip_id);

    if (bookedSeatsError) {
      console.error("Error fetching booked seats: ", bookedSeatsError);
      return;
    }

    // Identify available seats by filtering out booked ones
    let availableSeats = seats.filter(
      (seat) =>
        !bookedSeats.some((bookedSeat) => bookedSeat.seat_id === seat.seat_id)
    );

    if (availableSeats.length >= parseInt(adults)) {
      availableTrips.push({
        ...trip,
        availableSeats,
      });
    }
    console.log("counter: ", counter);
  }
  // console.log("availableTrips: ", JSON.stringify(availableTrips, null, 2));

  return availableTrips;
};

export const bookTicket = async (tripId, seatsToBook, user) => {
  const now = new Date();

  const bookingTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const bookingDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // 1. Check if the seats are still available for the specific trip
  const { data: bookedSeats, error: bookedSeatsError } = await supabase
    .from("tickets")
    .select("seat_id")
    .eq("trip_id", tripId)
    .in(
      "seat_id",
      seatsToBook.map((seat) => seat.seat_id)
    );

  if (bookedSeatsError) {
    console.error("Error checking booked seats: ", bookedSeatsError);
    return {
      success: false,
      errorMessage:
        bookedSeatsError.message ||
        "An error occurred while checking seat availability.",
    };
  }

  const bookedSeatIds = bookedSeats.map((seat) => seat.seat_id);
  const seatsStillAvailable = seatsToBook.filter(
    (seat) => !bookedSeatIds.includes(seat.seat_id)
  );

  if (seatsStillAvailable.length < seatsToBook.length) {
    return {
      success: false,
      errorMessage:
        "Some of the seats you tried to book are no longer available.",
    };
  }

  // 2. If seats are available, book them.
  const recordsToInsert = seatsToBook.map((seat) => ({
    user_id: user.id,
    trip_id: tripId,
    seat_id: seat.seat_id,
    booking_time: bookingTime,
    booking_date: bookingDate,
  }));

  try {
    let { data, error } = await supabase
      .from("tickets")
      .insert(recordsToInsert);

    if (error) {
      console.error("Error booking tickets: ", error);
      return {
        success: false,
        errorMessage: error.message || "An error occurred while booking.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      success: false,
      errorMessage: error.message || "An unexpected error occurred.",
    };
  }
};
export const getCompanyDetailsByTripId = async (tripId) => {
  // First, query the trips table to get the route_id associated with the given trip_id
  let { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("route_id")
    .eq("trip_id", tripId);

  if (tripError || !trip.length) {
    console.error("Error fetching route ID from trip: ", tripError);
    return null; // or return an error message, based on your use case
  }

  // Next, query the routes table to get the company name and cost for the obtained route_id
  let { data: route, error: routeError } = await supabase
    .from("routes")
    .select("company, cost")
    .eq("route_id", trip[0].route_id);

  if (routeError || !route.length) {
    console.error("Error fetching company details: ", routeError);
    return null; // or return an error message, based on your use case
  }

  return {
    companyName: route[0].company,
    cost: route[0].cost,
  };
};

export const fetchUserTickets = async (userId) => {
  try {
    // Query the tickets table to get all tickets for a specific user
    let { data: userTickets, error: userTicketsError } = await supabase
      .from("tickets")
      .select("trip_id, seat_id, booking_time, booking_date, trips (trip_time,bus_id)")
      .eq("user_id", userId);

    console.log("userTickets: ", userTickets);
    if (userTicketsError) {
      console.error("Error fetching user tickets: ", userTicketsError);
      return {
        success: false,
        errorMessage:
          userTicketsError.message ||
          "An error occurred while fetching user tickets.",
      };
    }
    if (!userTickets.length) {
      return { success: true, userTickets: [] };
    }
    // return { success: true, userTickets };

    const { companyName, cost } = await getCompanyDetailsByTripId(
      userTickets[0].trip_id
    );

    // Compute the total number of tickets the user booked for each trip
    let tripCounts = userTickets.reduce((acc, ticket) => {
      acc[ticket.trip_id] = (acc[ticket.trip_id] || 0) + 1;
      return acc;
    }, {});

    // Create a condensed list of trips with the adults count and other relevant data
    let condensedTickets = [];
    for (let trip_id in tripCounts) {
      let sampleTicket = userTickets.find(
        (ticket) => ticket.trip_id == trip_id
      );
      condensedTickets.push({
        ...sampleTicket,
        adults: tripCounts[trip_id],
        companyName,
        cost,
      });
    }

    console.log("condensedTickets: ", condensedTickets);

    return { success: true, userTickets: condensedTickets };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      success: false,
      errorMessage: error.message || "An unexpected error occurred.",
    };
  }
};

export const validateBookingParameters = (
  from,
  to,
  adults,
  showReturn,
  returnDate
) => {
  if (!from) return "Please set the departure location.";
  if (!to) return "Please set the arrival location.";
  if (parseInt(adults, 10) <= 0) return "Please set the number of passengers.";
  if (showReturn && !returnDate) return "Please set the return date.";
  return null;
};

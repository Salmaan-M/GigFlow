import api from "../../services/api";

export const fetchGigs = (search = "") =>
  api.get(`/gigs${search ? `?search=${search}` : ""}`);

export const createGig = (data) =>
  api.post("/gigs", data);

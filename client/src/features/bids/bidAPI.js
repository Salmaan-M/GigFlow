import api from "../../services/api";

export const submitBid = (data) =>
  api.post("/bids", data);

export const fetchBids = (gigId) =>
  api.get(`/bids/${gigId}`);

export const hireBid = (bidId) =>
  api.patch(`/bids/${bidId}/hire`);

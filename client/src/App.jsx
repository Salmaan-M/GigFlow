import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GigList from "./pages/GigList";
import GigDetails from "./pages/GigDetails";
import CreateGig from "./pages/CreateGig";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GigList />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/create" element={<CreateGig />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

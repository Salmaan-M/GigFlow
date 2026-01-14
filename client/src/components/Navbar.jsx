import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <Link to="/" className="text-xl font-bold">
        GigFlow
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* ✅ POST GIG BUTTON */}
            <Link
              to="/create"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Post Gig
            </Link>

            <span className="text-sm text-gray-600">
              {user.name}
            </span>

            <button
              onClick={logoutHandler}
              className="text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

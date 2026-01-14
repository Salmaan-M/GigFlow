import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGigs } from "../features/gigs/gigSlice";
import { Link } from "react-router-dom";

export default function GigList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.gigs);

  useEffect(() => {
    dispatch(getGigs());
  }, [dispatch]);

  if (loading) {
    return <p className="p-6">Loading gigs...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Open Gigs</h1>

      {list.length === 0 ? (
        <p className="text-gray-500">No gigs available</p>
      ) : (
        <div className="space-y-4">
          {list.map((gig) => (
            <Link
              key={gig._id}
              to={`/gigs/${gig._id}`}
              className="block border p-4 rounded hover:bg-gray-50"
            >
              <h2 className="font-semibold">{gig.title}</h2>
              <p className="text-gray-600">{gig.description}</p>
              <p className="text-sm mt-1">Budget: ${gig.budget}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

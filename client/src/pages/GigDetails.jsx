import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { addBid, getBids, hire } from "../features/bids/bidSlice";


export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const bidsState = useSelector((s) => s.bids);

  // ALWAYS normalize bids into array
  const bids = Array.isArray(bidsState.list) ? bidsState.list : [];
  const bidsLoading = bidsState.loading;

  const [gig, setGig] = useState(null);
  const [form, setForm] = useState({ message: "", price: "" });
  const [loading, setLoading] = useState(false);

  // Fetch gig details
  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
      } catch {
        toast.error("Gig not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, navigate]);

  // Fetch bids ONLY if owner
  useEffect(() => {
    if (
      gig &&
      user &&
      gig.ownerId?._id === user._id
    ) {
      dispatch(getBids(id));
    }
  }, [gig, user, id, dispatch]);

  const isOwner = user && gig?.ownerId?._id === user._id;

  const submitBidHandler = async (e) => {
    e.preventDefault();
    const res = await dispatch(addBid({ ...form, gigId: id }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Bid submitted successfully");
      setForm({ message: "", price: "" });
    } else {
      toast.error(res.payload || "Bid failed");
    }
  };

  const hireHandler = async (bidId) => {
    const res = await dispatch(hire(bidId));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Freelancer hired! 🎉");
    } else {
      toast.error("Hiring failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50">
  

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-gray-500 hover:text-black mb-6"
        >
          ← Back to Gigs
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{gig.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${gig.status === 'open'
                    ? 'bg-green-50 text-green-600 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                  {gig.status.toUpperCase()}
                </span>
              </div>

              <div className="text-gray-600 whitespace-pre-wrap">
                {gig.description}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>Posted by {gig.ownerId.name}</span>
                <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Bids Section (Owner Only) */}
            {isOwner && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  Received Bids
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{bids.length}</span>
                </h2>

                {bidsLoading ? (
                  <p className="text-gray-500">Loading bids...</p>
                ) : bids.length === 0 ? (
                  <div className="card text-center py-12 text-gray-500">
                    No bids received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid._id} className="card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold">{bid.freelancerId.name}</h3>
                            <p className="text-sm text-gray-500">{bid.freelancerId.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${bid.price}</p>
                            <span className={`text-xs font-medium uppercase ${bid.status === 'hired' ? 'text-green-600' :
                                bid.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                              {bid.status}
                            </span>
                          </div>
                        </div>

                        <p className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm mb-4">
                          "{bid.message}"
                        </p>

                        {gig.status === "open" && bid.status === "pending" && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => hireHandler(bid._id)}
                              className="btn-primary"
                            >
                              Hire Freelancer
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Budget</h3>
              <p className="text-3xl font-bold">${gig.budget}</p>
            </div>

            {/* Bid Form (Freelancer Only) */}
            {!isOwner && gig.status === "open" && (
              <div className="card bg-blue-50 border-blue-100">
                <h3 className="font-bold text-lg mb-4">Submit a Proposal</h3>
                <form onSubmit={submitBidHandler} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Price ($)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 p-2 rounded-lg"
                      placeholder="e.g. 500"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cover Letter</label>
                    <textarea
                      className="w-full border border-gray-200 p-2 rounded-lg h-32"
                      placeholder="Explain why you're the best fit..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <button className="btn-primary w-full">
                    Submit Proposal
                  </button>
                </form>
              </div>
            )}

            {!isOwner && gig.status !== "open" && (
              <div className="card bg-gray-100 text-center">
                <p className="font-medium text-gray-600">This gig is closed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

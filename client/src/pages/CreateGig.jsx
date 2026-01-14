import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig } from "../features/gigs/gigSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function CreateGig() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.gigs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(addGig(form));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Gig posted successfully! 🚀");
      navigate("/");
    } else {
      toast.error(res.payload || "Failed to post gig");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50">
      

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Gig</h1>
          <p className="text-gray-500">Describe your project and set your budget</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="e.g. Build a React e-commerce website"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[150px]"
                placeholder="Detail the requirements, deliverables, and timeline..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget ($)</label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="1000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Gig"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

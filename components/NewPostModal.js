import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function NewPostModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!title || !body) {
      setError("Title and body are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "secret123", // fallback
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onSuccess(data); // send new post to parent
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
              <Dialog.Title className="text-lg font-bold mb-4">
                ✍️ Create New Post
              </Dialog.Title>

              {error && <p className="text-red-600 mb-2">{error}</p>}

              <label className="block mb-2">
                <span className="text-sm text-gray-700">Title</span>
                <input
                  className="mt-1 w-full p-2 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </label>

              <label className="block mb-4">
                <span className="text-sm text-gray-700">Body</span>
                <textarea
                  className="mt-1 w-full p-2 border rounded"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your content..."
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

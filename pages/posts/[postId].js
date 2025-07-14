import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadWasmModule } from "@/utils/loadWasm";

export default function PostDetails() {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [cppWordCount, setCppWordCount] = useState(null);

  useEffect(() => {
    if (!postId) return;

    async function fetchPost() {
      console.log("Fetching post with ID:", postId);
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/${postId}');
      const data = await res.json();
      console.log("Fetched post data:", data);
      setPost(data);
      setNewTitle(data?.title || "");
      setLoading(false);

      const wasm = await loadWasmModule();
      const cppWordCount = wasm.countWords(data.body);
      console.log("Word Count from C++:", cppWordCount);
      setCppWordCount(cppWordCount);
    }

    fetchPost();
  }, [postId]);

  async function handleSaveTitle() {
    const res = await fetch("/api/posts/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId, title: newTitle }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Title updated in Supabase!");
    } else {
      alert('Error: ${result.error}');
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch('/api/posts/${postId}', {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      },
    });

    const result = await res.json();
    if (!res.ok) {
      alert("Failed to delete post");
      console.error(result.error);
      return;
    }

    alert("Post deleted");
    router.push("/");
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">📝 Post Details</h1>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Post ID:</strong> {post.id}</p>
        <p><strong>Original Title:</strong> {post.title || "No title found"}</p>

        <label className="block mt-4">
          <span className="text-gray-700">Edit Title:</span>
          <input
            className="block w-full mt-1 p-2 border rounded"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </label>

        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSaveTitle}
          >
            Save Title
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete Post
          </button>
        </div>

        <p className="mt-4"><strong>Body:</strong></p>
        <p className="bg-gray-100 p-3 rounded">{post.body}</p>

        <div className="mt-4">
          <strong>Basic Analysis:</strong>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Word count (Using C++): {cppWordCount ?? "Loading..."}</li>
            <li>Title length: {newTitle ? newTitle.length : 0} characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

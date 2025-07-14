import { useState, useEffect } from "react";
import Link from "next/link";
import NewPostModal from "@/components/NewPostModal";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error.message);
      } else {
        setPosts(data);
      }
    }

    fetchPosts();
  }, []);

  // Pagination logic modified
  const start = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(start, start + postsPerPage);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">📄 All Posts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          New Post
        </button>
      </div>

      {/* Post Table */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-2">{post.id}</td>
                <td className="p-2">{post.title}</td>
                <td className="p-2">
                  <Link
                    href={'/posts/${post.id}'}
                    className="text-blue-500 underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination new */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
          setShowModal(false);
        }}
      />
    </div>
  );
}

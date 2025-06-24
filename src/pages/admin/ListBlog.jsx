import { useEffect, useState } from "react";
import BlogTableItem from "./BlogTableItem";
import axios from "axios";
import Loader from "../../components/Spinner";
import {
  FileText,
  RefreshCw,
  AlertCircle,
  Calendar,
  Eye,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    setError(null);

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoadingBlogs(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/user/get/${userId}`,
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      setBlogs(data);
      console.log("blogs fetched successfully", data);
    } catch (error) {
      console.error("error fetching blogs:", error);
      setError("An error occurred while fetching blogs.");
    } finally {
      setLoadingBlogs(false);
    }
  };
  const handleDelete = async (blogId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/delete/${blogId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // refresh list
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
          </div>
          <p className="text-gray-600 ml-11">
            Manage and organize all your blog content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-800">
                  {blogs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-800">
                  {blogs.filter((blog) => blog.published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-800">
                  {blogs.filter((blog) => !blog.isPublished).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loadingBlogs ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader
                loading={loadingBlogs}
                spinnerSize="md"
                spinnerColor="text-blue-500"
                message="Loading your blogs..."
              />
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={fetchBlogs}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="bg-primary text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Blog Posts</h2>
                <div className="flex items-center gap-2 text-blue-100">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Manage</span>
                </div>
              </div>
            </div>

            {blogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start creating your first blog post to see it here.
                </p>
                <button
                  className="px-6 py-3 bg-primary text-white rounded-full cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => navigate("/admin/addBlog")}
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Blog Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog, index) => {
                      return (
                        <BlogTableItem
                          key={blog.id}
                          blog={blog}
                          fetchBlogs={fetchBlogs}
                          onDelete={() => handleDelete(blog.id)}
                          index={index + 1}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        {!loadingBlogs && !error && blogs.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {blogs.length} blog post{blogs.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBlog;

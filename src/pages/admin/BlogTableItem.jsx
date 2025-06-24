import { useNavigate } from "react-router-dom"; 
import { Trash2, Eye, Globe, GlobeIcon as GlobeOff } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const BlogTableItem = ({ blog, fetchBlogs, index, onDelete }) => {
  const { title, createdAt, image, subTitle } = blog
  const BlogDate = new Date(createdAt)
  const navigate = useNavigate(); 
  const publish = true
  const unpublish = false

  const changePublish = async (blogId, isPublished) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/setpublish/${blogId}`,
        { isPublished },
        {
          withCredentials: true,
        },
      )
      const data = res.data
      fetchBlogs()
      toast.success(isPublished ? "Blog published successfully!" : "Blog unpublished successfully!")
      console.log(data)
    } catch (error) {
      console.error("error changing blogs publish status:", error)
      toast.error("An error occurred while updating publish status")
    }
  }
  const handleDelete = async (blogId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blog/delete/${blogId}`, {
      withCredentials: true,
    });
    toast.success("Blog deleted successfully!");
    fetchBlogs(); // refresh list
  } catch (error) {
    console.error("Error deleting blog:", error);
    toast.error("Failed to delete blog");
  }
};

  const handleView = () => {
    navigate(`/blog/${blog.id}`);
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }


  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index}</td>

      <td className="px-6 py-4">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-lg object-cover mr-4 border-2 border-gray-200"
            src={image || "/placeholder.svg?height=48&width=48"}
            alt={title}
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 truncate max-w-xs" title={title}>
              {title}
            </div>
            {subTitle && (
              <div className="text-sm text-gray-500 truncate max-w-xs mt-1" title={subTitle}>
                {subTitle}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">{formatDate(BlogDate)}</td>

      <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
            blog.published
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-orange-100 text-orange-800 border border-orange-200"
          }`}
        >
          {blog.published ? (
            <>
              <Globe className="h-3 w-3" />
              Published
            </>
          ) : (
            <>
              <GlobeOff className="h-3 w-3" />
              Draft
            </>
          )}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          {/* View Button */}
          <button
          onClick={handleView}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
            title="View blog"
          >
            <Eye className="h-3 w-3" />
            View
          </button>

          {/* Publish/Unpublish Button */}
          <button
            onClick={() => (blog.published ? changePublish(blog.id, unpublish) : changePublish(blog.id, publish))}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              blog.published
                ? "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300"
                : "text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
            }`}
            title={blog.published ? "Unpublish blog" : "Publish blog"}
          >
            {blog.published ? (
              <>
                <GlobeOff className="h-3 w-3" />
                Unpublish
              </>
            ) : (
              <>
                <Globe className="h-3 w-3" />
                Publish
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
            title="Delete blog"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem

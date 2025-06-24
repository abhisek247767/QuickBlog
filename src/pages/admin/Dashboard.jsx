"use client"

import { useEffect, useState } from "react"
import BlogTableItem from "./BlogTableItem"
import axios from "axios"
import Loader from "../../components/Spinner"
import {
  BarChart3,
  FileText,
  MessageCircle,
  FileX,
  TrendingUp,
  Calendar,
  RefreshCw,
  AlertCircle,
  Eye,
  Settings,
} from "lucide-react"

const Dashboard = () => {
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [blogsNo, setBlogsNo] = useState(0)
  const [comments, setComments] = useState(0)
  const [drafts, setDrafts] = useState(0)
  const [published, setPublished] = useState(0)

  const [blogs, setBlogs] = useState([])

  const userId = localStorage.getItem("userId")

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return

    setDeleting(true)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blog/delete/${blogToDelete.id}`, {
        withCredentials: true,
      })

      // Remove the deleted blog from the state and recalculate stats
      const updatedBlogs = blogs.filter((blog) => blog.id !== blogToDelete.id)
      setBlogs(updatedBlogs)
      setBlogsNo(updatedBlogs.length)

      const totalComments = updatedBlogs.reduce((sum, blog) => {
        return sum + (blog.commentIds ? blog.commentIds.length : 0)
      }, 0)
      setComments(totalComments)

      const totalDrafts = updatedBlogs.reduce((sum, blog) => {
        return sum + (blog.published === false ? 1 : 0)
      }, 0)
      setDrafts(totalDrafts)

      const totalPublished = updatedBlogs.reduce((sum, blog) => {
        return sum + (blog.published === true ? 1 : 0)
      }, 0)
      setPublished(totalPublished)

      setShowDeleteModal(false)
      setBlogToDelete(null)
      console.log("Blog deleted successfully")
    } catch (error) {
      console.error("Error deleting blog:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setBlogToDelete(null)
  }

  const fetchBlogs = async () => {
    setLoadingBlogs(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.")
      setLoadingBlogs(false)
      return
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/user/get/${userId}`, {
        withCredentials: true,
      })
      const data = res.data
      setBlogs(data)
      setBlogsNo(data.length)

      const totalComments = data.reduce((sum, blog) => {
        return sum + (blog.commentIds ? blog.commentIds.length : 0)
      }, 0)
      setComments(totalComments)

      const totalDrafts = data.reduce((sum, blog) => {
        return sum + (blog.published === false ? 1 : 0)
      }, 0)
      setDrafts(totalDrafts)

      const totalPublished = data.reduce((sum, blog) => {
        return sum + (blog.published === true ? 1 : 0)
      }, 0)
      setPublished(totalPublished)

      console.log("blogs fetched successfully", data)
    } catch (error) {
      console.error("error fetching blogs:", error)
      setError("An error occurred while fetching blogs.")
    } finally {
      setLoadingBlogs(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <p className="text-gray-600 ml-11">Overview of your blog performance and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Blogs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-800">{blogsNo}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">All time</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Published Blogs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-gray-800">{published}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Eye className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Live posts</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Comments</p>
                <p className="text-3xl font-bold text-gray-800">{comments}</p>
                <div className="flex items-center gap-1 mt-2">
                  <MessageCircle className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">Engagement</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-800">{drafts}</p>
                <div className="flex items-center gap-1 mt-2">
                  <FileX className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">Unpublished</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FileX className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Latest Blogs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-primary text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Latest Blog Posts</h2>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Manage</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {loadingBlogs ? (
            <div className="p-12">
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
            <div className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
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
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-6">Start creating your first blog post to see it here.</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.slice(0, 5).map((blog, index) => {
                    return (
                      <BlogTableItem
                        key={blog.id}
                        blog={blog}
                        fetchBlogs={fetchBlogs}
                        index={index + 1}
                        onDelete={() => handleDeleteClick(blog)}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* View All Link */}
          {!loadingBlogs && !error && blogs.length > 5 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View all {blogs.length} blog posts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        {!loadingBlogs && !error && blogs.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-red-100 rounded-full">
                    <FileX className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Blog Post</h3>
                </div>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={deleting}
                >
                  <FileX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </p>
                {blogToDelete && (
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="font-medium text-gray-800 truncate">"{blogToDelete.title}"</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {blogToDelete.published ? "Published" : "Draft"} • {blogToDelete.category}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  disabled={deleting}
                >
                  <FileX className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

"use client"

import { useEffect, useState } from "react"
import CommentTableItem from "./CommentTableItem"
import axios from "axios"
import Loader from "../../components/Spinner"
import { MessageCircle, CheckCircle, XCircle, Filter, RefreshCw, AlertCircle, Users, Clock } from "lucide-react"

const Comments = () => {
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState("Approved")
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const userId = localStorage.getItem("userId")

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return

    setDeleting(true)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comment/delete/${commentToDelete.id}`, {
        withCredentials: true,
      })

      // Remove the deleted comment from the state
      setComments(comments.filter((comment) => comment.id !== commentToDelete.id))
      setShowDeleteModal(false)
      setCommentToDelete(null)
      console.log("Comment deleted successfully")
    } catch (error) {
      console.error("Error deleting comment:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setCommentToDelete(null)
  }

  const fetchComments = async () => {
    setLoadingBlogs(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.")
      setLoadingBlogs(false)
      return
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/get/user/${userId}`, {
        withCredentials: true,
      })
      const data = res.data
      setComments(data)
      console.log("comments fetched successfully", data)
    } catch (error) {
      console.error("error fetching comments:", error)
      setError("An error occurred while fetching comments.")
    } finally {
      setLoadingBlogs(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  // Calculate stats
  const approvedComments = comments.filter((comment) => comment.approved === true)
  const pendingComments = comments.filter((comment) => comment.approved === false)
  const filteredComments = comments.filter((comment) => {
    if (filter === "Approved") return comment.approved === true
    return comment.approved === false
  })

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Comments Management</h1>
          </div>
          <p className="text-gray-600 ml-11">Manage and moderate all comments on your blog posts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-800">{comments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-800">{approvedComments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingComments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filter Comments</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("Approved")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                  filter === "Approved"
                    ? "bg-green-100 border-green-300 text-green-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedComments.length})
              </button>
              <button
                onClick={() => setFilter("Not Approved")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                  filter === "Not Approved"
                    ? "bg-orange-100 border-orange-300 text-orange-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Clock className="h-4 w-4" />
                Pending ({pendingComments.length})
              </button>
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
                message="Loading comments..."
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={fetchComments}
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
            <div className="bg-gradient-to-r from-primary to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {filter} Comments ({filteredComments.length})
                </h2>
                <div className="flex items-center gap-2 text-blue-100">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Manage</span>
                </div>
              </div>
            </div>

            {filteredComments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <MessageCircle className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No {filter.toLowerCase()} comments</h3>
                <p className="text-gray-600 mb-6">
                  {filter === "Approved"
                    ? "No approved comments to display."
                    : "No pending comments waiting for approval."}
                </p>
                {filter === "Not Approved" && (
                  <button
                    onClick={() => setFilter("Approved")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Approved Comments
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Blog Title & Comment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComments.map((comment, index) => (
                      <CommentTableItem
                        key={comment.id}
                        comment={comment}
                        index={index + 1}
                        fetchComments={fetchComments}
                        onDelete={() => handleDeleteClick(comment)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        {!loadingBlogs && !error && filteredComments.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredComments.length} {filter.toLowerCase()} comment
              {filteredComments.length !== 1 ? "s" : ""} out of {comments.length} total
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Comment</h3>
                </div>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={deleting}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                {commentToDelete && (
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="font-medium text-gray-800 truncate">"{commentToDelete.content}"</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By {commentToDelete.name} • {commentToDelete.approved ? "Approved" : "Pending"}
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
                  <XCircle className="h-4 w-4" />
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

export default Comments

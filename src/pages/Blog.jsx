"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Moment from "moment"
import Footer from "../components/Footer"
import axios from "axios"
import Loader from "../components/Spinner"
import toast from "react-hot-toast"
import {
  Calendar,
  User,
  MessageCircle,
  Share2,
  Sparkles,
  Send,
  Facebook,
  Twitter,
  Globe,
  Clock,
  Tag,
  ArrowLeft,
  BookOpen,
} from "lucide-react"

const Blog = () => {
  const { id } = useParams()

  const userId = localStorage.getItem("userId")

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [error, setError] = useState("")
  const [addCommentError, setAddCommentError] = useState("")
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [blogSummary, setBlogSummary] = useState(null)
  const [addingComment, setAddingComment] = useState(false)

  useEffect(() => {
    fetchBlogData()
    fetchCommentsData()
  }, [id])

  const fetchBlogData = async () => {
    setLoadingBlogs(true)
    setError(null)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/get/${id}`, {
        withCredentials: true,
      })
      const blogData = await res.data
      setData(blogData)
      console.log("blog fetched successfully ", blogData)
    } catch (error) {
      console.error("error fetching blog: ", error)
      toast.error("An error occurred while fetching the blog.")
      setError("An error occurred while fetching blog.")
    } finally {
      setLoadingBlogs(false)
    }
  }

  const fetchCommentsData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/get/${id}`, {
        withCredentials: true,
      })
      const commentData = await res.data
      setComments(commentData)
      console.log("comments fetched successfully", commentData)
    } catch (error) {
      console.error("error fetching comments: ", error)
      toast.error("Error fetching comments.")
    }
  }

  const [name, setName] = useState("")
  const [content, setContent] = useState("")

  const addComment = async (e) => {
    e.preventDefault()
    setAddingComment(true)
    setAddCommentError(null)
    if (userId === null) {
      setAddCommentError("Please login to comment!")
      toast.error("Please login to comment!")
      setAddingComment(false)
      return
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/post`,
        { name, content, blogId: id },
        {
          withCredentials: true,
        },
      )
      const commentDat = await res.data
      console.log("comments added successfully", commentDat)
      if (userId) {
        fetchCommentsData()
      }
      setName("")
      setContent("")
      toast.success("Comment added successfully!")
    } catch (error) {
      console.error("error adding comment: ", error)
      let errorMessage = "Failed to add comment."
      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string" ? error.response.data : error.response.data.message || errorMessage
      }
      toast.error(errorMessage)
    } finally {
      setAddingComment(false)
    }
  }

  const handleSummarize = async () => {
    if (!data || !data.description) {
      toast.error("Blog content not available for summarization.")
      return
    }
    setIsSummarizing(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/summarize`,
        { content: data.description },
        { withCredentials: true },
      )
      const summaryData = res.data
      setBlogSummary(summaryData)
      toast.success("Blog summarized successfully!")
    } catch (error) {
      console.error("Error summarizing blog:", error)
      let errorMessage = "Failed to summarize blog."
      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string" ? error.response.data : error.response.data.message || errorMessage
      }
      toast.error(errorMessage)
      setBlogSummary(null)
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <Navbar />

      {loadingBlogs ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader loading={loadingBlogs} spinnerSize="lg" spinnerColor="text-blue-500" message="Loading blog..." />
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Blog Not Found</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={fetchBlogData}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </button>

              {/* Blog Meta */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Published {Moment(data.createdAt).format("MMMM Do, YYYY")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>By {data.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span>{comments.length} Comments</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex justify-center mb-6">
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Tag className="h-3 w-3" />
                    {data.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">{data.title}</h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{data.subTitle}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-6 pb-16">
            {/* Featured Image */}
            <div className="mb-12">
              <img
                alt={data.title}
                className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg"
                src={data.image || "/placeholder.svg"}
              />
            </div>

            {/* Blog Content */}
            <article className="prose prose-lg max-w-none mb-16">
              <div
                dangerouslySetInnerHTML={{ __html: data.description }}
                className="rich-text text-gray-800 leading-relaxed"
              />
            </article>

            {/* AI Summarization Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-16">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Want a Quick Summary?</h3>
                <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                  Get an AI-generated summary of this blog post instantly and save your reading time!
                </p>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSummarizing ? (
                    <>
                      <Loader loading={true} spinnerSize="sm" spinnerColor="text-white" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Summarize with AI
                    </>
                  )}
                </button>

                {blogSummary && (
                  <div className="mt-8 p-6 bg-white border border-blue-300 rounded-xl shadow-sm">
                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      AI-Generated Summary
                    </h4>
                    <p className="text-gray-800 leading-relaxed text-left">{blogSummary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h3>
              </div>

              {comments.length > 0 ? (
                <div className="space-y-6 mb-12">
                  {comments.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{Moment(item.createdAt).fromNow()}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl mb-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}

              {/* Add Comment Form */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Add Your Comment</h4>
                <form onSubmit={addComment} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      placeholder="Enter your name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all resize-none"
                      required
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  {addCommentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{addCommentError}</p>
                    </div>
                  )}

                  <button
                    disabled={addingComment}
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    {addingComment ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Share2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Share This Article</h3>
              </div>
              <p className="text-gray-600 mb-6">Help others discover this content by sharing it on social media</p>
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Globe className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default Blog

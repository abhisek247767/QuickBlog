"use client"

import { useEffect, useRef, useState } from "react"
import { assets, blogCategories } from "../../assets/assets"
import Quill from "quill"
import axios from "axios"
import toast from "react-hot-toast"
import { Upload, Sparkles, Trash2, Save, ImageIcon, FileText, Tag, Globe, X } from "lucide-react"

const AddBlog = () => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const userId = localStorage.getItem("userId")

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [category, setCategory] = useState("Startup")
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addingBlog, setAddingBlog] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const publicKey = `${import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}`

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setAddingBlog(true)

    const blogContent = quillRef.current?.root.innerHTML

    try {
      if (!userId) {
        toast.error("User ID not found. Please log in.")
        return
      }
      const imageUrl = await uploadImageToImageKit()

      const blogPayload = {
        title,
        subTitle,
        category,
        description: blogContent,
        isPublished,
        image: imageUrl,
        userId: userId,
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blog/create`, blogPayload, {
        withCredentials: true,
      })
      const data = await res.data
      clearForm()
      toast.success("Blog created successfully")
    } catch (error) {
      console.error("Failed to upload blog:", error)
      toast.error("Error creating blog")
    } finally {
      setAddingBlog(false)
    }
  }

  const uploadImageToImageKit = async () => {
    try {
      const authRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/imagekit/auth`, {
        withCredentials: true,
      })
      const authData = await authRes.data
      console.log(authData)

      const formData = new FormData()
      formData.append("file", image)
      formData.append("fileName", `${Date.now()}-${image.name}`)
      formData.append("publicKey", publicKey)
      formData.append("signature", authData.signature)
      formData.append("expire", authData.expire)
      formData.append("token", authData.token)
      console.log(formData)
      const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData)

      const result = await res.data
      return result.url
    } catch (error) {
      toast.error("Error uploading image")
    }
  }

  const genrateContent = async () => {
    if (!title) return toast.error("Please enter a title")
    setLoading(true)
    toast.promise(
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/ai/generateblog`,
          { title },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.data) {
            console.log(res.data)
            quillRef.current.root.innerHTML = res.data
          }
          return res.data
        })
        .finally(() => {
          setLoading(false)
        }),
      {
        loading: "Generating blog content...",
        success: <b>Blog generation successful!</b>,
        error: <b>Failed to generate blog content.</b>,
      },
    )
  }

  const clearForm = () => {
    setImage(false)
    setTitle("")
    setSubTitle("")
    setCategory("Startup")
    setIsPublished(false)
    if (quillRef.current) {
      quillRef.current.root.innerHTML = ""
    }
  }

  const handleClearForm = () => {
    clearForm()
    setShowDeleteModal(false)
    toast.success("Form cleared successfully")
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" })
    }
  }, [])

  return (
    <div className="flex-1 bg-blue-50/30 text-gray-700 h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-6">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="h-6 w-6" />
              Create New Blog Post
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={onSubmitHandler} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="text-base font-semibold flex items-center gap-2 text-gray-700">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  Upload Thumbnail
                </label>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <label htmlFor="image" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      <img
                        alt="Upload preview"
                        className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                        src={!image ? assets.upload_area : URL.createObjectURL(image)}
                      />
                      <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {!image ? "Click to upload image" : "Click to change image"}
                        </span>
                      </div>
                    </div>
                    <input
                      id="image"
                      hidden
                      required
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              {/* Title Section */}
              <div className="space-y-3">
                <label htmlFor="title" className="text-base font-semibold text-gray-700 block">
                  Blog Title
                </label>
                <input
                  id="title"
                  placeholder="Enter your blog title..."
                  required
                  className="w-full text-base h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Subtitle Section */}
              <div className="space-y-3">
                <label htmlFor="subtitle" className="text-base font-semibold text-gray-700 block">
                  Subtitle
                </label>
                <input
                  id="subtitle"
                  placeholder="Enter a compelling subtitle..."
                  required
                  className="w-full text-base h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                />
              </div>

              {/* Content Editor Section */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-gray-700 block">Blog Content</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="h-80 relative">
                    <div ref={editorRef} className="h-full"></div>
                    <button
                      disabled={loading}
                      onClick={genrateContent}
                      type="button"
                      className="absolute bottom-3 right-3 bg-primary text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Sparkles className="h-4 w-4" />
                      {loading ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="space-y-3">
                <label className="text-base font-semibold flex items-center gap-2 text-gray-700">
                  <Tag className="h-4 w-4 text-blue-600" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all bg-white"
                >
                  <option value="">Select a category</option>
                  {blogCategories.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Publish Section */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Globe className="h-5 w-5 text-blue-600" />
                <label htmlFor="publish" className="text-base font-medium cursor-pointer text-gray-700">
                  Publish immediately
                </label>
                <input
                  id="publish"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  disabled={addingBlog}
                  type="submit"
                  className="flex-1 h-12 bg-primary text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {addingBlog ? "Creating Blog..." : "Create Blog"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="h-12 px-6 border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Clear Form</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to clear all form data? This action cannot be undone and you will lose all your
                current progress.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearForm}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddBlog

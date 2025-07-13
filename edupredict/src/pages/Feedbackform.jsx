
import React, { useState } from 'react'
import { PencilIcon, Send, X } from 'lucide-react'

function Feedbackform({ onClose }) {
   const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log({
      email,
      subject,
      message,
    })
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-[#f8f6e9] w-full max-w-md rounded-lg shadow-xl relative animate-fade-in">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex items-center mb-6">
            <PencilIcon className="text-purple-500 mr-2" size={20} />
            <h2 className="text-2xl font-serif text-gray-800">
              Submit Your Feedback
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-1">
                Receiver Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Receiver Email"
                className="w-full p-3 border border-purple-300 rounded-full bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-600 mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="A brief summary of your feedback"
                className="w-full p-3 border border-purple-300 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-600 mb-1">
                Your Feedback / Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details here..."
                rows={6}
                className="w-full p-3 border border-purple-300 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4f46e5] hover:bg-purple-500 text-white py-3 px-4 rounded-full flex items-center justify-center transition-colors"
            >
              <Send size={18} className="mr-2" />
              Send Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Feedbackform

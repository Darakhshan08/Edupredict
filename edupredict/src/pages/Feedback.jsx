import React, { useState } from 'react'
import {
  MessageSquareIcon,
  Send,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  HandIcon,
} from 'lucide-react'
import Feedbackform from './Feedbackform';

function Feedback() {
     const [isModalOpen, setIsModalOpen] = useState(false)
  // Initial feedback data
  const [feedbackItems, setFeedbackItems] = useState([
    {
      id: 1,
      role: "Admin",
      title: "Feedback",
      from: "Admin (admin@gmail.com)",
      received: "2023-07-02 00:51:42",
      content: "Feedback1",
     
    },
    {
      id: 2,
      role: "Teacher",
      title: "Need Improvement",
      from: "Bilal Asif (bilalasif@edu.pk)",
      received: "2023-06-30 04:22:11",
      content: "We need to improve the user interface for better accessibility.",
     
    },
    {
      id: 3,
      role: "Admin",
      title: "Warning",
      from: "Admin (admin@gmail.com)",
      received: "2023-06-30 03:47:33",
      content: "This is a warning about the system performance.",
     
    }
  ]);
  // Function to delete a feedback item
  const handleDelete = (id) => {
    setFeedbackItems(feedbackItems.filter(item => item.id !== id));
  };
  // Function to toggle view status
  const handleView = (id) => {
    setFeedbackItems(feedbackItems.map(item => 
      item.id === id ? { ...item, viewed: true } : item
    ));
  };
  // Function to toggle expanded status
  const toggleExpand = (id) => {
    setFeedbackItems(feedbackItems.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };
  return (
    <div className="flex w-full min-h-screen justify-center items-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <MessageSquareIcon className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Feedback Inbox
              </h1>
              <p className="text-gray-500">
                Review and manage feedback submitted by users.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-[#fafaea] text-gray-700 py-2 px-4 pr-8 rounded-lg border border-gray-200 focus:outline-none">
                <option>All</option>
                <option>Admin</option>
                <option>Teacher</option>
                <option>Student</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <button className="bg-[#4f46e5] hover:bg-purple-500 text-white py-2 px-5 rounded-xl flex items-center gap-2"
             onClick={() => setIsModalOpen(true)}
            >
              <Send className="w-4 h-4" />
              <span>Send Feedback</span>
            </button>
            {isModalOpen && <Feedbackform onClose={() => setIsModalOpen(false)} />}
          </div>
        </div>
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <div key={item.id} className="bg-gray-50  border-2 rounded-2xl p-5">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${item.role === "Admin" ? "bg-purple-200 text-purple-800" : "bg-blue-200 text-blue-800"} text-md px-3 py-1 rounded-full`}>
                      {item.role}
                    </span>
                    <h3 className="text-gray-700 font-bold">{item.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">
                    From: {item.from}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Received: {item.received}
                  </p>
                  {item.expanded && (
                    <p className="text-gray-700 mt-3">{item.content}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  {item.role === "Admin" && item.expanded ? (
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => {/* Admin action */}}
                    >
                      <HandIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      className={`${item.viewed ? "text-gray-400" : "text-blue-500"} hover:text-gray-600`}
                      onClick={() => handleView(item.id)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {item.expanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {feedbackItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No feedback items available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback
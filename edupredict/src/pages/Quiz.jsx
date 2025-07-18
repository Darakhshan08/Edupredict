import React, { useEffect, useState, useRef } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChevronDown, Download } from 'lucide-react'
const data = [
  {
    name: 'AI Fundamentals',
    score: 4,
  },
  {
    name: 'AI Frameworks',
    score: 12,
  },
  {
    name: 'Data Science',
    score: 12,
  },
  {
    name: 'Machine Learning',
    score: 13,
  },
  {
    name: 'Web Development',
    score: 19,
  },
]
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
 const quizData = [
    {
      name: 'AI Fundamentals',
      total: 4
    },
    {
      name: 'AI Fundamentals',
      total: 12
    },
    {
      name: 'Data Science',
      total: 12
    },
    {
      name: 'Machine Learning',
      total: 13
    },
    {
      name: 'Web Development',
      total: 10
    },
]
function Quiz() {
    const [selectedMonth, setSelectedMonth] = useState('Select Month')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const handleMonthSelect = (month) => {
    setSelectedMonth(month)
    setIsDropdownOpen(false)
  }

  return (
     <div className="flex w-full min-h-screen bg-[#f8f8ee] justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-medium text-gray-800">
            Quiz Performance
          </h1>
          <p className="text-gray-500">
            Monthly overview of total quiz scores by course
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedMonth}
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                {months.map((month) => (
                  <div
                    key={month}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMonthSelect(month)}
                  >
                    {month}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700">
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eaeaea"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#888',
                fontSize: 12,
              }}
            />
            <YAxis
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#888',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="score"
              fill="#a78bfa"
              radius={[4, 4, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
     <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quiz Breakdown
        </h2>
        <p className="text-gray-600 mb-6">
          Detailed quiz score for each course in the selected month.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                  Course
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                 Total
                </th>
              </tr>
            </thead>
            <tbody>
              {quizData.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-gray-800 border border-gray-300">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-[#a3a36d] border border-gray-300">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Quiz

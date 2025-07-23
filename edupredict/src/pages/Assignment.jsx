import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { DownloadIcon } from 'lucide-react'
import { fetch_assignment_summary } from '../Api/internal' // <-- yahan import karein

function Assignments() {
  const [assignmentData, setAssignmentData] = useState([])

  useEffect(() => {
    // Internal API function use karein
    fetch_assignment_summary()
      .then((res) => {
        // Agar response.data hai to use map karein
        const formatted = res.data.map((item) => ({
          name: item.preferred_course,
          total: item.assignments_completed,
          score: item.assignments_completed,
        }))
        setAssignmentData(formatted)
      })
      .catch((err) => {
        console.error('Failed to fetch assignment data:', err)
      })
  }, [])

  return (
    <div className="flex w-full min-h-screen justify-center items-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col gap-8">
          {/* Chart Section */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
                  Assignment Performance
                </h1>
                <p className="text-sm md:text-base text-gray-500">
                  Total assignments completed
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700 w-full sm:w-auto">
                  <DownloadIcon size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assignmentData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 40 }}
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
                    tick={{ fill: '#888', fontSize: 12 }}
                    height={50}
                  />
                  <YAxis
                    // domain ko dynamic bhi rakh sakte hain
                    domain={[0, Math.max(...assignmentData.map(d => d.total), 1000)]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border shadow p-2 rounded text-sm text-gray-700">
                            <p className="font-semibold">
                              Course: {payload[0].payload.name}
                            </p>
                            <p>Total assignments: {payload[0].payload.total}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#a78bfa"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Assignment Breakdown
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Total assignments completed
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border-b-2 border-gray-200">
                      Courses
                    </th>
                    <th className="py-3 px-4 text-right text-gray-600 font-medium border-b-2 border-gray-200">
                      Total Assignments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-700">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assignments
import React from 'react'
import { ArrowUpIcon } from 'lucide-react'

const Course_demand = () => {
  const courseData = [
    {
      name: 'AI Fundamentals',
      count: 4,
      trend: 'increasing',
    },
    {
      name: 'Cloud Computing',
      count: 1,
      trend: 'increasing',
    },
    {
      name: 'Data Science',
      count: 1,
      trend: 'increasing',
    },
    {
      name: 'Machine Learning',
      count: 3,
      trend: 'increasing',
    },
    {
      name: 'Video Editing',
      count: 3,
      trend: 'increasing',
    },
    {
      name: 'Web Development',
      count: 4,
      trend: 'increasing',
    },
  ]

  const maxCount = Math.max(...courseData.map((course) => course.count))

  return (
    <div className="rounded-lg p-4 min-h-screen w-full md:p-8">
     <div className="max-w-7xl mx-auto space-y-6">
        {/* Enrollment Chart */}
        <div className="w-full bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800">
            Course Demand & Enrollment Trends
          </h2>
          <div className="mt-6">
            {courseData.map((course, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">{course.name}</span>
                  <div className="flex-1 ml-2">
                    <div
                      className="bg-purple-300 h-6 rounded-md"
                      style={{
                        width: `${(course.count / maxCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 ml-32 flex justify-between">
              {[0, 1, 2, 3, 4].map((value) => (
                <div key={value} className="text-xs text-gray-400">
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Course List */}
        <div className="w-full bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800">Detailed Course List</h2>
          <p className="text-sm text-gray-500 mt-1">
            View enrollment counts and interest trends for each course.
          </p>
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 mb-2 text-sm text-gray-600">
              <div>Course Name</div>
              <div>Enrollment Count</div>
              <div>Interest Trend</div>
            </div>
            {courseData.map((course, index) => (
              <div
                key={index}
                className="grid grid-cols-3 py-3 text-sm border-b border-gray-200 last:border-0"
              >
                <div className="font-medium text-gray-800">{course.name}</div>
                <div className="text-center">{course.count}</div>
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ArrowUpIcon size={12} className="mr-1" /> Increasing
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course_demand
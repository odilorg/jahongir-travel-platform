"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, FolderOpen, MessageSquare, Calendar, TrendingUp, Users } from "lucide-react"

interface Stats {
  tours: number
  categories: number
  reviews: number
  bookings: number
  users: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    tours: 0,
    categories: 0,
    reviews: 0,
    bookings: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all data to calculate stats
      const [toursRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:4000/api/tours'),
        fetch('http://localhost:4000/api/categories')
      ])

      const toursData = await toursRes.json()
      const categoriesData = await categoriesRes.json()

      // Calculate total reviews from tours
      const totalReviews = toursData.data?.reduce((sum: number, tour: any) =>
        sum + (tour._count?.reviews || 0), 0) || 0

      setStats({
        tours: toursData.meta?.total || toursData.data?.length || 0,
        categories: categoriesData.length || 0,
        reviews: totalReviews,
        bookings: 0, // TODO: Implement bookings count
        users: 0 // TODO: Implement users count
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Tours",
      value: stats.tours,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Reviews",
      value: stats.reviews,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to JahongirTravel Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tours */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {stats.tours} active tours in the system
              </p>
              <a
                href="/admin/tours"
                className="inline-flex items-center text-primary hover:underline text-sm font-medium"
              >
                Manage Tours →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/tours"
                className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="font-medium text-gray-900">Add New Tour</div>
                <div className="text-sm text-gray-600">Create a new tour package</div>
              </a>
              <a
                href="/admin/categories"
                className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="font-medium text-gray-900">Manage Categories</div>
                <div className="text-sm text-gray-600">Organize tour categories</div>
              </a>
              <a
                href="/admin/reviews"
                className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="font-medium text-gray-900">Moderate Reviews</div>
                <div className="text-sm text-gray-600">Approve or reject reviews</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

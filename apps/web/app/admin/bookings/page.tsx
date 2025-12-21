"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, DollarSign } from "lucide-react"

export default function BookingsManagementPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">View and manage customer bookings</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 mb-6">
            Customer bookings will appear here once they start booking tours
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="p-4 border rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">0</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="p-4 border rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">0</div>
              <div className="text-sm text-gray-600">Active Tours</div>
            </div>
            <div className="p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">$0</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

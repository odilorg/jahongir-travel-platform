"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function UsersManagementPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage system users and administrators</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <p className="text-gray-600 mb-6">
            User authentication and management will be implemented here
          </p>
          <div className="text-sm text-gray-500">
            Features coming soon:
            <ul className="mt-4 space-y-2">
              <li>• User registration and authentication</li>
              <li>• Admin role management</li>
              <li>• User permissions</li>
              <li>• Activity logs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

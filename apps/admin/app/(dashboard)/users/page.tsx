'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users as UsersIcon, User, Mail, Shield, Calendar, Star, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
    reviews: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: User[]; pagination: any }>('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error('Users fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-24 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search'
                : 'No users registered yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-1">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Status Badges */}
                <div className="flex gap-2 flex-wrap">
                  {user.emailVerified && (
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {user.isActive ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-red-600">
                      Inactive
                    </Badge>
                  )}
                  {user.role === 'admin' && (
                    <Badge variant="outline" className="text-xs text-red-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                {user._count && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">Bookings</span>
                      </div>
                      <p className="text-lg font-semibold">{user._count.bookings || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Star className="h-3 w-3" />
                        <span className="text-xs">Reviews</span>
                      </div>
                      <p className="text-lg font-semibold">{user._count.reviews || 0}</p>
                    </div>
                  </div>
                )}

                {/* Registration Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredUsers.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      )}
    </div>
  );
}

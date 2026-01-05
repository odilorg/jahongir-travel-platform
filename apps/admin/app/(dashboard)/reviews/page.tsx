'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Check, X, Trash2, User, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  tour?: {
    id: string;
    titleEn: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await api.get<Review[]>('/reviews');
      setReviews(data);
    } catch (error: any) {
      toast.error('Failed to load reviews');
      console.error('Reviews fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/approve`, {});
      toast.success('Review approved');
      fetchReviews();
    } catch (error: any) {
      toast.error('Failed to approve review');
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/reject`, {});
      toast.success('Review rejected');
      fetchReviews();
    } catch (error: any) {
      toast.error('Failed to reject review');
      console.error('Reject error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error: any) {
      toast.error('Failed to delete review');
      console.error('Delete error:', error);
    }
  };

  const filterReviews = (status: string) => {
    return reviews.filter((review) => review.status === status);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">{review.user?.email}</p>
                </div>
              </div>
            </div>
            {renderStars(review.rating)}
          </div>

          {/* Tour Name */}
          {review.tour && (
            <div className="text-sm text-gray-600">
              Tour: <span className="font-medium">{review.tour.titleEn}</span>
            </div>
          )}

          {/* Comment */}
          <p className="text-gray-700">{review.comment}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(review.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {review.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(review.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(review.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              {review.status === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleReject(review.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              )}
              {review.status === 'REJECTED' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleApprove(review.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ status }: { status: string }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No {status.toLowerCase()} reviews</h3>
        <p className="text-muted-foreground">
          {status === 'PENDING'
            ? 'All reviews have been moderated'
            : `No reviews in ${status.toLowerCase()} status`}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-1">Moderate tour reviews and ratings</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="PENDING">
            Pending
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterReviews('PENDING').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="APPROVED">
            Approved
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterReviews('APPROVED').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterReviews('REJECTED').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Pending Reviews */}
        <TabsContent value="PENDING" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterReviews('PENDING').length === 0 ? (
            <EmptyState status="PENDING" />
          ) : (
            filterReviews('PENDING').map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        {/* Approved Reviews */}
        <TabsContent value="APPROVED" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterReviews('APPROVED').length === 0 ? (
            <EmptyState status="APPROVED" />
          ) : (
            filterReviews('APPROVED').map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        {/* Rejected Reviews */}
        <TabsContent value="REJECTED" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterReviews('REJECTED').length === 0 ? (
            <EmptyState status="REJECTED" />
          ) : (
            filterReviews('REJECTED').map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

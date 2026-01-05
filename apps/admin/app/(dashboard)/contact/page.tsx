'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, ExternalLink, Check, Calendar, User, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('NEW');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.get<ContactInquiry[]>('/contact');
      setInquiries(data);
    } catch (error: any) {
      toast.error('Failed to load inquiries');
      console.error('Contact fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResolved = async (id: string) => {
    try {
      await api.patch(`/api/contact/${id}/status`, { status: 'RESOLVED' });
      toast.success('Inquiry marked as resolved');
      fetchInquiries();
    } catch (error: any) {
      toast.error('Failed to update status');
      console.error('Update error:', error);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/api/contact/${id}/status`, { status: 'READ' });
      toast.success('Inquiry marked as read');
      fetchInquiries();
    } catch (error: any) {
      toast.error('Failed to update status');
      console.error('Update error:', error);
    }
  };

  const filterInquiries = (status: string) => {
    return inquiries.filter((inquiry) => inquiry.status === status);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'READ':
        return 'bg-gray-100 text-gray-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const InquiryCard = ({ inquiry }: { inquiry: ContactInquiry }) => (
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
                  <p className="font-semibold">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                  {inquiry.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {inquiry.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
          </div>

          {/* Subject */}
          <div>
            <p className="font-medium text-lg">{inquiry.subject}</p>
          </div>

          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(inquiry.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                asChild
              >
                <a href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}>
                  <Mail className="h-4 w-4 mr-1" />
                  Reply
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              {inquiry.status === 'NEW' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkRead(inquiry.id)}
                >
                  Mark Read
                </Button>
              )}
              {inquiry.status !== 'RESOLVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleMarkResolved(inquiry.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ status }: { status: string }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No {status.toLowerCase()} inquiries</h3>
        <p className="text-muted-foreground">
          {status === 'NEW'
            ? 'All inquiries have been reviewed'
            : `No inquiries in ${status.toLowerCase()} status`}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
        <p className="text-muted-foreground mt-1">Manage customer inquiries and messages</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="NEW">
            New
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterInquiries('NEW').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="READ">
            Read
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterInquiries('READ').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="RESOLVED">
            Resolved
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filterInquiries('RESOLVED').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* New Inquiries */}
        <TabsContent value="NEW" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterInquiries('NEW').length === 0 ? (
            <EmptyState status="NEW" />
          ) : (
            filterInquiries('NEW').map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))
          )}
        </TabsContent>

        {/* Read Inquiries */}
        <TabsContent value="READ" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterInquiries('READ').length === 0 ? (
            <EmptyState status="READ" />
          ) : (
            filterInquiries('READ').map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))
          )}
        </TabsContent>

        {/* Resolved Inquiries */}
        <TabsContent value="RESOLVED" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterInquiries('RESOLVED').length === 0 ? (
            <EmptyState status="RESOLVED" />
          ) : (
            filterInquiries('RESOLVED').map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

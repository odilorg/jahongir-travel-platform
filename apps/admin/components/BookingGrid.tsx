'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  X,
  Check,
  CreditCard,
  RotateCcw,
  Pencil,
  Save,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  tour: {
    id: string;
    title: string;
    slug: string;
    duration?: number; // Tour duration in days
  };
  customerName: string;
  customerEmail: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
}

interface BookingUpdateData {
  travelDate?: string;
  numberOfPeople?: number;
  specialRequests?: string;
}

interface BookingGridProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  onUpdateStatus?: (bookingId: string, status: string) => Promise<void>;
  onUpdatePayment?: (bookingId: string, paymentStatus: string) => Promise<void>;
  onUpdateBooking?: (bookingId: string, data: BookingUpdateData) => Promise<void>;
}

const DAYS_TO_SHOW = 14; // Show 2 weeks

// Draggable booking card component
interface DraggableBookingProps {
  booking: Booking;
  bookingIndex: number;
  bookingHeight: number;
  visibleSpan: number;
  spanWidth: string;
  statusColor: string;
  onBookingClick: (booking: Booking) => void;
  formatPrice: (price: number) => string;
}

function DraggableBookingCard({
  booking,
  bookingIndex,
  bookingHeight,
  visibleSpan,
  spanWidth,
  statusColor,
  onBookingClick,
  formatPrice,
}: DraggableBookingProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: booking.id,
    data: { booking },
  });

  const duration = booking.tour.duration || 1;
  const topOffset = bookingIndex * (bookingHeight + 4);

  const style = {
    top: `${topOffset}px`,
    width: visibleSpan > 1 ? spanWidth : 'calc(100% - 2px)',
    zIndex: isDragging ? 100 : visibleSpan > 1 ? 10 : 1,
    minWidth: visibleSpan > 1 ? `${visibleSpan * 78}px` : undefined,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle click - only trigger if not dragging
  const handleClick = () => {
    if (!isDragging) {
      onBookingClick(booking);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'text-xs p-1.5 rounded border cursor-grab transition-colors absolute left-0 right-0 select-none',
        statusColor,
        visibleSpan > 1 && 'shadow-sm',
        isDragging && 'cursor-grabbing shadow-lg ring-2 ring-blue-400'
      )}
      style={style}
      onClick={handleClick}
      title={`${booking.customerName} - ${booking.numberOfPeople} people - ${formatPrice(booking.totalPrice)}${duration > 1 ? ` (${duration} days)` : ''} • Drag to reschedule`}
    >
      <div className="font-medium truncate">
        {booking.customerName.split(' ')[0]}
      </div>
      <div className="flex items-center gap-1 opacity-75">
        <Users className="h-2.5 w-2.5" />
        <span>{booking.numberOfPeople}</span>
        {duration > 1 && (
          <span className="ml-1 text-[10px] opacity-75">
            ({duration}d)
          </span>
        )}
      </div>
    </div>
  );
}

// Droppable cell component
interface DroppableCellProps {
  dateKey: string;
  tourId: string;
  isToday: boolean;
  isWeekend: boolean;
  children: React.ReactNode;
}

function DroppableCell({ dateKey, tourId, isToday, isWeekend, children }: DroppableCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${tourId}-${dateKey}`,
    data: { dateKey, tourId },
  });

  return (
    <td
      ref={setNodeRef}
      className={cn(
        'border-b border-r border-gray-200 p-1 align-top relative transition-colors',
        isToday && 'bg-blue-50/50',
        isWeekend && !isToday && 'bg-gray-50/50',
        isOver && 'bg-blue-100 ring-2 ring-blue-400 ring-inset'
      )}
    >
      <div className="relative h-full">
        {children}
      </div>
    </td>
  );
}

// Drag overlay component (what you see while dragging)
interface DragOverlayBookingProps {
  booking: Booking;
  statusColor: string;
}

function DragOverlayBooking({ booking, statusColor }: DragOverlayBookingProps) {
  const duration = booking.tour.duration || 1;

  return (
    <div
      className={cn(
        'text-xs p-1.5 rounded border shadow-xl cursor-grabbing ring-2 ring-blue-400',
        statusColor,
        'transform scale-105'
      )}
      style={{ width: '120px' }}
    >
      <div className="font-medium truncate">
        {booking.customerName.split(' ')[0]}
      </div>
      <div className="flex items-center gap-1 opacity-75">
        <Users className="h-2.5 w-2.5" />
        <span>{booking.numberOfPeople}</span>
        {duration > 1 && (
          <span className="ml-1 text-[10px] opacity-75">
            ({duration}d)
          </span>
        )}
      </div>
    </div>
  );
}

export function BookingGrid({ bookings, onBookingClick, onUpdateStatus, onUpdatePayment, onUpdateBooking }: BookingGridProps) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<BookingUpdateData>({});

  // Drag and drop state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [pendingDrop, setPendingDrop] = useState<{
    booking: Booking;
    newDate: string;
    oldDate: string;
  } | null>(null);

  // Configure drag sensors (require slight movement before drag starts to allow clicks)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const booking = event.active.data.current?.booking as Booking;
    if (booking) {
      setActiveBooking(booking);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBooking(null);

    if (!over) return;

    const booking = active.data.current?.booking as Booking;
    const dropData = over.data.current as { dateKey: string; tourId: string } | undefined;

    if (!booking || !dropData) return;

    const oldDate = new Date(booking.travelDate).toISOString().split('T')[0];
    const newDate = dropData.dateKey;

    // Only show confirmation if date actually changed
    if (oldDate !== newDate) {
      setPendingDrop({
        booking,
        newDate,
        oldDate,
      });
    }
  };

  const handleConfirmDrop = async () => {
    if (!pendingDrop || !onUpdateBooking) return;

    setActionLoading(true);
    try {
      await onUpdateBooking(pendingDrop.booking.id, {
        travelDate: pendingDrop.newDate,
      });
      setPendingDrop(null);
    } catch (error) {
      console.error('Failed to update booking date:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDrop = () => {
    setPendingDrop(null);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedBooking || !onUpdateStatus) return;
    setActionLoading(true);
    try {
      await onUpdateStatus(selectedBooking.id, status);
      setSelectedBooking(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentUpdate = async (paymentStatus: string) => {
    if (!selectedBooking || !onUpdatePayment) return;
    setActionLoading(true);
    try {
      await onUpdatePayment(selectedBooking.id, paymentStatus);
      setSelectedBooking(null);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = () => {
    if (!selectedBooking) return;
    setEditData({
      travelDate: selectedBooking.travelDate.split('T')[0],
      numberOfPeople: selectedBooking.numberOfPeople,
      specialRequests: selectedBooking.specialRequests || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking || !onUpdateBooking) return;
    setActionLoading(true);
    try {
      await onUpdateBooking(selectedBooking.id, editData);
      setIsEditing(false);
      setSelectedBooking(null);
      setEditData({});
    } finally {
      setActionLoading(false);
    }
  };

  const closePopup = () => {
    setSelectedBooking(null);
    setIsEditing(false);
    setEditData({});
  };

  // Get unique tours from bookings
  const tours = useMemo(() => {
    const tourMap = new Map<string, { id: string; title: string; slug: string }>();
    bookings.forEach((booking) => {
      if (!tourMap.has(booking.tour.id)) {
        tourMap.set(booking.tour.id, booking.tour);
      }
    });
    return Array.from(tourMap.values());
  }, [bookings]);

  // Generate date range
  const dateRange = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [startDate]);

  // Calculate row assignments for overlapping multi-day bookings
  // Returns a map of bookingId -> rowIndex for each tour
  const bookingRowAssignments = useMemo(() => {
    const assignments: Record<string, Record<string, number>> = {}; // tourId -> { bookingId -> rowIndex }
    const tourMaxRows: Record<string, number> = {}; // tourId -> maxRows

    tours.forEach((tour) => {
      assignments[tour.id] = {};
      tourMaxRows[tour.id] = 0;

      // Get all bookings for this tour, sorted by start date
      const tourBookings = bookings
        .filter((b) => b.tour.id === tour.id)
        .sort((a, b) => new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime());

      // Track which rows are occupied on which dates
      // dateKey -> Set of occupied row indices
      const occupiedRows: Record<string, Set<number>> = {};

      tourBookings.forEach((booking) => {
        const duration = booking.tour.duration || 1;
        const startDate = new Date(booking.travelDate);

        // Find the first row that's free for ALL days of this booking
        let assignedRow = 0;
        let foundFreeRow = false;

        while (!foundFreeRow) {
          let rowIsFree = true;

          // Check if this row is free for all days of the booking
          for (let i = 0; i < duration; i++) {
            const checkDate = new Date(startDate);
            checkDate.setDate(checkDate.getDate() + i);
            const dateKey = checkDate.toISOString().split('T')[0];

            if (occupiedRows[dateKey]?.has(assignedRow)) {
              rowIsFree = false;
              break;
            }
          }

          if (rowIsFree) {
            foundFreeRow = true;
          } else {
            assignedRow++;
          }
        }

        // Assign this row to the booking
        assignments[tour.id][booking.id] = assignedRow;

        // Mark all days as occupied for this row
        for (let i = 0; i < duration; i++) {
          const occupyDate = new Date(startDate);
          occupyDate.setDate(occupyDate.getDate() + i);
          const dateKey = occupyDate.toISOString().split('T')[0];

          if (!occupiedRows[dateKey]) {
            occupiedRows[dateKey] = new Set();
          }
          occupiedRows[dateKey].add(assignedRow);
        }

        // Track max rows for this tour
        tourMaxRows[tour.id] = Math.max(tourMaxRows[tour.id], assignedRow + 1);
      });
    });

    return { assignments, tourMaxRows };
  }, [bookings, tours]);

  // Group bookings by tour and date, with span info for multi-day bookings
  const bookingMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, { bookings: Booking[]; isSpanned?: boolean }>> = {};

    tours.forEach((tour) => {
      matrix[tour.id] = {};
    });

    // First pass: add all bookings to their start date
    bookings.forEach((booking) => {
      const tourId = booking.tour.id;
      const dateKey = new Date(booking.travelDate).toISOString().split('T')[0];

      if (!matrix[tourId]) {
        matrix[tourId] = {};
      }
      if (!matrix[tourId][dateKey]) {
        matrix[tourId][dateKey] = { bookings: [] };
      }
      matrix[tourId][dateKey].bookings.push(booking);

      // Mark subsequent days as spanned (for multi-day tours)
      const duration = booking.tour.duration || 1;
      if (duration > 1) {
        for (let i = 1; i < duration; i++) {
          const spannedDate = new Date(booking.travelDate);
          spannedDate.setDate(spannedDate.getDate() + i);
          const spannedKey = spannedDate.toISOString().split('T')[0];
          if (!matrix[tourId][spannedKey]) {
            matrix[tourId][spannedKey] = { bookings: [], isSpanned: true };
          } else {
            matrix[tourId][spannedKey].isSpanned = true;
          }
        }
      }
    });

    return matrix;
  }, [bookings, tours]);

  // Helper to calculate how many days a booking can span within the visible range
  const getVisibleSpan = (booking: Booking, startDateKey: string) => {
    const duration = booking.tour.duration || 1;
    if (duration <= 1) return 1;

    const bookingStart = new Date(booking.travelDate);
    const rangeEnd = new Date(startDate);
    rangeEnd.setDate(rangeEnd.getDate() + DAYS_TO_SHOW);

    // Calculate how many days fit within the visible range
    let visibleDays = 0;
    for (let i = 0; i < duration; i++) {
      const day = new Date(bookingStart);
      day.setDate(day.getDate() + i);
      if (day >= startDate && day < rangeEnd) {
        visibleDays++;
      }
    }
    return Math.max(1, visibleDays);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() - 7);
    setStartDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + 7);
    setStartDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
  };

  const formatDateHeader = (date: Date) => {
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return { day, weekday };
  };

  const formatMonthYear = () => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + DAYS_TO_SHOW - 1);

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (startMonth === endMonth) {
      return startMonth;
    }
    return `${startDate.toLocaleDateString('en-US', { month: 'short' })} - ${endMonth}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800 line-through opacity-60';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    if (onBookingClick) {
      onBookingClick(booking);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate total bookings and people for a tour row
  const getTourStats = (tourId: string) => {
    let totalBookings = 0;
    let totalPeople = 0;

    Object.values(bookingMatrix[tourId] || {}).forEach((cell) => {
      cell.bookings.forEach((booking) => {
        if (booking.status !== 'cancelled') {
          totalBookings++;
          totalPeople += booking.numberOfPeople;
        }
      });
    });

    return { totalBookings, totalPeople };
  };

  // Get the number of visual rows needed for a tour (based on overlapping bookings)
  const getRowsForTour = (tourId: string) => {
    return bookingRowAssignments.tourMaxRows[tourId] || 1;
  };

  // Get the assigned row for a specific booking
  const getBookingRow = (tourId: string, bookingId: string) => {
    return bookingRowAssignments.assignments[tourId]?.[bookingId] || 0;
  };

  // Track which cells should be skipped due to colSpan
  const getCellsToSkip = (tourId: string) => {
    const skippedCells = new Set<string>();

    Object.entries(bookingMatrix[tourId] || {}).forEach(([dateKey, cell]) => {
      cell.bookings.forEach((booking) => {
        const duration = booking.tour.duration || 1;
        if (duration > 1) {
          for (let i = 1; i < duration; i++) {
            const skipDate = new Date(booking.travelDate);
            skipDate.setDate(skipDate.getDate() + i);
            const skipKey = skipDate.toISOString().split('T')[0];
            skippedCells.add(skipKey);
          }
        }
      });
    });

    return skippedCells;
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">{formatMonthYear()}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-200 border border-green-400" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-200 border border-red-400" />
            <span>Cancelled</span>
          </div>
        </div>

        {/* Grid with Drag and Drop */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  {/* Tour name column header */}
                  <th className="sticky left-0 z-10 bg-gray-50 border-b border-r p-2 text-left min-w-[200px]">
                    <span className="font-semibold text-gray-700">Tour</span>
                  </th>
                  {/* Date headers */}
                  {dateRange.map((date) => {
                    const { day, weekday } = formatDateHeader(date);
                    return (
                      <th
                        key={date.toISOString()}
                        className={cn(
                          'border-b border-r border-gray-200 p-2 text-center min-w-[80px]',
                          isToday(date) && 'bg-blue-50',
                          isWeekend(date) && !isToday(date) && 'bg-gray-50'
                        )}
                      >
                        <div className="text-xs text-gray-500">{weekday}</div>
                        <div
                          className={cn(
                            'text-sm font-semibold',
                            isToday(date) ? 'text-blue-600' : 'text-gray-700'
                          )}
                        >
                          {day}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={DAYS_TO_SHOW + 1} className="p-8 text-center text-gray-500">
                      No tours with bookings found
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => {
                    const stats = getTourStats(tour.id);
                    const skippedCells = getCellsToSkip(tour.id);
                    const visualRows = getRowsForTour(tour.id);
                    const bookingHeight = 44; // Height of each booking card in pixels
                    const rowHeight = Math.max(60, visualRows * (bookingHeight + 4));

                    return (
                      <tr key={tour.id} className="hover:bg-gray-50/50" style={{ height: `${rowHeight}px` }}>
                        {/* Tour name cell */}
                        <td className="sticky left-0 z-10 bg-white border-b border-r p-2">
                          <div className="font-medium text-gray-900 truncate max-w-[180px]" title={tour.title}>
                            {tour.title}
                          </div>
                          {stats.totalBookings > 0 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {stats.totalBookings} bookings · {stats.totalPeople} pax
                            </div>
                          )}
                        </td>
                        {/* Booking cells - droppable */}
                        {dateRange.map((date) => {
                          const dateKey = date.toISOString().split('T')[0];
                          const cell = bookingMatrix[tour.id]?.[dateKey];
                          const dayBookings = cell?.bookings || [];

                          return (
                            <DroppableCell
                              key={date.toISOString()}
                              dateKey={dateKey}
                              tourId={tour.id}
                              isToday={isToday(date)}
                              isWeekend={isWeekend(date)}
                            >
                              {dayBookings.map((booking) => {
                                const visibleSpan = getVisibleSpan(booking, dateKey);
                                const spanWidth = visibleSpan > 1
                                  ? `calc(${visibleSpan * 80}px + ${(visibleSpan - 1) * 8}px)`
                                  : 'calc(100% - 2px)';
                                const assignedRow = getBookingRow(tour.id, booking.id);

                                return (
                                  <DraggableBookingCard
                                    key={booking.id}
                                    booking={booking}
                                    bookingIndex={assignedRow}
                                    bookingHeight={bookingHeight}
                                    visibleSpan={visibleSpan}
                                    spanWidth={spanWidth}
                                    statusColor={getStatusColor(booking.status)}
                                    onBookingClick={handleBookingClick}
                                    formatPrice={formatPrice}
                                  />
                                );
                              })}
                            </DroppableCell>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Drag Overlay - what you see while dragging */}
          <DragOverlay>
            {activeBooking && (
              <DragOverlayBooking
                booking={activeBooking}
                statusColor={getStatusColor(activeBooking.status)}
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* Empty state if no tours */}
        {tours.length === 0 && bookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No bookings to display</p>
          </div>
        )}

        {/* Booking Detail Popup */}
        {selectedBooking && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closePopup}
          >
            <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedBooking.tour.title}</h3>
                    {!isEditing && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedBooking.travelDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!isEditing && onUpdateBooking && (
                      <Button variant="ghost" size="sm" onClick={startEditing}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={closePopup}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="travelDate">Travel Date</Label>
                      <Input
                        id="travelDate"
                        type="date"
                        value={editData.travelDate || ''}
                        onChange={(e) => setEditData({ ...editData, travelDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numberOfPeople">Number of People</Label>
                      <Input
                        id="numberOfPeople"
                        type="number"
                        min="1"
                        value={editData.numberOfPeople || ''}
                        onChange={(e) => setEditData({ ...editData, numberOfPeople: parseInt(e.target.value) || 1 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={editData.specialRequests || ''}
                        onChange={(e) => setEditData({ ...editData, specialRequests: e.target.value })}
                        placeholder="Any special requests or notes..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={actionLoading}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {actionLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{selectedBooking.customerName}</p>
                      <p className="text-sm">{selectedBooking.customerEmail}</p>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Group Size</p>
                        <p className="font-medium">{selectedBooking.numberOfPeople} people</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium text-green-600">
                          {formatPrice(selectedBooking.totalPrice)}
                        </p>
                      </div>
                    </div>

                    {selectedBooking.specialRequests && (
                      <div>
                        <p className="text-sm text-muted-foreground">Special Requests</p>
                        <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedBooking.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Badge
                        className={cn(
                          selectedBooking.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                          selectedBooking.status === 'confirmed' && 'bg-green-100 text-green-800',
                          selectedBooking.status === 'cancelled' && 'bg-red-100 text-red-800'
                        )}
                      >
                        {selectedBooking.status}
                      </Badge>
                      <Badge variant="outline">
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>

                    {/* Quick Actions */}
                    {onUpdateStatus && (
                      <div className="pt-4 border-t space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate('confirmed')}
                                disabled={actionLoading}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleStatusUpdate('cancelled')}
                                disabled={actionLoading}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}

                          {selectedBooking.status === 'confirmed' && selectedBooking.paymentStatus !== 'paid' && onUpdatePayment && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handlePaymentUpdate('paid')}
                              disabled={actionLoading}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}

                          {selectedBooking.status === 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate('pending')}
                              disabled={actionLoading}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                          )}

                          {selectedBooking.status === 'confirmed' && selectedBooking.paymentStatus === 'paid' && (
                            <p className="text-sm text-green-600">✓ Booking complete</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Drag and Drop Confirmation Dialog */}
        <AlertDialog open={!!pendingDrop} onOpenChange={(open) => !open && handleCancelDrop()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reschedule Booking?</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingDrop && (
                  <>
                    Move <strong>{pendingDrop.booking.customerName}</strong>'s booking from{' '}
                    <strong>
                      {new Date(pendingDrop.oldDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </strong>{' '}
                    to{' '}
                    <strong>
                      {new Date(pendingDrop.newDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </strong>
                    ?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDrop}
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading ? 'Moving...' : 'Confirm Move'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

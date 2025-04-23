import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useLoading } from '../contexts/LoadingContext';
import axios from 'axios';
import { Star, Share2, MapPin, Calendar, Clock, Users, MessageCircle, Facebook, Twitter, Instagram } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();

  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        
        // Check if user is registered or on waitlist
        if (user) {
          const registered = response.data.attendees.some(
            attendee => attendee.user._id === user.id
          );
          const waitlisted = response.data.waitlist.some(
            waitlist => waitlist.user._id === user.id
          );
          setIsRegistered(registered);
          setIsOnWaitlist(waitlisted);
        }
      } catch (error) {
        showNotification('Error fetching event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      showNotification('Please login to register', 'error');
      navigate('/login');
      return;
    }

    if (!selectedTicket) {
      showNotification('Please select a ticket type', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/events/${id}/register`, { ticketType: selectedTicket });
      showNotification('Successfully registered for event', 'success');
      setIsRegistered(true);
    } catch (error) {
      if (error.response?.data?.message === 'Added to waitlist') {
        showNotification('Event is full. You have been added to the waitlist', 'info');
        setIsOnWaitlist(true);
      } else {
        showNotification(error.response?.data?.message || 'Error registering for event', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to leave a review', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/events/${id}/reviews`, review);
      showNotification('Review submitted successfully', 'success');
      // Refresh event data to show new review
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const shareEvent = (platform) => {
    const url = window.location.href;
    const title = event.title;
    const text = `Check out this event: ${title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard', 'success');
    }
  };

  if (!event) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{new Date(event.startDate).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.venue.name}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {event.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(event.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                ({event.reviews.length} reviews)
              </span>
            </div>

            {/* Review Form */}
            {isRegistered && !event.reviews.some(r => r.user._id === user?.id) && (
              <form onSubmit={handleReviewSubmit} className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReview(prev => ({ ...prev, rating }))}
                        className="mr-2"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="4"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {event.reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{review.user.name}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Registration Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Register</h3>
            {isRegistered ? (
              <div className="text-green-600 mb-4">You are registered for this event</div>
            ) : isOnWaitlist ? (
              <div className="text-yellow-600 mb-4">You are on the waitlist</div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Ticket Type
                  </label>
                  <select
                    value={selectedTicket}
                    onChange={(e) => setSelectedTicket(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a ticket</option>
                    {event.tickets.map((ticket) => (
                      <option key={ticket.type} value={ticket.type}>
                        {ticket.type} - ${ticket.price} ({ticket.quantity - ticket.sold} remaining)
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          {/* Event Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Event Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium">{event.category}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Capacity</div>
                <div className="font-medium">
                  {event.attendees.length} / {event.capacity} registered
                </div>
              </div>
            </div>
          </div>

          {/* Share Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Share Event</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => shareEvent('facebook')}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={() => shareEvent('twitter')}
                className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={() => shareEvent('copy')}
                className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 
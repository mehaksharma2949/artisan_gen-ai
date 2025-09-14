import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import Header from '@/react-app/components/Header';

interface Conversation {
  id: number;
  buyer_name: string;
  buyer_image: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}



export default function ArtisanMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/artisan/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockConversations = [
    {
      id: 1,
      buyer_name: 'Priya Sharma',
      buyer_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d8?w=100&h=100&fit=crop&crop=face',
      last_message: 'Thank you for the beautiful ceramic bowl! Can you create a matching set?',
      last_message_at: '2024-01-15T14:30:00Z',
      unread_count: 2
    },
    {
      id: 2,
      buyer_name: 'Rajesh Kumar',
      buyer_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      last_message: 'Hello! I\'m interested in your woodwork pieces. Do you do custom orders?',
      last_message_at: '2024-01-15T12:15:00Z',
      unread_count: 0
    },
    {
      id: 3,
      buyer_name: 'Meera Patel',
      buyer_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      last_message: 'The scarf arrived safely. It\'s absolutely gorgeous!',
      last_message_at: '2024-01-14T16:45:00Z',
      unread_count: 0
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender_id: 'buyer-1',
      message: 'Hello! I saw your ceramic bowls and they\'re beautiful. Do you take custom orders?',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      sender_id: user?.id || 'artisan-1',
      message: 'Thank you so much! Yes, I do take custom orders. What did you have in mind?',
      created_at: '2024-01-15T10:15:00Z'
    },
    {
      id: 3,
      sender_id: 'buyer-1',
      message: 'I would love a set of 6 bowls in earthy tones - browns, greens, and warm beiges. Is that possible?',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 4,
      sender_id: user?.id || 'artisan-1',
      message: 'Absolutely! I love working with earthy palettes. I can create a beautiful set for you. The timeframe would be about 2-3 weeks. Shall we discuss pricing?',
      created_at: '2024-01-15T11:00:00Z'
    },
    {
      id: 5,
      sender_id: 'buyer-1',
      message: 'Thank you for the beautiful ceramic bowl! Can you create a matching set?',
      created_at: '2024-01-15T14:30:00Z'
    }
  ];

  const displayConversations = conversations.length > 0 ? conversations : mockConversations;
  const displayMessages = selectedConversation ? mockMessages : [];

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: selectedConversation,
          message: newMessage
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectedConversationData = displayConversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  displayConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={conversation.buyer_image}
                          alt={conversation.buyer_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.buyer_name}
                            </h3>
                            {conversation.unread_count > 0 && (
                              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.last_message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(conversation.last_message_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversationData?.buyer_image}
                        alt={selectedConversationData?.buyer_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversationData?.buyer_name}
                        </h3>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {displayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === user?.id ? 'text-orange-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the left to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

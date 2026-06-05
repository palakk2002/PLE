import { create } from 'zustand';
import * as adminService from '../../modules/Admin/services/adminService';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'ple-support-tickets';

const INITIAL_MOCK_TICKETS = [
  {
    id: 'TKT-1001',
    subject: 'Late Delivery of order #OD8237',
    category: 'Delivery Issue',
    priority: 'high',
    status: 'in_progress',
    description: 'My package was supposed to arrive yesterday but the status still says in transit. Please check.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    messages: [
      {
        senderType: 'user',
        message: 'I haven\'t received my delivery yet. The status has not changed in 3 days.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        senderType: 'admin',
        message: 'Hello John, we are contacting the delivery partner right now to expedite your delivery.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: 'open', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Ticket created' },
      { status: 'in_progress', changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Admin updated status to In Progress' }
    ]
  },
  {
    id: 'TKT-1002',
    subject: 'Double charged for refund transaction',
    category: 'Payment Issue',
    priority: 'medium',
    status: 'open',
    description: 'I made a payment of ₹450 but it got deducted twice from my wallet.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    messages: [
      {
        senderType: 'user',
        message: 'I was double charged for the wallet transaction. Please check and refund.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: 'open', changedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), note: 'Ticket created' }
    ]
  },
  {
    id: 'TKT-1003',
    subject: 'Damaged item received',
    category: 'Return Issue',
    priority: 'high',
    status: 'waiting_for_user',
    description: 'The wireless earphones box was damaged upon delivery, and the left earbud is not charging.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    messages: [
      {
        senderType: 'user',
        message: 'I received a damaged box. The left earbud is completely unresponsive.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        senderType: 'admin',
        message: 'Could you please upload a screenshot or photo of the damaged box?',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: 'open', changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Ticket created' },
      { status: 'waiting_for_user', changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Status changed to Waiting For User' }
    ]
  }
];

const getStoredTickets = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TICKETS));
    return INITIAL_MOCK_TICKETS;
  }
  return JSON.parse(data);
};

const saveStoredTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const useSupportStore = create((set, get) => ({
  tickets: getStoredTickets(),
  isLoading: false,
  error: null,
  pagination: {
    total: getStoredTickets().length,
    page: 1,
    limit: 10,
    pages: 1
  },

  fetchTickets: async (params = {}) => {
    set({ isLoading: true });
    try {
      // Try fetching from backend admin API
      const response = await adminService.getAllTickets(params);
      if (response && response.data && Array.isArray(response.data.tickets)) {
        set({
          tickets: response.data.tickets,
          pagination: response.data.pagination || { total: response.data.tickets.length, page: 1, limit: 10, pages: 1 },
          isLoading: false
        });
        return;
      }
      throw new Error("Invalid backend data format");
    } catch (error) {
      // Fallback to localStorage data
      const local = getStoredTickets();
      let filtered = [...local];

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(t => t.status === params.status);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.id.toLowerCase().includes(query) || 
          t.subject.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          (t.customer?.name && t.customer.name.toLowerCase().includes(query))
        );
      }

      set({
        tickets: filtered,
        pagination: {
          total: filtered.length,
          page: 1,
          limit: 10,
          pages: 1
        },
        isLoading: false
      });
    }
  },

  fetchTicketById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await adminService.getTicketById(id);
      if (response && response.data && response.data.id) {
        set({ isLoading: false });
        return response.data;
      }
      throw new Error("Invalid backend ticket format");
    } catch (error) {
      const local = getStoredTickets();
      const ticket = local.find(t => t.id === id);
      set({ isLoading: false });
      return ticket || null;
    }
  },

  createTicket: async (ticketData) => {
    set({ isLoading: true });
    try {
      const newTicket = {
        id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        ...ticketData,
        status: 'open',
        createdAt: new Date().toISOString(),
        messages: [
          {
            senderType: 'user',
            message: ticketData.description,
            createdAt: new Date().toISOString(),
            attachment: ticketData.screenshot || null
          }
        ],
        timeline: [
          { status: 'open', changedAt: new Date().toISOString(), note: 'Ticket created' }
        ]
      };
      
      const local = getStoredTickets();
      const updated = [newTicket, ...local];
      saveStoredTickets(updated);
      
      set({
        tickets: updated,
        pagination: {
          total: updated.length,
          page: 1,
          limit: 10,
          pages: 1
        },
        isLoading: false
      });
      toast.success('Support ticket created successfully!');
      return newTicket;
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to create ticket');
      return null;
    }
  },

  updateTicketStatus: async (id, status, note = '') => {
    try {
      await adminService.updateTicketStatus(id, status);
    } catch (e) {
      // API failure, process locally
    }
    
    const local = getStoredTickets();
    const updated = local.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          timeline: [
            ...t.timeline,
            { status, changedAt: new Date().toISOString(), note: note || `Status updated to ${status.replace('_', ' ')}` }
          ]
        };
      }
      return t;
    });
    
    saveStoredTickets(updated);
    set({ tickets: updated });
    toast.success('Status updated successfully');
    return true;
  },

  addReply: async (id, message, senderType = 'admin', attachment = null) => {
    try {
      await adminService.addTicketMessage(id, message);
    } catch (e) {
      // API failure, process locally
    }
    
    const local = getStoredTickets();
    let updatedTicket = null;
    const updated = local.map(t => {
      if (t.id === id) {
        const newMsg = {
          senderType,
          message,
          createdAt: new Date().toISOString(),
          attachment
        };
        updatedTicket = {
          ...t,
          messages: [...(t.messages || []), newMsg]
        };
        return updatedTicket;
      }
      return t;
    });

    saveStoredTickets(updated);
    set({ tickets: updated });
    toast.success('Reply added successfully');
    return updatedTicket;
  }
}));


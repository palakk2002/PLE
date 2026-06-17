import { create } from 'zustand';
import * as adminService from '../../modules/Admin/services/adminService';
import toast from 'react-hot-toast';
import { mockReturnRequests } from '../../data/adminMockData';
import { useAuthStore } from './authStore';

// Initialize returns from localStorage or mock data
const getInitialReturns = () => {
    try {
        const stored = localStorage.getItem('app-return-requests');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to parse stored return requests', e);
    }
    // Set mock data as default
    localStorage.setItem('app-return-requests', JSON.stringify(mockReturnRequests));
    return mockReturnRequests;
};

export const useReturnStore = create((set, get) => ({
    returnRequests: getInitialReturns(),
    isLoading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 1
    },

    saveToStorage: (requests) => {
        try {
            localStorage.setItem('app-return-requests', JSON.stringify(requests));
        } catch (e) {
            console.error('Failed to save returns to localStorage', e);
        }
    },

    fetchReturnRequests: async (params = {}) => {
        set({ isLoading: true });
        try {
            // Attempt API call
            const { fetchAll = true, ...queryParams } = params || {};
            const pageSize = Math.max(Number.parseInt(queryParams.limit, 10) || 100, 1);
            let currentPage = Math.max(Number.parseInt(queryParams.page, 10) || 1, 1);
            let totalPages = 1;
            let latestPagination = {
                total: 0,
                page: currentPage,
                limit: pageSize,
                pages: 1,
            };
            const allRequests = [];

            try {
                do {
                    const response = await adminService.getAllReturnRequests({
                        ...queryParams,
                        page: currentPage,
                        limit: pageSize,
                    });

                    const pageRequests = Array.isArray(response?.data?.returnRequests)
                        ? response.data.returnRequests
                        : [];
                    allRequests.push(...pageRequests);

                    const pagination = response?.data?.pagination || {};
                    latestPagination = {
                        total: Number.isFinite(Number(pagination.total))
                            ? Number(pagination.total)
                            : allRequests.length,
                        page: Number.isFinite(Number(pagination.page))
                            ? Number(pagination.page)
                            : currentPage,
                        limit: Number.isFinite(Number(pagination.limit))
                            ? Number(pagination.limit)
                            : pageSize,
                        pages: Math.max(Number.parseInt(pagination.pages, 10) || 1, 1),
                    };

                    totalPages = fetchAll ? latestPagination.pages : currentPage;
                    currentPage += 1;
                } while (fetchAll && currentPage <= totalPages);

                if (allRequests.length > 0) {
                    set({
                        returnRequests: allRequests,
                        pagination: fetchAll
                            ? {
                                total: latestPagination.total,
                                page: 1,
                                limit: latestPagination.limit,
                                pages: latestPagination.pages,
                            }
                            : latestPagination,
                        isLoading: false
                    });
                    get().saveToStorage(allRequests);
                    return;
                }
            } catch (apiError) {
                console.warn("getAllReturnRequests API failed, using local/mock returns instead:", apiError);
            }

            // Fallback to local storage state
            const localRequests = getInitialReturns();
            set({
                returnRequests: localRequests,
                pagination: {
                    total: localRequests.length,
                    page: 1,
                    limit: 100,
                    pages: 1
                },
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || 'Failed to fetch return requests');
        }
    },

    fetchReturnRequestById: async (id) => {
        set({ isLoading: true });
        try {
            try {
                const response = await adminService.getReturnRequestById(id);
                if (response?.data) {
                    set({ isLoading: false });
                    return response.data;
                }
            } catch (apiErr) {
                console.warn("getReturnRequestById API failed, checking local state:", apiErr);
            }

            const localRequests = get().returnRequests;
            const request = localRequests.find(r => String(r.id) === String(id));
            set({ isLoading: false });
            return request || null;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.message || 'Failed to fetch return request details');
            return null;
        }
    },

    createReturnRequest: async (requestData) => {
        set({ isLoading: true });
        try {
            const newId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
            const newRequest = {
                id: newId,
                orderId: requestData.orderId,
                customer: requestData.customer || {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+1234567890"
                },
                requestDate: new Date().toISOString(),
                items: requestData.items || [],
                reason: requestData.reason,
                description: requestData.description,
                notes: requestData.notes || '',
                images: requestData.images || [],
                refundAmount: requestData.refundAmount || 0,
                status: "Request Submitted",
                refundStatus: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timeline: [
                    { status: "Request Submitted", date: new Date().toISOString(), note: "Return request submitted by customer." }
                ]
            };

            const updated = [newRequest, ...get().returnRequests];
            set({ returnRequests: updated, isLoading: false });
            get().saveToStorage(updated);
            
            toast.success('Return request submitted successfully');
            return newRequest;
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to create return request');
            return null;
        }
    },

    updateReturnStatus: async (id, statusData) => {
        set({ isLoading: true });
        try {
            try {
                await adminService.updateReturnRequestStatus(id, statusData);
            } catch (apiErr) {
                console.warn("updateReturnRequestStatus API failed, updating locally:", apiErr);
            }

            const updatedList = get().returnRequests.map((req) => {
                if (String(req.id) === String(id)) {
                    const timeline = req.timeline || [];
                    const newStatus = statusData.status || req.status;
                    const newRefundStatus = statusData.refundStatus || req.refundStatus;
                    const updatedTimeline = [...timeline];
                    
                    if (newStatus !== req.status) {
                        updatedTimeline.push({
                            status: newStatus,
                            date: new Date().toISOString(),
                            note: statusData.adminNote || statusData.rejectionReason || `Status updated to ${newStatus}`
                        });
                    }

                    // Check and process auto-wallet credit if status is completed and destination is Wallet
                    if (
                        (newRefundStatus === 'processed' || newStatus === 'Refund Completed') &&
                        req.refundDestination === 'Wallet' &&
                        req.refundStatus !== 'processed' &&
                        req.refundStatus !== 'Completed'
                    ) {
                        const user = useAuthStore.getState().user;
                        const userId = user?.id || 'guest';
                        
                        // Credit wallet balance
                        const savedBalance = localStorage.getItem(`wallet_balance_${userId}`);
                        const currentBalance = savedBalance ? parseFloat(savedBalance) : 1500.0;
                        const refundAmount = req.refundAmount || 0;
                        const newBalance = currentBalance + refundAmount;
                        localStorage.setItem(`wallet_balance_${userId}`, newBalance.toString());

                        // Add transaction history
                        const savedTransactions = localStorage.getItem(`wallet_txs_${userId}`);
                        const txs = savedTransactions ? JSON.parse(savedTransactions) : [];
                        const newTx = {
                            id: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
                            type: "Refund Credit",
                            title: `Refund from Order #${req.orderId}`,
                            amount: refundAmount,
                            date: new Date().toISOString(),
                            description: `Refund credited to wallet for Return Request ${req.id}`,
                        };
                        localStorage.setItem(`wallet_txs_${userId}`, JSON.stringify([newTx, ...txs]));
                        
                        toast.success(`₹${refundAmount.toFixed(2)} credited to your wallet!`);
                    }

                    return {
                        ...req,
                        status: newStatus,
                        refundStatus: newRefundStatus,
                        rejectionReason: statusData.rejectionReason || req.rejectionReason,
                        adminNote: statusData.adminNote || req.adminNote,
                        timeline: updatedTimeline,
                        updatedAt: new Date().toISOString()
                    };
                }
                return req;
            });

            set({ returnRequests: updatedList, isLoading: false });
            get().saveToStorage(updatedList);
            toast.success('Return status updated successfully');
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.message || 'Failed to update return status');
            return false;
        }
    }
}));


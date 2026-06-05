import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default mock seed data for demonstration
const initialSeedEnquiries = [
  {
    id: "PE-2026-001",
    productId: "1",
    productName: "Samsung Galaxy S24 Ultra",
    productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150",
    subject: "Warranty and coverage in India",
    question: "Does this product come with international warranty or only valid in India? Can we extend it?",
    priority: "Medium",
    attachment: "invoice_spec.pdf",
    userId: "buyer-123",
    userName: "Rajesh Kumar",
    userEmail: "rajesh@kumarelectronics.com",
    status: "Seller Responded",
    createdAt: "2026-06-01T10:00:00Z",
    sellerResponse: "This device comes with 1-year domestic India warranty. You can purchase an extended warranty from our store separately within 30 days of purchase.",
    timeline: [
      { status: "Submitted", date: "2026-06-01T10:00:00Z", note: "Enquiry submitted by user." },
      { status: "Under Review", date: "2026-06-01T11:30:00Z", note: "Enquiry assigned to seller and under review." },
      { status: "Seller Responded", date: "2026-06-02T09:15:00Z", note: "Seller added warranty details response." }
    ]
  },
  {
    id: "PE-2026-002",
    productId: "2",
    productName: "Apple MacBook Air M3",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150",
    subject: "Keyboard layout type",
    question: "Is this the US English keyboard layout or the EU/UK layout? I need the flat Enter key version.",
    priority: "High",
    attachment: null,
    userId: "buyer-123",
    userName: "Rajesh Kumar",
    userEmail: "rajesh@kumarelectronics.com",
    status: "Need More Information",
    createdAt: "2026-06-03T14:20:00Z",
    sellerResponse: "Could you specify if you are looking for Space Gray or Silver, as layout batches differ between stocks?",
    timeline: [
      { status: "Submitted", date: "2026-06-03T14:20:00Z", note: "Enquiry submitted by user." },
      { status: "Under Review", date: "2026-06-03T15:00:00Z", note: "Seller checking warehouse inventory." },
      { status: "Need More Information", date: "2026-06-04T10:00:00Z", note: "Seller requested color specification." }
    ]
  },
  {
    id: "PE-2026-003",
    productId: "3",
    productName: "Sony WH-1000XM5 Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
    subject: "Bulk corporate color customisation",
    question: "Can we print corporate logos on the ear cups for a 50 units order? What is the turnaround time?",
    priority: "Low",
    attachment: "logo_draft.png",
    userId: "buyer-b2b",
    userName: "Amit Patel",
    userEmail: "amit@pateltraders.com",
    status: "Resolved",
    createdAt: "2026-05-28T09:00:00Z",
    sellerResponse: "Yes, corporate logo printing is supported for orders above 30 units. Turnaround time is 7-10 working days after design signoff.",
    timeline: [
      { status: "Submitted", date: "2026-05-28T09:00:00Z", note: "Enquiry submitted." },
      { status: "Under Review", date: "2026-05-28T10:30:00Z", note: "Design team reviewing dimensions." },
      { status: "Seller Responded", date: "2026-05-29T14:00:00Z", note: "Seller confirmed printing support." },
      { status: "Resolved", date: "2026-05-30T11:00:00Z", note: "Resolved. Customer satisfied." }
    ]
  }
];

export const useProductEnquiryStore = create(
  persist(
    (set, get) => ({
      enquiries: initialSeedEnquiries,

      addEnquiry: (data) => {
        const id = `PE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newEnquiry = {
          id,
          productId: data.productId,
          productName: data.productName,
          productImage: data.productImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
          subject: data.subject,
          question: data.question,
          priority: data.priority || "Medium",
          attachment: data.attachment || null,
          userId: data.userId || "guest",
          userName: data.userName || "Anonymous User",
          userEmail: data.userEmail || "anonymous@example.com",
          status: "Submitted",
          createdAt: new Date().toISOString(),
          sellerResponse: null,
          timeline: [
            {
              status: "Submitted",
              date: new Date().toISOString(),
              note: "Enquiry submitted successfully."
            }
          ]
        };

        set((state) => ({
          enquiries: [newEnquiry, ...state.enquiries]
        }));
        return newEnquiry;
      },

      replyToEnquiry: (id, responseText, nextStatus = "Seller Responded") => {
        set((state) => ({
          enquiries: state.enquiries.map((enq) => {
            if (enq.id !== id) return enq;
            const updatedTimeline = [
              ...enq.timeline,
              {
                status: nextStatus,
                date: new Date().toISOString(),
                note: `Seller responded: "${responseText.substring(0, 40)}${responseText.length > 40 ? '...' : ''}"`
              }
            ];
            return {
              ...enq,
              status: nextStatus,
              sellerResponse: responseText,
              timeline: updatedTimeline
            };
          })
        }));
      },

      updateEnquiryStatus: (id, nextStatus, noteText) => {
        set((state) => ({
          enquiries: state.enquiries.map((enq) => {
            if (enq.id !== id) return enq;
            const updatedTimeline = [
              ...enq.timeline,
              {
                status: nextStatus,
                date: new Date().toISOString(),
                note: noteText || `Enquiry status updated to ${nextStatus}.`
              }
            ];
            return {
              ...enq,
              status: nextStatus,
              timeline: updatedTimeline
            };
          })
        }));
      }
    }),
    {
      name: 'product-enquiry-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../utils/api';

const normalizeAddress = (address) => ({
  ...address,
  id: address?.id || address?._id,
});
const normalizePhone = (value) => String(value || '').replace(/\D/g, '').slice(-10);
const normalizeText = (value) => String(value ?? '').trim();

export const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [],
      isLoading: false,
      hasFetched: false,

      fetchAddresses: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/user/addresses');
          const payload = response?.data ?? response;
          const list = Array.isArray(payload)
            ? payload.map(normalizeAddress)
            : [];
          set({ addresses: list, isLoading: false, hasFetched: true });
          return list;
        } catch (error) {
          console.warn("Backend fetch addresses failed, keeping local persisted addresses:", error);
          set({ isLoading: false, hasFetched: true });
          return get().addresses;
        }
      },

      // Add a new address
      addAddress: async (address) => {
        set({ isLoading: true });
        const localId = 'local_' + Math.random().toString(36).substr(2, 9);
        const newLocalAddress = {
          id: localId,
          name: normalizeText(address?.name),
          fullName: normalizeText(address?.fullName),
          phone: normalizePhone(address?.phone),
          address: normalizeText(address?.address),
          city: normalizeText(address?.city),
          state: normalizeText(address?.state),
          zipCode: normalizeText(address?.zipCode),
          country: normalizeText(address?.country),
          isDefault: get().addresses.length === 0 || Boolean(address?.isDefault),
        };

        try {
          const payload = { ...newLocalAddress };
          delete payload.id;
          const response = await api.post('/user/addresses', payload);
          const created = normalizeAddress(response?.data ?? response);

          set((curr) => ({
            addresses: payload.isDefault
              ? [...curr.addresses.map((addr) => ({ ...addr, isDefault: false })), created]
              : [...curr.addresses, created],
            isLoading: false,
          }));

          return created;
        } catch (error) {
          console.warn("Backend add address failed, falling back to local storage:", error);
          set((curr) => ({
            addresses: newLocalAddress.isDefault
              ? [...curr.addresses.map((addr) => ({ ...addr, isDefault: false })), newLocalAddress]
              : [...curr.addresses, newLocalAddress],
            isLoading: false,
          }));
          return newLocalAddress;
        }
      },

      // Update an existing address
      updateAddress: async (id, updatedAddress) => {
        set({ isLoading: true });
        const isLocalOnly = String(id).startsWith('local_');

        try {
          if (isLocalOnly) {
            throw new Error("Local-only address cannot sync to backend");
          }
          const payload = {
            ...updatedAddress,
            ...(updatedAddress?.name !== undefined ? { name: normalizeText(updatedAddress?.name) } : {}),
            ...(updatedAddress?.fullName !== undefined ? { fullName: normalizeText(updatedAddress?.fullName) } : {}),
            ...(updatedAddress?.phone !== undefined ? { phone: normalizePhone(updatedAddress?.phone) } : {}),
            ...(updatedAddress?.address !== undefined ? { address: normalizeText(updatedAddress?.address) } : {}),
            ...(updatedAddress?.city !== undefined ? { city: normalizeText(updatedAddress?.city) } : {}),
            ...(updatedAddress?.state !== undefined ? { state: normalizeText(updatedAddress?.state) } : {}),
            ...(updatedAddress?.zipCode !== undefined ? { zipCode: normalizeText(updatedAddress?.zipCode) } : {}),
            ...(updatedAddress?.country !== undefined ? { country: normalizeText(updatedAddress?.country) } : {}),
          };
          const response = await api.put(`/user/addresses/${id}`, payload);
          const updated = normalizeAddress(response?.data ?? response);

          set((state) => ({
            addresses: state.addresses.map((addr) =>
              String(addr.id) === String(id)
                ? updated
                : updated.isDefault
                  ? { ...addr, isDefault: false }
                  : addr
            ),
            isLoading: false,
          }));
          return updated;
        } catch (error) {
          console.warn("Backend update address failed/skipped, falling back to local storage:", error);
          const state = get();
          const existing = state.addresses.find((addr) => String(addr.id) === String(id));
          if (!existing) {
            set({ isLoading: false });
            throw new Error("Address not found.");
          }

          const updatedLocal = {
            ...existing,
            ...updatedAddress,
            id,
            ...(updatedAddress?.name !== undefined ? { name: normalizeText(updatedAddress?.name) } : {}),
            ...(updatedAddress?.fullName !== undefined ? { fullName: normalizeText(updatedAddress?.fullName) } : {}),
            ...(updatedAddress?.phone !== undefined ? { phone: normalizePhone(updatedAddress?.phone) } : {}),
            ...(updatedAddress?.address !== undefined ? { address: normalizeText(updatedAddress?.address) } : {}),
            ...(updatedAddress?.city !== undefined ? { city: normalizeText(updatedAddress?.city) } : {}),
            ...(updatedAddress?.state !== undefined ? { state: normalizeText(updatedAddress?.state) } : {}),
            ...(updatedAddress?.zipCode !== undefined ? { zipCode: normalizeText(updatedAddress?.zipCode) } : {}),
            ...(updatedAddress?.country !== undefined ? { country: normalizeText(updatedAddress?.country) } : {}),
          };

          set((curr) => ({
            addresses: curr.addresses.map((addr) =>
              String(addr.id) === String(id)
                ? updatedLocal
                : updatedLocal.isDefault
                  ? { ...addr, isDefault: false }
                  : addr
            ),
            isLoading: false,
          }));
          return updatedLocal;
        }
      },

      // Delete an address
      deleteAddress: async (id) => {
        set({ isLoading: true });
        const isLocalOnly = String(id).startsWith('local_');

        try {
          if (!isLocalOnly) {
            await api.delete(`/user/addresses/${id}`);
          }
        } catch (error) {
          console.warn("Backend delete address failed/skipped, falling back to local storage:", error);
        }

        const deletedId = String(id);
        set((state) => {
          const remaining = state.addresses.filter((addr) => String(addr.id) !== deletedId);
          const deletedAddress = state.addresses.find((addr) => String(addr.id) === deletedId);
          if (deletedAddress?.isDefault && remaining.length > 0) {
            const promoted = [...remaining].sort((a, b) => {
              const aTs = new Date(a?.createdAt || 0).getTime();
              const bTs = new Date(b?.createdAt || 0).getTime();
              return bTs - aTs;
            })[0];
            const promotedId = String(promoted?.id || '');
            return {
              addresses: remaining.map((addr) => ({
                ...addr,
                isDefault: String(addr.id) === promotedId,
              })),
              isLoading: false,
            };
          }
          return {
            addresses: remaining,
            isLoading: false,
          };
        });
        return true;
      },

      // Set default address
      setDefaultAddress: async (id) => {
        set({ isLoading: true });
        const isLocalOnly = String(id).startsWith('local_');

        try {
          if (isLocalOnly) {
            throw new Error("Local-only address cannot sync to backend");
          }
          const response = await api.patch(`/user/addresses/${id}/default`);
          const updated = normalizeAddress(response?.data ?? response);

          set((state) => ({
            addresses: state.addresses.map((addr) => ({
              ...addr,
              isDefault: String(addr.id) === String(updated.id),
            })),
            isLoading: false,
          }));
          return updated;
        } catch (error) {
          console.warn("Backend set default failed/skipped, falling back to local storage:", error);
          set((state) => ({
            addresses: state.addresses.map((addr) => ({
              ...addr,
              isDefault: String(addr.id) === String(id),
            })),
            isLoading: false,
          }));
          return get().addresses.find((addr) => String(addr.id) === String(id));
        }
      },

      // Get default address
      getDefaultAddress: () => {
        const state = get();
        return state.addresses.find((addr) => addr.isDefault) || state.addresses[0] || null;
      },

      // Get all addresses
      getAddresses: () => {
        const state = get();
        return state.addresses;
      },

      resetAddresses: () => {
        set({ addresses: [], hasFetched: false });
      },
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheck,
  FiX,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock } from "react-icons/fi";
import { useCartStore } from "../../../shared/store/useStore";
import { useAuthStore } from "../../../shared/store/authStore";
import { useAddressStore } from "../../../shared/store/addressStore";
import { useOrderStore } from "../../../shared/store/orderStore";
import { formatPrice } from "../../../shared/utils/helpers";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";
import MobileLayout from "../components/Layout/MobileLayout";
import MobileCheckoutSteps from "../components/Mobile/MobileCheckoutSteps";
import PageTransition from "../../../shared/components/PageTransition";
import OrderSummary from "../components/Mobile/CheckoutOrderSummary";
import { useBusinessBuyer } from "../hooks/useBusinessBuyer";


const MobileCheckout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, getItemsByVendor } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addresses, getDefaultAddress, addAddress, fetchAddresses } = useAddressStore();
  const { createOrder } = useOrderStore();
  
  const { isBusiness } = useBusinessBuyer();

  // Group items by vendor
  const itemsByVendor = useMemo(
    () => getItemsByVendor(),
    [items, getItemsByVendor]
  );

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [shippingOption, setShippingOption] = useState(() => isBusiness ? "bulk" : "standard");
  const [estimatedShipping, setEstimatedShipping] = useState(null);
  const [isEstimatingShipping, setIsEstimatingShipping] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay"); // "gpay" | "phonepe" | "paytm"
  const [showUpiRedirect, setShowUpiRedirect] = useState(false);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    if (isBusiness) {
      setShippingOption("bulk");
    } else {
      setShippingOption("standard");
    }
  }, [isBusiness]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses().catch(() => null);
    }
  }, [isAuthenticated, fetchAddresses]);

  useEffect(() => {
    let cancelled = false;
    const fetchCoupons = async () => {
      try {
        const response = await api.get("/coupons/available");
        const payload = response?.data ?? response;
        if (!cancelled) {
          setAvailableCoupons(Array.isArray(payload) ? payload : []);
        }
      } catch {
        if (!cancelled) {
          setAvailableCoupons([]);
        }
      }
    };

    fetchCoupons();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));

      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setFormData((prev) => ({
          ...prev,
          name: defaultAddress.fullName || user.name || "",
          email: user.email || "",
          phone: defaultAddress.phone || user.phone || "",
          address: defaultAddress.address || "",
          city: defaultAddress.city || "",
          zipCode: defaultAddress.zipCode || "",
          state: defaultAddress.state || "",
          country: defaultAddress.country || "",
        }));
      }
    }
  }, [isAuthenticated, user, getDefaultAddress, addresses]);

  const calculateShippingFallback = () => {
    const total = getTotal();
    if (isBusiness) {
      return 1500; // Flat B2B bulk cargo pallet fee
    }
    if (shippingOption === "express") {
      return 150; // Express local same-city surcharge
    }
    if (appliedCoupon?.type === "freeship") {
      return 0;
    }
    if (total >= 100) {
      return 0;
    }
    return 50;
  };

  const total = getTotal();
  const shipping = calculateShippingFallback();
  const discount = appliedCoupon ? appliedDiscount : 0;
  const taxableAmount = Math.max(0, total - discount);
  const tax = taxableAmount * 0.18;
  const finalTotal = Math.max(0, total + shipping + tax - discount);

  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setAppliedDiscount(0);
    }
  }, [total, appliedCoupon]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      const validItems = items
        .map((item) => ({
          productId: item?.id,
          quantity: Number(item?.quantity || 1),
          variant: item?.variant || undefined,
        }))
        .filter((item) => item.productId);

      if (!validItems.length) {
        if (active) setEstimatedShipping(0);
        return;
      }

      setIsEstimatingShipping(true);
      try {
        const response = await api.post("/shipping/estimate", {
          items: validItems,
          shippingAddress: {
            country: String(formData.country || "").trim(),
          },
          shippingOption,
          couponType: appliedCoupon?.type || null,
        });

        const payload = response?.data ?? response;
        const nextShipping = Number(payload?.shipping);
        if (active) {
          setEstimatedShipping(Number.isFinite(nextShipping) ? nextShipping : null);
        }
      } catch {
        if (active) {
          setEstimatedShipping(null);
        }
      } finally {
        if (active) {
          setIsEstimatingShipping(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [items, formData.country, shippingOption, appliedCoupon?.type]);

  const handleApplyCoupon = async (codeOverride = "") => {
    const normalizedCode = String(codeOverride || couponCode).trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const response = await api.post("/coupons/validate", {
        code: normalizedCode,
        cartTotal: total,
      });
      const payload = response?.data ?? response;
      const coupon = payload?.coupon;
      const discountAmount = Number(payload?.discount || 0);

      if (!coupon) {
        throw new Error("Invalid coupon response");
      }

      setCouponCode(coupon.code || normalizedCode);
      setAppliedCoupon(coupon);
      setAppliedDiscount(discountAmount);
      toast.success(`Coupon "${coupon.code}" applied!`);
    } catch {
      setAppliedCoupon(null);
      setAppliedDiscount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setFormData({
      ...formData,
      name: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      zipCode: address.zipCode,
      state: address.state,
      country: address.country,
    });
  };

  const handleNewAddress = async (addressData) => {
    try {
      const newAddress = await addAddress(addressData);
      handleSelectAddress(newAddress);
      setShowAddressForm(false);
      toast.success("Address added and selected!");
    } catch (error) {
      toast.error(error?.message || "Failed to add address");
    }
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <button
                onClick={() => navigate("/home")}
                className="gradient-green text-white px-6 py-3 rounded-xl font-semibold">
                Continue Shopping
              </button>
            </div>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedShipping = {
      name: String(formData.name || "").trim(),
      email: String(formData.email || "").trim().toLowerCase(),
      phone: String(formData.phone || "").replace(/\D/g, "").slice(-10),
      address: String(formData.address || "").trim(),
      city: String(formData.city || "").trim(),
      zipCode: String(formData.zipCode || "").trim(),
      state: String(formData.state || "").trim(),
      country: String(formData.country || "").trim(),
    };

    const missingRequired = Object.values(normalizedShipping).some((v) => !v);
    if (missingRequired) {
      toast.error("Please fill all shipping details correctly.");
      return;
    }

    if (normalizedShipping.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (step === 2 && isApplyingCoupon) {
      toast.error("Please wait for coupon validation to complete.");
      return;
    }
    if (step === 2 && isPlacingOrder) {
      return;
    }

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (formData.paymentMethod === "upi") {
        setShippingDetails(normalizedShipping);
        setShowUpiRedirect(true);
        return;
      }

      setIsPlacingOrder(true);
      try {
        const order = await createOrder({
          userId: isAuthenticated ? user?.id : null,
          items: items,
          shippingAddress: normalizedShipping,
          paymentMethod: formData.paymentMethod,
          subtotal: total,
          shipping: shipping,
          tax: tax,
          discount: discount,
          total: finalTotal,
          couponCode: appliedCoupon ? (appliedCoupon.code || couponCode.trim().toUpperCase()) : null,
          shippingOption,
        });

        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-confirmation/${order.id}`);
      } catch (error) {
        toast.error(error?.message || "Failed to place order");
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  const handleCompleteUpiOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      const order = await createOrder({
        userId: isAuthenticated ? user?.id : null,
        items: items,
        shippingAddress: shippingDetails,
        paymentMethod: `upi_${selectedUpiApp}`,
        subtotal: total,
        shipping: shipping,
        tax: tax,
        discount: discount,
        total: finalTotal,
        couponCode: appliedCoupon ? (appliedCoupon.code || couponCode.trim().toUpperCase()) : null,
        shippingOption,
      });

      clearCart();
      toast.success("Order placed successfully!");
      setShowUpiRedirect(false);
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error(error?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full pb-24 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            {/* Title Bar */}
            <div className="px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
            </div>
            {/* Steps Bar */}
            <div className="px-4 pb-3">
              <MobileCheckoutSteps currentStep={step} totalSteps={2} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:px-4 lg:py-6">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left Column - Steps */}
              <div className="lg:col-span-8 space-y-6">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-4 py-4 lg:p-0">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FiTruck className="text-primary-600" />
                      Shipping Information
                    </h2>

                    {/* Saved Addresses */}
                    {isAuthenticated && addresses.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Saved Addresses
                        </h3>
                        <div className="space-y-2 mb-3">
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              onClick={() => handleSelectAddress(address)}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200"
                                }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <FiMapPin className="text-primary-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">
                                      {address.name}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      {address.fullName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {address.address}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {address.city}, {address.state}{" "}
                                      {address.zipCode}
                                    </p>
                                  </div>
                                </div>
                                {selectedAddressId === address.id && (
                                  <FiCheck className="text-primary-600 text-xl flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                          <FiPlus />
                          Add New Address
                        </button>
                      </div>
                    )}

                    {/* Address Form */}
                    <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm lg:p-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-4 py-4 lg:p-0">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FiCreditCard className="text-primary-600" />
                      Payment Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      {["card", "upi", "cash", "bank"].map((method) => (
                        <label
                          key={method}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200"
                            }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formData.paymentMethod === method}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <span className="font-semibold text-gray-800 capitalize text-base">
                            {method === "card"
                              ? "Credit/Debit Card"
                              : method === "upi"
                                ? "UPI Payment (GPay / PhonePe / Paytm)"
                                : method === "cash"
                                  ? "Cash on Delivery"
                                  : "Bank Transfer"}
                          </span>
                        </label>
                      ))}
                    </div>

                    {formData.paymentMethod === "upi" && (
                      <div className="bg-teal-50 border border-teal-150 rounded-2xl p-5 mb-6 space-y-4">
                        <div className="flex items-center gap-2 text-teal-800">
                          <span className="text-sm font-black uppercase tracking-wider">📱 Choose UPI Application</span>
                        </div>
                        <p className="text-xs text-teal-700 font-medium">
                          Select one of the supported UPI apps. You will be redirected to authorize the payment securely.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "gpay", label: "Google Pay", color: "border-blue-400 bg-blue-50/50 text-blue-900", icon: "🟢" },
                            { id: "phonepe", label: "PhonePe", color: "border-purple-400 bg-purple-50/50 text-purple-900", icon: "🟣" },
                            { id: "paytm", label: "Paytm", color: "border-cyan-400 bg-cyan-50/50 text-cyan-900", icon: "🔵" },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.id)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                                selectedUpiApp === app.id
                                  ? `${app.color} ring-2 ring-teal-500 ring-offset-2`
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xl">{app.icon}</span>
                              <span>{app.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-teal-700 text-center font-medium mt-1">
                          Payment app: <strong className="capitalize">{selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp}</strong> will be launched upon clicking "Place Order".
                        </p>
                      </div>
                    )}

                    {/* B2C/B2B Smart Shipping Options */}
                    <div className="mb-6">
                      <h3 className="text-base font-bold text-gray-800 mb-3">
                        Shipping & Logistics Options
                      </h3>
                      {isBusiness ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="shippingOption"
                              value="bulk"
                              checked={true}
                              readOnly
                              className="w-5 h-5 text-primary-500 mt-1"
                            />
                            <div className="flex-1">
                              <span className="font-extrabold text-blue-900 text-base flex items-center gap-1.5">
                                <span>📦 B2B Bulk Pallet Dispatch</span>
                                <span className="bg-blue-100 text-blue-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full border border-blue-200">
                                  Enterprise SLA
                                </span>
                              </span>
                              <p className="text-xs text-blue-750 font-bold mt-1">
                                Estimated Handover: 3–5 Business Days
                              </p>
                              <p className="text-[10px] text-blue-700 leading-normal mt-1">
                                High-volume pallet security dispatch with priority freight logistics. Delivery is fully vetted and audited for business invoice clearance.
                              </p>
                            </div>
                            <span className="font-black text-blue-900 shrink-0 text-sm">
                              {formatPrice(1500)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Express Local same-city shipping option */}
                          <label
                            className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingOption === "express"
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200"
                              }`}>
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="shippingOption"
                                value="express"
                                checked={shippingOption === "express"}
                                onChange={(e) => setShippingOption(e.target.value)}
                                className="w-5 h-5 text-primary-500 mt-1"
                              />
                              <div>
                                <span className="font-bold text-gray-800 text-base flex items-center gap-1.5">
                                  <span>⚡ Local Same-City Express</span>
                                </span>
                                <p className="text-xs text-gray-700 font-semibold mt-0.5">
                                  Delivered inside 8–16 Hours
                                </p>
                                <p className="text-[10px] text-gray-400 leading-normal mt-0.5 max-w-[280px]">
                                  Guaranteed same-day local dispatch loop inside municipal metro limits.
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-800 shrink-0">
                              {formatPrice(150)}
                            </span>
                          </label>

                          {/* Standard shipping option */}
                          <label
                            className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingOption === "standard"
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200"
                              }`}>
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="shippingOption"
                                value="standard"
                                checked={shippingOption === "standard"}
                                onChange={(e) => setShippingOption(e.target.value)}
                                className="w-5 h-5 text-primary-500 mt-1"
                              />
                              <div>
                                <span className="font-bold text-gray-800 text-base">
                                  Standard National Courier
                                </span>
                                <p className="text-xs text-gray-700 font-semibold mt-0.5">
                                  Delivered in 2–4 Business Days
                                </p>
                                <p className="text-[10px] text-gray-400 leading-normal mt-0.5 max-w-[280px]">
                                  Nationwide delivery via regional express cargo lines.
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-800 shrink-0">
                              {total >= 100 ? "FREE" : formatPrice(50)}
                            </span>
                          </label>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Logistics Cost Verified: {formatPrice(shipping)}</span>
                      </p>
                    </div>

                    {/* Coupon Code */}
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-gray-800 mb-3">
                        Coupon Code
                      </h3>
                      {!appliedCoupon ? (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter code"
                              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              disabled={isApplyingCoupon}
                              className="px-4 py-3 gradient-green text-white rounded-xl font-semibold hover:shadow-glow-green transition-all">
                              {isApplyingCoupon ? "Applying..." : "Apply"}
                            </button>
                          </div>
                          {availableCoupons.length > 0 && (
                            <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FiTag className="text-primary-600" />
                                Available coupons
                              </h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {availableCoupons.slice(0, 8).map((coupon) => (
                                  <button
                                    key={coupon._id || coupon.code}
                                    type="button"
                                    onClick={() => handleApplyCoupon(coupon.code)}
                                    disabled={isApplyingCoupon}
                                    className="w-full text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-gray-800">{coupon.code}</p>
                                      <p className="text-xs font-semibold text-primary-700">
                                        {coupon.type === "percentage"
                                          ? `${coupon.value}% OFF`
                                          : coupon.type === "fixed"
                                            ? `${formatPrice(coupon.value)} OFF`
                                            : "Free Shipping"}
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Min order: {formatPrice(coupon.minOrderValue || 0)}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-green-800">
                              {appliedCoupon.code || "Coupon"} Applied
                            </p>
                            <p className="text-xs text-green-600">
                              Code: {couponCode}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedCoupon(null);
                              setAppliedDiscount(0);
                              setCouponCode("");
                            }}
                            className="text-red-600 hover:text-red-700">
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Available Offers & Suggestions (UI Only) */}
                    <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-primary-600">
                        <FiTag className="text-lg" />
                        <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">
                          Available Savings & Offers
                        </h3>
                      </div>
                      
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Potential Savings Available</p>
                          <p className="text-[10px] text-emerald-600">Try applying coupon codes listed below to save extra.</p>
                        </div>
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                          Save Up To 20%
                        </span>
                      </div>

                      {/* Coupon Suggestions */}
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-gray-850">🏦 SBI Card 10% Discount</span>
                            <span className="font-mono font-bold text-[#C07A3D]">SBISAVE10</span>
                          </div>
                          <p className="text-[10px] text-gray-400">Min transaction: ₹5,000. Save up to ₹1,500.</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-gray-850">🎉 Site-wide Festival Sale</span>
                            <span className="font-mono font-bold text-[#C07A3D]">FESTIVAL20</span>
                          </div>
                          <p className="text-[10px] text-gray-400">Flat 20% off all products across clothing & accessories.</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary (Mobile Only) */}
                    <div className="glass-card rounded-xl p-4 lg:hidden">
                      <OrderSummary
                        itemsByVendor={itemsByVendor}
                        total={total}
                        discount={discount}
                        shipping={shipping}
                        tax={tax}
                        finalTotal={finalTotal}
                        formatPrice={formatPrice}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Desktop Order Summary */}
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <OrderSummary
                      itemsByVendor={itemsByVendor}
                      total={total}
                      discount={discount}
                      shipping={shipping}
                      tax={tax}
                      finalTotal={finalTotal}
                      formatPrice={formatPrice}
                    />
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <button
                        type="submit"
                        disabled={step === 2 && isPlacingOrder}
                        className="w-full gradient-green text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-glow-green transition-all duration-300 transform hover:-translate-y-0.5">
                        {step === 2 ? (isPlacingOrder ? "Placing Order..." : "Place Order") : "Continue to Payment"}
                      </button>
                      {step === 2 && (
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-full mt-3 py-2 text-gray-500 font-semibold hover:text-gray-700 transition-colors text-sm">
                          Back to Shipping
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trust Badges or Info */}
                  <div className="flex justify-center gap-4 text-gray-400 text-2xl pt-2 opacity-70">
                    <FiLock className="w-6 h-6" />
                    <span className="text-xs text-gray-500">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons (Mobile Fixed Bottom) */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 safe-area-bottom lg:hidden">
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={step === 2 && isPlacingOrder}
                  className="flex-1 gradient-green text-white py-3 rounded-xl font-semibold hover:shadow-glow-green transition-all duration-300">
                  {step === 2 ? (isPlacingOrder ? "Placing..." : "Place Order") : "Continue"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Address Form Modal */}
        <AnimatePresence>
          {showAddressForm && (
            <AddressFormModal
              onSubmit={handleNewAddress}
              onCancel={() => setShowAddressForm(false)}
            />
          )}
        </AnimatePresence>

        {/* UPI Redirect Modal */}
        <AnimatePresence>
          {showUpiRedirect && (
            <UpiRedirectModal
              upiApp={selectedUpiApp}
              totalAmount={finalTotal}
              onSuccess={handleCompleteUpiOrder}
              onCancel={() => setShowUpiRedirect(false)}
            />
          )}
        </AnimatePresence>
      </MobileLayout>
    </PageTransition>
  );
};

// Address Form Modal Component
const AddressFormModal = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onCancel}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address Label
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              placeholder="Home, Work, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 gradient-green text-white py-3 rounded-xl font-semibold hover:shadow-glow-green transition-all">
              Add Address
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Simulated Fullscreen UPI redirect payment gateway
const UpiRedirectModal = ({ upiApp, totalAmount, onSuccess, onCancel }) => {
  const [paymentState, setPaymentState] = useState("redirecting"); // "redirecting" | "authorizing"

  useEffect(() => {
    // Stage 1: Redirecting simulation (1.5 seconds)
    const redirectTimer = setTimeout(() => {
      setPaymentState("authorizing");
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, []);

  // Theme configuration based on the chosen app
  const appThemes = {
    gpay: {
      name: "Google Pay",
      bgColor: "bg-blue-600",
      textColor: "text-blue-900",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-200",
      btnColor: "bg-blue-600 hover:bg-blue-750 focus:ring-blue-400",
      logo: "🟢",
    },
    phonepe: {
      name: "PhonePe",
      bgColor: "bg-purple-700",
      textColor: "text-purple-900",
      bgLight: "bg-purple-50",
      borderColor: "border-purple-200",
      btnColor: "bg-purple-700 hover:bg-purple-800 focus:ring-purple-400",
      logo: "🟣",
    },
    paytm: {
      name: "Paytm",
      bgColor: "bg-cyan-600",
      textColor: "text-cyan-900",
      bgLight: "bg-cyan-50",
      borderColor: "border-cyan-200",
      btnColor: "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-400",
      logo: "🔵",
    },
  };

  const theme = appThemes[upiApp] || appThemes.gpay;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-150 flex flex-col min-h-[420px]"
      >
        {/* App Bar Header */}
        <div className={`p-5 ${theme.bgColor} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{theme.logo}</span>
            <span className="font-extrabold tracking-wide text-lg">{theme.name}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
            Secure UPI
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
          {paymentState === "redirecting" && (
            <div className="space-y-4 py-8">
              <div className="w-16 h-16 border-4 border-t-transparent border-teal-500 rounded-full animate-spin mx-auto"></div>
              <p className="font-bold text-gray-750 text-base">
                Redirecting to {theme.name} sandbox...
              </p>
              <p className="text-xs text-gray-400">
                Launching payment interface. Do not refresh or press back.
              </p>
            </div>
          )}

          {paymentState === "authorizing" && (
            <div className="space-y-6 w-full">
              {/* Payment Details Card */}
              <div className={`${theme.bgLight} border ${theme.borderColor} rounded-2xl p-5 text-left space-y-3`}>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Merchant</span>
                  <span className="font-extrabold text-gray-800">PLE eCommerce Store</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Transaction ID</span>
                  <span className="font-mono font-bold text-gray-800">TXN{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">Total Payable Amount</span>
                  <span className="text-xl font-black text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Action Prompt */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800">
                  Confirm UPI Authorization
                </p>
                <p className="text-xs text-gray-500 px-4">
                  Please tap the button below to simulate entering your security UPI PIN and complete payment transaction.
                </p>
              </div>

              {/* Complete / Cancel Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={onSuccess}
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition-all ${theme.btnColor}`}
                >
                  Pay & Authorize {formatPrice(totalAmount)}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2.5 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Powered by logo */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-bold">
          <span>🔒 Powered by UPI Unified Payments Interface</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileCheckout;

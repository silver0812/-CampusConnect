import React, { useState } from 'react';
import { ShopItem, CartItem, Transaction, Role } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  CreditCard, 
  ShieldCheck, 
  Receipt, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag as CartIcon,
  Tag as CouponIcon,
  Ticket,
  ArrowRight,
  ChevronRight,
  Download,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentsViewProps {
  shopItems: ShopItem[];
  cart: CartItem[];
  transactions: Transaction[];
  userRole: Role;
  username: string;
  onAddToCart: (item: ShopItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateCartQuantity: (itemId: string, quantity: number) => void;
  onCompleteCheckout: (transactionDetails: Omit<Transaction, 'id' | 'date'>) => void;
}

export default function PaymentsView({
  shopItems,
  cart,
  transactions,
  userRole,
  username,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onCompleteCheckout,
}: PaymentsViewProps) {
  const [activeCatalog, setActiveCatalog] = useState<'all' | 'dues' | 'merch'>('all');
  const [coupon, setCoupon] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0); // e.g. 0.15 for 15%
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Multi-step Checkout Dialog State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'receipt'>('form');
  
  // Payment Gateways input state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [walletEmail, setWalletEmail] = useState('');
  
  // validation error states
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<Transaction | null>(null);

  // Filter Catalog items
  const filteredCatalog = shopItems.filter(item => activeCatalog === 'all' || item.category === activeCatalog);

  // Cart math
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const discountAmount = cartSubtotal * activeDiscount;
  const cartTax = (cartSubtotal - discountAmount) * 0.08; // 8% sales tax simulation
  const cartTotal = (cartSubtotal - discountAmount) + cartTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    
    if (coupon.trim().toUpperCase() === 'CAMPUS2026') {
      setActiveDiscount(0.15); // 15% discount
      setCouponSuccess("Coupon 'CAMPUS2026' applied! Enjoy 15% off dues & merch.");
    } else {
      setCouponError("Invalid promo code. Try using 'CAMPUS2026' for test discount!");
    }
  };

  const startCheckoutFlow = () => {
    if (cart.length === 0) return;
    setCheckoutStep('form');
    setPaymentError(null);
    setIsCheckingOut(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Basic secure checks
    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 13 || isNaN(Number(cleanNum))) {
        setPaymentError("Invalid Card Number format. Please input a minimum of 13 digits.");
        return;
      }
      if (!cardName.trim()) {
        setPaymentError("Cardholder Name is required.");
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 4) {
        setPaymentError("Expiry Date must be in MM/YY format.");
        return;
      }
      if (cardCvv.length < 3 || isNaN(Number(cardCvv))) {
        setPaymentError("Invalid CVV number. Must be 3 or 4 digits.");
        return;
      }
    } else {
      if (!walletEmail.includes('@') || walletEmail.length < 5) {
        setPaymentError("Please define a valid Venmo or PayPal email account.");
        return;
      }
    }

    // Step into visual Processing
    setCheckoutStep('processing');

    // Simulate Secure Gateway verification with PCI-DSS standard (1.5 seconds latency feedback)
    setTimeout(() => {
      const mockPayId = 'PAY-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      
      const transactionObj: Omit<Transaction, 'id' | 'date'> = {
        items: cart.map(c => ({
          name: c.item.name,
          price: c.item.price,
          quantity: c.quantity
        })),
        total: parseFloat(cartTotal.toFixed(2)),
        paymentMethod: paymentMethod === 'card' ? 'Visa/Mastercard Credit' : `PayPal Wallet (${walletEmail})`,
        paymentId: mockPayId,
        status: 'success'
      };

      onCompleteCheckout(transactionObj);

      // Save a local copy of invoice for visual receipt display
      const savedInvoice: Transaction = {
        ...transactionObj,
        id: 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setGeneratedInvoice(savedInvoice);
      setCheckoutStep('receipt');

      // Clear input checkout variables
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
      setWalletEmail('');
    }, 1500);
  };

  const closeCheckoutModule = () => {
    setIsCheckingOut(false);
    setGeneratedInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 id="dues-shop-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-600" />
            Fees, Dues &amp; Organization Shop
          </h2>
          <p className="text-sm text-slate-500">Pay annual membership dues, acquire custom organization merch, and support operations</p>
        </div>

        {/* Tab category loaders */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          {(['all', 'dues', 'merch'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCatalog(tab)}
              className={`px-3 py-1 rounded-md transition-all capitalize ${
                activeCatalog === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'all' ? '🛍️ Full Catalog' : tab === 'dues' ? '💳 Fees & Dues' : '👕 Custom Merch'}
            </button>
          ))}
        </div>
      </div>

      {/* Main split: Catalog on Left, Shopping Cart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Catalog grid (Col-span 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCatalog.map(item => (
            <div 
              key={item.id} 
              id={`shop-item-${item.id}`}
              className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Product Info Display block */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full border ${
                    item.category === 'dues' 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {item.category === 'dues' ? 'Official Fee' : 'Organization Merch'}
                  </span>
                  
                  <span className="text-sm font-extrabold text-slate-900 text-right shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">{item.description}</p>
                </div>
              </div>

              {/* Purchase button trigger */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">
                  {item.category === 'dues' ? 'Individual Dues' : 'Ships immediately'}
                </span>

                <button
                  id={`btn-add-to-cart-${item.id}`}
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-1.5 py-1 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all"
                >
                  <CartIcon className="h-3 w-3" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar (Col-span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-slate-400 shrink-0" />
              Order Checkout Cart
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full select-none">
              {cart.reduce((s, c) => s + c.quantity, 0)} Items
            </span>
          </div>

          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-0.5">
            {cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-xs flex-1">
                  <p className="font-bold text-slate-800 leading-snug line-clamp-1">{cartItem.item.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">${cartItem.item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-200 rounded-md bg-white">
                    <button
                      onClick={() => onUpdateCartQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="px-1.5 py-0.5 hover:bg-slate-50 text-slate-500 font-semibold text-xs rounded-l"
                    >
                      -
                    </button>
                    <span className="px-2 py-0.5 text-xs font-bold font-mono select-none">{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdateCartQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="px-1.5 py-0.5 hover:bg-slate-50 text-slate-500 font-semibold text-xs rounded-r"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(cartItem.item.id)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-slate-400 text-center py-8 text-xs font-medium font-sans">
                Shopping Cart is empty. Select goods on the catalog.
              </div>
            )}
          </div>

          {/* Coupon discount block */}
          {cart.length > 0 && (
            <form onSubmit={handleApplyCoupon} className="space-y-2 border-t pt-2.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apply Promo Discount Code</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. CAMPUS2026"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none bg-slate-50 bg-white uppercase font-bold"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800 font-bold flex items-center gap-1.5"
                >
                  <CouponIcon className="h-3 w-3" />
                  Apply
                </button>
              </div>
              
              {couponSuccess && (
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {couponError}
                </p>
              )}
            </form>
          )}

          {/* Checkout calculation details */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 pt-3 text-xs space-y-2.5">
              <div className="flex justify-between items-center text-slate-500">
                <span>Subtotal amount</span>
                <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
              </div>
              {activeDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span>Discount ({activeDiscount * 100}%)</span>
                  <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-slate-500">
                <span>Sales Tax (8% VAT)</span>
                <span className="font-semibold text-slate-800">${cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-extrabold text-sm border-t border-dashed pt-2 text-slate-900">
                <span>Order Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button
                id="btn-trigger-checkout"
                onClick={startCheckoutFlow}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold rounded-lg text-xs shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed Secure checkout
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Historical Purchases Receipts list (Only if user has previous success transactions) */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Receipt className="h-4.5 w-4.5 text-indigo-500" />
          Recent Invoices &amp; Log Statements
        </h3>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 font-sans py-2">No preceding checkouts or dues histories registered.</p>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden shadow-xs divide-y">
            {transactions.map((txn, index) => (
              <div key={txn.id || index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 uppercase">{txn.id || `TXN-${index}`}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 rounded-full font-bold uppercase">
                      Paid Successful
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Date: {txn.date} | gateway: {txn.paymentMethod}</p>
                  
                  {/* Detailed list display within receipt history */}
                  <div className="text-[11px] text-slate-600 font-medium pt-1">
                    {txn.items.map((i, k) => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-slate-900">${txn.total.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      setGeneratedInvoice(txn);
                      setCheckoutStep('receipt');
                      setIsCheckingOut(true);
                    }}
                    className="p-1 px-3 border border-indigo-100 text-indigo-600 bg-indigo-50/20 rounded hover:bg-indigo-50 hover:text-indigo-700 font-semibold text-[10px] flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Download className="h-3 w-3" />
                    Open Receipt Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Secure Gateway Dialog Backdrop Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-800 rounded-xl overflow-hidden w-full max-w-md shadow-2xl relative border"
            >
              {/* Checkout Step layout */}
              {checkoutStep === 'form' && (
                <form onSubmit={handleProcessPayment} className="p-5 space-y-4">
                  {/* dialog header */}
                  <div className="flex items-start justify-between border-b pb-3 mb-1 bg-slate-50/50 -m-5 p-5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
                        <CreditCard className="h-4.5 w-4.5 text-indigo-600" />
                        PCI-DSS Secure Payment Gateway
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">SSL 256-Bit Encrypted Secure transaction logs</p>
                    </div>
                    <button 
                      type="button"
                      onClick={closeCheckoutModule}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Payment gateway selection */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all outline-none ${
                        paymentMethod === 'card' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      💳 Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`py-2 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all outline-none ${
                        paymentMethod === 'wallet' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      📱 Venmo / Paypal
                    </button>
                  </div>

                  {paymentError && (
                    <div className="p-2 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] rounded-lg font-semibold flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                      {paymentError}
                    </div>
                  )}

                  {/* Display inputs dependent of Payment gateway Choice */}
                  {paymentMethod === 'card' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Secure Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => {
                            // Basic spacer formatting
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = v.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            if (parts.length > 0) {
                              setCardNumber(parts.join(' '));
                            } else {
                              setCardNumber(v);
                            }
                          }}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none font-semibold focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cardholder Printed Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none font-semibold focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date (MM/YY)</label>
                          <input
                            type="text"
                            required
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/[^0-9/]/g, '');
                              setCardExpiry(v);
                            }}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV / Security Code</label>
                          <input
                            type="password"
                            required
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venmo / PayPal account Email</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={walletEmail}
                        onChange={(e) => setWalletEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none font-semibold focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  )}

                  {/* PCI secure labels */}
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-center justify-between text-[11px] text-emerald-800">
                    <span className="flex items-center gap-1.5 font-sans font-semibold">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                      100% SECURE CHECKOUT
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 select-none">PCI-DSS COMPLIANT</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
                    <button
                      type="button"
                      onClick={closeCheckoutModule}
                      className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 text-slate-500 font-semibold"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold shadow-md shadow-emerald-500/10 flex items-center gap-1"
                    >
                      Pay ${cartTotal.toFixed(2)} Securely
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'processing' && (
                <div className="p-6 text-center space-y-4">
                  <div className="relative h-12 w-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                  </div>

                  <div className="space-y-1 bg-white">
                    <p className="text-sm font-bold text-slate-800">Transmitting Token Details...</p>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Verifying secure PCI-DSS gateway authentication with credit card network. Do not close browser page.
                    </p>
                  </div>
                </div>
              )}

              {checkoutStep === 'receipt' && generatedInvoice && (
                <div className="p-5 space-y-4">
                  {/* Header stamp */}
                  <div className="text-center font-sans">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto fill-emerald-50 mb-1" />
                    <h3 className="text-sm font-bold text-slate-800">Checkout Successful</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Dues log automatically resolved to PAID</p>
                  </div>

                  {/* Receipt body details */}
                  <div className="border border-dashed p-4 rounded-xl bg-slate-50 space-y-3 select-all font-sans">
                    <div className="flex justify-between text-[11px] text-slate-400 border-b pb-1.5 font-bold uppercase tracking-wider">
                      <span>Receipt Invoice:</span>
                      <span className="text-slate-800 font-extrabold text-right">{generatedInvoice.id}</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {generatedInvoice.items.map((i, k) => (
                        <div key={k} className="flex justify-between text-slate-700 font-medium">
                          <span>{i.name} (x{i.quantity})</span>
                          <span>${(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-2 space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between items-center">
                        <span>Gateway:</span>
                        <span className="font-semibold text-slate-850">{generatedInvoice.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Transaction reference ID:</span>
                        <span className="font-bold underline text-slate-800 uppercase">{generatedInvoice.paymentId}</span>
                      </div>
                      <div className="flex justify-between items-center font-extrabold text-xs text-slate-900 pt-1 border-t border-slate-200">
                        <span>Paid Total:</span>
                        <span className="text-sm text-indigo-600">${generatedInvoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold flex items-center gap-1"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print receipt
                    </button>
                    <button
                      type="button"
                      onClick={closeCheckoutModule}
                      className="px-5 py-1.5 bg-slate-900 border text-white font-bold rounded-lg"
                    >
                      Close Invoice
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

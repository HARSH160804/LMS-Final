import api from './api';

const purchaseService = {
    // Stripe
    createStripeCheckoutSession: (courseId) => {
        return api.post('/purchase/checkout/create-checkout-session', { courseId });
    },

    // Razorpay
    createRazorpayOrder: (courseId) => {
        return api.post('/razorpay/create-order', { courseId });
    },

    verifyRazorpayPayment: (paymentData) => {
        // paymentData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        return api.post('/razorpay/verify-payment', paymentData);
    },

    // Free course enrollment
    enrollFree: (courseId) => {
        return api.post('/purchase/enroll-free', { courseId });
    },

    // General Purchase
    getPurchaseStatus: (courseId) => {
        return api.get(`/purchase/course/${courseId}/detail-with-status`);
    },

    getMyPurchasedCourses: () => {
        return api.get('/purchase');
    }
};

export default purchaseService;


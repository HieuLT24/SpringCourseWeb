import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class PaymentService {
  async processPayment(paymentData) {
    try {
      const response = await axios.post(endpoints.payments.process, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xử lý thanh toán thất bại' 
      };
    }
  }

  async checkPaymentStatus(transactionId) {
    try {
      const url = buildUrl(endpoints.payments.checkStatus, { transactionId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Kiểm tra trạng thái thanh toán thất bại' 
      };
    }
  }

  async handleMoMoCallback(callbackData) {
    try {
      const response = await axios.post(endpoints.payments.momoCallback, callbackData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xử lý callback MoMo thất bại' 
      };
    }
  }

  async handleMoMoReturn(returnData) {
    try {
      const response = await axios.get(endpoints.payments.momoReturn, {
        params: returnData
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xử lý return MoMo thất bại' 
      };
    }
  }

  async handleVNPayCallback(callbackData) {
    try {
      const response = await axios.post(endpoints.payments.vnpayCallback, null, {
        params: callbackData
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xử lý callback VNPay thất bại' 
      };
    }
  }
}

export const paymentService = new PaymentService();

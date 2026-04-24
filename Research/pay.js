// utils/paymentHandler.js
export class PaymentHandler {
  constructor() {
    this.maxRetryCount = 3;      // 最大重试次数
    this.retryDelay = 2000;      // 重试延迟(ms)
    this.timeout = 30000;        // 支付超时时间(ms)
    this.currentRetry = 0;
  }

  /**
   * 发起支付（核心方法）
   */
  async requestPayment(options) {
    const { orderId, amount, paymentType = 'wxpay' } = options;
    
    try {
      // 1. 预检查
      await this.preCheck();
      
      // 2. 生成支付参数
      const paymentParams = await this.generatePaymentParams({
        orderId,
        amount,
        paymentType
      });
      
      // 3. 记录支付开始
      await this.recordPaymentStart(orderId, paymentParams);
      
      // 4. 调用平台支付
      const result = await this.invokePlatformPayment(paymentParams, paymentType);
      
      // 5. 处理支付结果
      return await this.handlePaymentResult(result, orderId);
      
    } catch (error) {
      // 6. 异常处理
      return await this.handlePaymentError(error, orderId, options);
    }
  }

  /**
   * 支付前检查
   */
  async preCheck() {
    const checks = [
      this.checkNetwork(),
      this.checkLoginStatus(),
      this.checkPaymentAvailable()
    ];
    
    const results = await Promise.allSettled(checks);
    
    for (const result of results) {
      if (result.status === 'rejected') {
        throw new PaymentPrecheckError(result.reason.message);
      }
    }
  }

  /**
   * 调用平台支付API
   */
  async invokePlatformPayment(paymentParams, paymentType) {
    return new Promise((resolve, reject) => {
      const paymentMap = {
        wxpay: () => uni.requestPayment({
          provider: 'wxpay',
          orderInfo: paymentParams,
          success: resolve,
          fail: reject
        }),
        alipay: () => uni.requestPayment({
          provider: 'alipay',
          orderInfo: paymentParams,
          success: resolve,
          fail: reject
        })
      };

      const paymentMethod = paymentMap[paymentType];
      if (!paymentMethod) {
        reject(new Error(`不支持的支付类型: ${paymentType}`));
        return;
      }

      // 设置支付超时
      const timeoutId = setTimeout(() => {
        reject(new PaymentTimeoutError('支付超时'));
      }, this.timeout);

      // 执行支付
      paymentMethod();
      
      // 支付完成后清除超时
      clearTimeout(timeoutId);
    });
  }

  /**
   * 处理支付异常
   */
  async handlePaymentError(error, orderId, options) {
    const errorHandler = new PaymentErrorHandler(error, orderId, options);
    
    // 根据错误类型采取不同策略
    if (error instanceof NetworkError) {
      return await errorHandler.handleNetworkError();
    } else if (error instanceof UserCancelError) {
      return await errorHandler.handleUserCancel();
    } else if (error instanceof PasswordError) {
      return await errorHandler.handlePasswordError();
    } else if (error instanceof PaymentTimeoutError) {
      return await errorHandler.handleTimeoutError();
    } else {
      return await errorHandler.handleUnknownError();
    }
  }

  /**
   * 重试机制
   */
  async retryPayment(action, options = {}) {
    const { maxRetries = this.maxRetryCount, delay = this.retryDelay } = options;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // 指数退避延迟
        const waitTime = delay * Math.pow(2, attempt - 1);
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * 查询订单支付状态
   */
  async queryPaymentStatus(orderId) {
    try {
      const response = await uni.request({
        url: '/api/payment/status',
        method: 'GET',
        data: { orderId }
      });
      
      return response.data;
    } catch (error) {
      console.error('查询支付状态失败:', error);
      throw error;
    }
  }
}
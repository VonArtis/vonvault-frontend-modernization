import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import type { 
  Investment, 
  InvestmentPlan,
  InvestmentPlansResponse,
  InvestmentsResponse,
  MembershipStatus,
  MembershipTiersResponse,
  User
} from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API_BASE = `${BACKEND_URL}/api`;
const API_V1_BASE = `${BACKEND_URL}/api/v1`;  // Use v1 APIs for new features
const API_LEGACY_BASE = `${BACKEND_URL}/api`; // Keep legacy for existing features

// Input validation utilities
class InputValidator {
  static sanitizeString(input: string): string {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter'); 
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');
    
    return { valid: errors.length === 0, errors };
  }
}

class ApiService {
  private getAuthHeaders(token?: string) {
    const authToken = token || secureStorage.getToken();
    console.log('ApiService: Getting auth headers, token exists:', !!authToken);
    console.log('ApiService: Token length:', authToken ? authToken.length : 0);
    return {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    };
  }

  // Enhanced error handling - handles all backend error formats
  private handleApiError(error: any) {
    console.error('API Error Details:', error.response?.data);
    
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails = {};
    
    // New standardized error format (Priority)
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
      errorCode = error.response.data.error.code || 'UNKNOWN_ERROR';
      errorDetails = error.response.data.error.details || {};
    }
    // New standardized error format - direct error object
    else if (error.response?.data?.error && typeof error.response.data.error === 'object' && error.response.data.error.message) {
      errorMessage = error.response.data.error.message;
      errorCode = error.response.data.error.code || 'UNKNOWN_ERROR';
      errorDetails = error.response.data.error.details || {};
    }
    // Legacy error format - string error field
    else if (error.response?.data?.error && typeof error.response.data.error === 'string') {
      errorMessage = error.response.data.error;
      errorCode = 'LEGACY_ERROR';
    }
    // FastAPI HTTPException format
    else if (error.response?.data?.detail) {
      // Handle both string and object detail formats
      if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
        errorCode = 'HTTP_EXCEPTION';
      } else if (error.response.data.detail?.error?.message) {
        // New format wrapped in detail
        errorMessage = error.response.data.detail.error.message;
        errorCode = error.response.data.detail.error.code || 'HTTP_EXCEPTION';
        errorDetails = error.response.data.detail.error.details || {};
      }
    }
    // Custom message format  
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      errorCode = 'CUSTOM_MESSAGE';
    }
    // Validation errors (array format)
    else if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
      const validationErrors = error.response.data.detail.map((err: any) => err.msg).join(', ');
      errorMessage = `Validation failed: ${validationErrors}`;
      errorCode = 'VALIDATION_ERROR';
    }
    // Reason field format
    else if (error.response?.data?.reason) {
      errorMessage = error.response.data.reason;
      errorCode = 'REASON_ERROR';
    }
    // Axios error message
    else if (error.message) {
      errorMessage = error.message;
      errorCode = 'NETWORK_ERROR';
    }
    
    // Create enhanced error object
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).code = errorCode;
    (enhancedError as any).details = errorDetails;
    (enhancedError as any).status = error.response?.status;
    
    throw enhancedError;
  }

  // Generic API request method for admin endpoints
  async makeRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, token?: string) {
    try {
      const config = {
        method: method.toLowerCase(),
        url: `${API_BASE}${endpoint}`,
        headers: this.getAuthHeaders(token),
        ...(data && { data })
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  // Authentication
  async telegramAuth(userData: any) {
    const response = await axios.post(`${API_V1_BASE}/auth/telegram`, userData);
    return response.data;
  }

  async telegramWebAppAuth(data: { initData: string }) {
    const response = await axios.post(`${API_V1_BASE}/auth/telegram/webapp`, data);
    return response.data;
  }

  // User Management - Signup/Login (Using API v1)
  async signup(userData: { name: string; email: string; password: string; phone: string; country_code: string }) {
    const response = await axios.post(`${API_V1_BASE}/auth/signup`, userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_V1_BASE}/auth/login`, credentials);
    return response.data;
  }

  async getCurrentUser(token: string) {
    const response = await axios.get(`${API_V1_BASE}/auth/me`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Avatar Selection Management
  async selectAvatar(avatarId: string) {
    const response = await axios.post(`${API_BASE}/user/avatar`, 
      { avatar_id: avatarId },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getAvailableAvatars() {
    const response = await axios.get(`${API_BASE}/user/avatars`);
    return response.data;
  }
  // Membership
  async getMembershipStatus(token: string): Promise<MembershipStatus> {
    const response = await axios.get(`${API_V1_BASE}/membership/status`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getMembershipTiers(): Promise<MembershipTiersResponse> {
    const response = await axios.get(`${API_V1_BASE}/membership/tiers`);
    return response.data;
  }

  // Investment Plans
  async getInvestmentPlans(token: string): Promise<InvestmentPlansResponse> {
    const response = await axios.get(`${API_V1_BASE}/investment-plans`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAllInvestmentPlans(): Promise<{ plans: InvestmentPlan[] }> {
    const response = await axios.get(`${API_V1_BASE}/investment-plans/all`);
    return response.data;
  }

  async createInvestmentPlan(planData: any, token: string) {
    const response = await axios.post(`${API_V1_BASE}/investment-plans`, planData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async updateInvestmentPlan(planId: string, planData: any, token: string) {
    const response = await axios.put(`${API_V1_BASE}/investment-plans/${planId}`, planData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async deleteInvestmentPlan(planId: string, token: string) {
    const response = await axios.delete(`${API_V1_BASE}/investment-plans/${planId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Investments
  async getInvestments(token: string): Promise<InvestmentsResponse> {
    const response = await axios.get(`${API_V1_BASE}/investments`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async createInvestment(investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'status'>, token: string) {
    const response = await axios.post(`${API_V1_BASE}/investments`, investment, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Crypto & Wallet
  async verifyWalletSignature(payload: { message: string; signature: string; address: string }) {
    const response = await axios.post(`${API_BASE}/wallet/verify-signature`, payload);
    return response.data;
  }

  async getCryptoBalance(address: string) {
    const response = await axios.get(`${API_BASE}/wallet/balance/${address}`);
    return response.data;
  }

  // Enhanced Crypto Methods
  async getCryptoDepositAddresses(token: string) {
    const response = await axios.get(`${API_V1_BASE}/crypto/deposit-addresses`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAllCryptoBalances(token: string) {
    const response = await axios.get(`${API_V1_BASE}/crypto/balances`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getCryptoTransactions(token: string) {
    const response = await axios.get(`${API_V1_BASE}/crypto/transactions`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async monitorCryptoDeposits(token: string) {
    const response = await axios.post(`${API_V1_BASE}/crypto/monitor-deposits`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getUserCryptoBalance(userAddress: string, token: string) {
    const response = await axios.get(`${API_BASE}/crypto/user-balance/${userAddress}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Bank
  async getBankAccounts(userId: string) {
    const response = await axios.get(`${API_BASE}/bank/accounts`, {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  }

  async getBankBalance(userId: string) {
    const response = await axios.get(`${API_BASE}/bank/balance`, {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  }

  // Portfolio
  async getPortfolio(token: string): Promise<PortfolioResponse> {
    const response = await axios.get(`${API_V1_BASE}/portfolio`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Crypto Prices
  async getCryptoPrices() {
    const response = await axios.get(`${API_BASE}/prices`);
    return response.data;
  }

  // Profile
  async saveProfile(preferences: any, token: string) {
    const response = await axios.post(`${API_BASE}/profile`, preferences, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getProfile(userId: string, token: string) {
    const response = await axios.get(`${API_BASE}/profile/${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === PHASE 2: MULTI-WALLET API METHODS (EXACT SPECIFICATION) ===

  // Get all user wallets
  async getUserWallets(token: string) {
    const response = await axios.get(`${API_BASE}/wallets`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Connect new wallet
  async connectWallet(token: string, walletData: {
    type: string;
    address: string;
    name?: string;
    networks: string[];
  }) {
    const response = await axios.post(`${API_BASE}/wallets/connect`, null, {
      headers: this.getAuthHeaders(token),
      params: walletData
    });
    return response.data;
  }

  // Update wallet (rename)
  async updateWallet(token: string, walletId: string, updateData: { name?: string }) {
    const response = await axios.put(`${API_BASE}/wallets/${walletId}`, null, {
      headers: this.getAuthHeaders(token),
      params: updateData
    });
    return response.data;
  }

  // Remove wallet
  async removeWallet(token: string, walletId: string) {
    const response = await axios.delete(`${API_BASE}/wallets/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Set primary wallet
  async setPrimaryWallet(token: string, walletId: string) {
    const response = await axios.post(`${API_BASE}/wallets/${walletId}/primary`, null, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get deposit addresses for specific wallet
  async getWalletDepositAddresses(token: string, walletId: string) {
    const response = await axios.get(`${API_BASE}/crypto/deposit-addresses/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get balance for specific wallet
  async getWalletBalance(token: string, walletId: string) {
    const response = await axios.get(`${API_BASE}/crypto/balances/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Create transaction from specific wallet
  async createWalletTransaction(token: string, walletId: string, transactionData: any) {
    const response = await axios.post(`${API_BASE}/crypto/transactions/${walletId}`, transactionData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Profile Management
  async deleteProfile(password: string) {
    // Validate password input
    if (!password || password.trim().length === 0) {
      throw new Error('Password is required for profile deletion');
    }
    
    // Sanitize password input
    const sanitizedPassword = InputValidator.sanitizeString(password);
    
    try {
      // Use POST method with /api/account/delete path to avoid conflicts
      const response = await axios.post(`${API_BASE}/account/delete`, 
        { password: sanitizedPassword },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Profile deletion failed:', error);
      this.handleApiError(error);
      throw error;
    }
  }

  // === 2FA API Methods ===
  
  // SMS 2FA Methods
  async sendSMS2FA(token: string, phoneNumber: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/sms/send`, 
      { phone_number: phoneNumber }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  async verifySMS2FA(token: string, phoneNumber: string, code: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/sms/verify`,
      { phone_number: phoneNumber, code }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  async setupSMS2FA(token: string, phoneNumber: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/sms/setup`,
      { phone_number: phoneNumber }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  // TOTP/Authenticator 2FA Methods
  async setupTOTP2FA() {
    const response = await axios.post(`${API_V1_BASE}/auth/totp/setup`, {}, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async verifyTOTP2FA(code: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/totp/verify`,
      { code: code },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Email 2FA Methods
  async sendEmail2FA(token: string, email: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/email/send`, 
      { email }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  async verifyEmail2FA(token: string, email: string, code: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/email/verify`,
      { email, code }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  async setupEmail2FA(token: string, email: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/email/setup`,
      { email }, 
      { headers: this.getAuthHeaders(token) }
    );
    return response.data;
  }

  // === ADMIN API METHODS ===
  
  // Admin Dashboard Overview (Using API v1)
  async getAdminOverview(token: string) {
    const response = await axios.get(`${API_V1_BASE}/admin/overview`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Admin Users Management
  async getAdminUsers(token: string, params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await axios.get(`${API_BASE}/admin/users${queryParams}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAdminUserDetails(token: string, userId: string) {
    const response = await axios.get(`${API_BASE}/admin/users/${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Admin Staking Analytics
  async getAdminStaking(token: string) {
    const response = await axios.get(`${API_V1_BASE}/admin/staking`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Admin Crypto Analytics
  async getAdminCrypto(token: string) {
    const response = await axios.get(`${API_V1_BASE}/admin/crypto`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Admin System Status (Using API v1)
  async getAdminSystem(token: string) {
    const response = await axios.get(`${API_V1_BASE}/admin/system`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === SUPPORT TICKET API METHODS ===
  
  async createSupportTicket(ticketData: {
    category: string;
    subject: string;
    description: string;
    priority: string;
  }) {
    const response = await axios.post(`${API_BASE}/support/tickets`, ticketData, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getUserSupportTickets() {
    const response = await axios.get(`${API_BASE}/support/tickets`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getRevenueDashboard() {
    const response = await axios.get(`${API_BASE}/admin/revenue/analytics`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  // Phase 2 Enhancement: Biometric WebAuthn 2FA APIs
  async beginBiometricRegistration(token: string, deviceName?: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/webauthn/register/begin`, {
      device_name: deviceName || 'Device'
    }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async completeBiometricRegistration(token: string, credentialData: any) {
    const response = await axios.post(`${API_V1_BASE}/auth/webauthn/register/complete`, 
      credentialData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async beginBiometricAuthentication(token: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/webauthn/authenticate/begin`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async completeBiometricAuthentication(token: string, verificationData: any) {
    const response = await axios.post(`${API_V1_BASE}/auth/webauthn/authenticate/complete`, 
      verificationData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Phase 2 Enhancement: Push Notification 2FA APIs
  async registerPushNotifications(token: string, pushToken: string, deviceType: string, deviceName?: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/push/register`, {
      token: pushToken,
      device_type: deviceType,
      device_name: deviceName || 'Device'
    }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async sendPushNotification(token: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/push/send`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Phase 2 Enhancement: Enhanced 2FA Conditional Logic
  checkEnhanced2FARequired(user: User, investmentAmount: number): boolean {
    // Enhanced 2FA mandatory for investments ≥ $20,000
    const ENHANCED_2FA_THRESHOLD = 20000;
    return investmentAmount >= ENHANCED_2FA_THRESHOLD;
  }

  // Check if user has Enhanced 2FA enabled
  hasEnhanced2FA(user: User): boolean {
    // Check if user has any enhanced 2FA methods enabled
    // This would be set when they complete biometric or push setup
    return user.biometric_2fa_enabled || user.push_2fa_enabled || false;
  }

  // Validate Enhanced 2FA for high-value operations
  validateEnhanced2FAForInvestment(user: User, amount: number) {
    const requiresEnhanced = this.checkEnhanced2FARequired(user, amount);
    const hasEnhanced = this.hasEnhanced2FA(user);
    
    return {
      required: requiresEnhanced,
      hasEnhanced: hasEnhanced,
      canProceed: !requiresEnhanced || hasEnhanced,
      threshold: 20000,
      message: requiresEnhanced && !hasEnhanced 
        ? `Enhanced 2FA is required for investments of $20,000 or more. Please set up biometric or push notification authentication to proceed.`
        : null
    };
  }

  // === WALLET MANAGEMENT API METHODS ===
  
  async getConnectedWallets(token: string) {
    const response = await axios.get(`${API_BASE}/wallets/connected`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async disconnectWallet(walletId: string, token: string) {
    const response = await axios.delete(`${API_BASE}/wallets/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === WITHDRAWAL API METHODS ===
  
  async getWithdrawalSources(token: string) {
    const response = await axios.get(`${API_BASE}/withdrawals/sources`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async createWithdrawal(withdrawalData: {
    source_id: string;
    amount: number;
    method: string;
  }, token: string) {
    const response = await axios.post(`${API_BASE}/withdrawals`, withdrawalData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAvailableFunds(token: string) {
    const response = await axios.get(`${API_BASE}/funds/available`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getFundSources(token: string) {
    const response = await axios.get(`${API_BASE}/funds/sources`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async transferFunds(transferData: {
    from_source: string;
    to_source: string;
    amount: number;
    memo?: string;
  }, token: string) {
    const response = await axios.post(`${API_BASE}/funds/transfer`, transferData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getDepositMethods(token: string) {
    const response = await axios.get(`${API_BASE}/deposits/methods`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === USER PROFILE API METHODS ===
  
  async updateProfile(profileData: any, token: string) {
    const response = await axios.put(`${API_BASE}/user/profile`, profileData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }, token: string) {
    const response = await axios.put(`${API_BASE}/user/password`, passwordData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === 2FA API METHODS ===
  // General 2FA
  async generate2FAQRCode(token: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/2fa/generate`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async verify2FACode(token: string, code: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/2fa/verify`, { code }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Email Verification (separate from 2FA)
  async sendVerificationEmail(email: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/email/send-verification`, { email }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }

  async verifyEmailCode(code: string) {
    const response = await axios.post(`${API_V1_BASE}/auth/email/verify-code`, { code }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }

  
  async generate2FASecret(token: string) {
    const response = await axios.post(`${API_BASE}/auth/2fa/generate`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async verify2FA(code: string, token: string) {
    const response = await axios.post(`${API_BASE}/auth/2fa/verify`, { code }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === STAKING API METHODS ===
  
  // Get user's staking portfolio
  async getStakingPortfolio(token: string) {
    const response = await axios.get(`${API_V1_BASE}/staking/portfolio`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Create new staking investment with fee calculation
  async createStakingInvestment(stakingData: {
    amount: number;
    net_amount?: number;
    service_fee?: number;
    token: string;
    network: string;
    wallet_address: string;
    tier: string;
    apy: number;
  }, token: string) {
    const response = await axios.post(`${API_V1_BASE}/staking/create`, stakingData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Calculate service fee for staking amount
  async calculateStakingFee(amount: number, token: string) {
    const response = await axios.get(`${API_V1_BASE}/staking/calculate-fee/${amount}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get staking transaction history
  async getStakingHistory(token: string, params?: {
    status?: 'all' | 'active' | 'matured' | 'claimed';
    sort?: 'newest' | 'oldest' | 'amount';
    page?: number;
    limit?: number;
  }) {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await axios.get(`${API_V1_BASE}/staking/history${queryParams}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get staking analytics data
  async getStakingAnalytics(token: string, timeframe?: '3m' | '6m' | '1y' | 'all') {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    const response = await axios.get(`${API_V1_BASE}/staking/analytics${params}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Claim matured staking investment
  async claimStakingInvestment(investmentId: string, token: string) {
    const response = await axios.post(`${API_V1_BASE}/staking/claim/${investmentId}`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get VIP tiers and requirements
  async getVIPTiers(token: string) {
    const response = await axios.get(`${API_V1_BASE}/staking/tiers`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Export staking history to CSV
  async exportStakingHistory(token: string, format: 'csv' | 'excel' = 'csv') {
    const response = await axios.get(`${API_V1_BASE}/staking/export`, {
      headers: this.getAuthHeaders(token),
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // === EMAIL VERIFICATION API METHODS ===
  
  async sendEmailVerification(email: string, token: string) {
    const response = await axios.post(`${API_BASE}/auth/email/send-verification`, { email }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async verifyEmail(code: string, token: string) {
    const response = await axios.post(`${API_BASE}/auth/email/verify-code`, { code }, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }
}

export const apiService = new ApiService();
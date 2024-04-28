export type MultiOrderParams = {
  businessDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
};

/**
 * === ORDER RETURN ===
 */

//Child of Many (Foreign Keys)
type ToastReference = {
  guid: string;
  entityType: string;
};
type ExternalReference<T = string> = ToastReference & {
  externalId: string;
  entityType: T;
};

type ConfigReference = ExternalReference & {
  multiLocationId: string;
};

//Child of Selection & Check
export type AppliedDiscounts = {
  guid: string;
  entityType: string;
  externalId: string;
  name: string;
  discountAmount: number;
  nonTaxDiscountAmount: number;
  discount: string;
  triggers: [];
  approver: string;
  processingState: string;
  appliedDiscountReason: string;
  loyaltyDetails: string;
  comboItems: [];
  appliedPromoCode: string;
  discountType: string;
  discountPercent: number;
};

//Child of Selection
type AppliedTaxRate = {
  entityType: string;
  facilitatorCollectAndRemitTax: boolean;
  guid: string;
  name: string;
  rate: number;
  taxAmount: number;
  taxRate: {
    entityType: string;
    guid: string;
  };
  type: "PERCENT" | "FIXED" | "NONE" | "TABLE" | "EXTERNAL";
};

//Child of Selection
type GiftCard = { guid: string; entityType: string };

//Child of Payment
type GiftCardInfo = {
  authorizationState:
    | "VALIDATED"
    | "NONE"
    | "PAID"
    | "REVERSED"
    | "DENIED"
    | "ERROR"
    | "ADJUSTING";
  authRequestId: string;
  cardNumberIdentifier: string;
  entityType: string;
  guid: string;
  rewardsBalance: number;
  storedValueValance: number;
};

//Child of Gift Card Selection
type GCMessage = {
  from: string;
  to: string;
  message: string;
  email: string;
  phone: string;
};

//Child of Selection
type GiftCardSelection = { amount: number; giftCardMessage: GCMessage };

//Child of Check
type Customer = {
  guid: string;
  entityType: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCountryCode: string;
  phoneToken: string;
  email: string;
  emailToken: string;
};

//Child of Refund Reason
type RefundTransaction = { guid: string; entityType: string };

//Child of Selection
type RefundReason = {
  refundAmount: number;
  taxRefundAmount: number;
  refundTransaction: RefundTransaction;
};

//Child of Check
type Refund = {
  refundAmount: number;
  refundBusinessDate: number;
  refundDate: string;
  refundStrategy:
    | "LEGACY_INCLUDE_REFUND_IN_AMOUNT_DUE"
    | "IGNORE_REFUND_IN_AMOUNT_DUE";
  refundTransaction: ToastReference;
  tipRefundAmount: number;
};

//Child of AppliedService Charge
type RefundDetails = {
  refundAmount: number;
  refundTransaction: ToastReference;
  taxRefundAmount: number;
};

//Child of Check
export type AppliedServiceCharge = {
  guid: string;
  entityType: string;
  externalId: string;
  chargeAmount: number;
  serviceCharge: ExternalReference; // GUID REFERENCE AVAILABLE,
  chargeType: "FIXED" | "PERCENT" | "OPEN";
  name: string;
  delivery: boolean;
  takeout: boolean;
  dineIn: boolean;
  gratuity: boolean;
  taxable: boolean;
  appliedTaxes: AppliedTaxRate[];
  tags: string[];
  serviceChargeCalculation: "PRE_DISCOUNT" | "POST_DISCOUNT";
  refundDetails: RefundDetails;
  serviceChargeCategory:
    | "SERVICE_CHARGE"
    | "CREDIT_CARD_SURCHARGE"
    | "FUNDRAISING_CAMPAIGN";
  paymentGuid: string;
  percent: number;
  destination: "RESTAURANT" | "SERVER" | "THIRD_PARTY" | "TOAST";
};

//Child of Payment & PreAuthInfo
type CardType =
  | "VISA"
  | "MASTERCARD"
  | "AMEX"
  | "DISCOVER"
  | "JCB"
  | "DINERS"
  | "CITI"
  | "MAESTRO"
  | "LASER"
  | "SOLO"
  | "INTERAC"
  | "UNKNOWN";

//Child of Check
export type Payment = {
  guid: string;
  entityType: string;
  externalId: string;
  paidDate: string; // ISO,
  paidBusinessDate: number;
  type:
    | "CASH"
    | "CREDIT"
    | "GIFTCARD"
    | "HOUSE_ACCOUNT"
    | "REWARDCARD"
    | "LEVELUP"
    | "OTHER"
    | "UNDETERMINED";
  cardEntryMode:
    | "SWIPED"
    | "KEYED"
    | "ONLINE"
    | "EMV_CHIP_SIGN"
    | "TOKENIZED"
    | "PRE_AUTHED"
    | "SAVED_CARD"
    | "FUTURE_ORDER"
    | "CONTACTLESS"
    | "APPLE_PAY_CNP"
    | "GOOGLE_PAY_CNP"
    | "INCREMENTAL_PRE_AUTHED"
    | "PARTNER_ECOM_COF"
    | "CLICK_TO_PAY_CNP";
  amount: number;
  tipAmount: number;
  amountTendered: number;
  cardType: CardType;
  last4Digits: string;
  originalProcessingFee: number;
  server: ExternalReference;
  referenceCode: string;
  cashDrawer: ExternalReference;
  refundStatus: "NONE" | "PARTIAL" | "FULL";
  refund: Refund;
  88:
    | "OPEN"
    | "PROCESSING"
    | "AUTHORIZED_AT_RISK"
    | "AUTHORIZED"
    | "ERROR"
    | "ERROR_NETWORK"
    | "DENIED"
    | "PROCESSING_VOID"
    | "VOIDED_AT_RISK"
    | "CANCELLED"
    | "CAPTURE_IN_PROGRESS"
    | "CAPTURED"
    | "VOIDED";
  voidInfo: {
    voidApprover: ExternalReference;
    voidBusinessDate: number;
    voidDate: string;
    voidReason: ExternalReference;
    voidUser: ExternalReference;
  };
  houseAccount: ExternalReference;
  otherPayment: ExternalReference;
  createdDevice: { id: string };
  lastModifiedDevice: { id: string };
  mcaRepaymentAmount: number;
  cardPaymentId: string;
  paymentCardToken: ToastReference;
  giftCard: ExternalReference;
  giftCardInfo: GiftCardInfo;
  orderGuid: string;
  checkGuid: string;
  receiptToken: string;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  isProcessedOffline: boolean;
  processingService: string;
  authorizedAmount: number;
  cardTenderType: string;
  prepaidCardBalance: number;
  proRatedDiscountAmount: number;
  proRatedTaxAmount: number;
  proRatedTotalServiceChargeAmount: number;
  shift: ExternalReference;
  serverShift: ExternalReference;
  orderOwnerGuid: string;
  cardProcessorType: string;
  paymentMethodId: string;
  tenderRoomId: string;
};

//Child of Check - ITEMS
export type Selections = {
  guid: string;
  entityType: string;
  externalId: string;
  item: ConfigReference;
  itemGroup: ConfigReference; //*IMPORTANT FIELD - Menu Group,
  optionGroup: ConfigReference;
  preModifier: ExternalReference;
  quantity: number;
  seatNumber: number;
  unitOfMeasure: "NONE" | "LB" | "OZ" | "KG" | "G";
  selectionType:
    | "NONE"
    | "OPEN_ITEM"
    | "SPECIAL_REQUEST"
    | "PORTION"
    | "HOUSE_ACCOUNT_PAY_BALANCE"
    | "TOAST_CARD_SELL"
    | "TOAST_CARD_RELOAD";
  salesCategory: ExternalReference; //! GUID REFERENCE AVAILABLE (name),
  appliedDiscounts: AppliedDiscounts[];
  deferred: boolean;
  perDiscountPrice: number;
  price: number;
  tax: number;
  voided: boolean;
  voidDate: string; // ISO,
  voidBusinessDate: number;
  voidReason: ExternalReference; //! GUID REFERENCE AVAILABLE,
  refundDetails: RefundReason;
  displayName: string;
  createdDate: string; //ISO,
  modifiedDate: string; //ISO,
  modifiers: Selections[];
  fulfillmentStatus: "NEW" | "HOLD" | "SENT" | "READY";
  taxInclusion: "INCLUDED" | "NOT_INCLUDED" | "INHERITED";
  appliedTaxes: AppliedTaxRate[];
  diningOption: ExternalReference;
  openPriceAmount: number;
  receiptLinePrice: number;
  optionGroupPricingMode:
    | "INCLUDED"
    | "FIXED_PRICE"
    | "ADJUSTS_PRICE"
    | "REPLACES_PRICE"
    | "LOCATION_SPECIFIC_PRICE";
  externalPriceAmount: number;
  toastGiftCard: GiftCard;
  storedValueTransactionId: number;
  giftCardSelectionInfo: GiftCardSelection;
};

//Child of Check
type AppliedLoyaltyInfo = {
  guid: string;
  amount: number;
  appliedDiscounts: AppliedDiscounts[];
  accrualText?: string;
  accrualFamilyGuid?: string;
  entityType: "AppliedLoyaltyInfo";
  loyaltyIdentifier: string;
  maskedLoyaltyIdentifier?: string;
  vendor:
    | "TOAST"
    | "PUNCHH"
    | "PUNCHH2"
    | "PAYTRONIX"
    | "APPFRONT"
    | "INTEGRATION";
};

//Child of Check
type AppliedPreAuthInfo = {
  guid: string;
  token: string;
  oneTimeUse: boolean;
  preAuthAmount: number;
  cardType: CardType;
  readerType:
    | "ACS_ACR31"
    | "BBPOS"
    | "BBPOS_MSR"
    | "IDTECH_SHUTTLE"
    | "INGENICO_ICM122"
    | "MAGTEK_BULLET"
    | "MAGTEK_DYNAMAG"
    | "MAGTEK_EDYNAME"
    | "MAGTEK_UDYNAMO";
  last4CardDigits: string;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  cardHolderhash4: string;
  cardHolderhash6: string;
  magStripeName: string;
  cardHolderExpirationMonth: string;
  cardHolderExpirationYear: string;
  useCount: number;
};

//Child of Order
type Check = {
  guid: string;
  entityType: "Check";
  externalId: string;
  openedDate: string; // ISO,
  closedDate: string; // ISO,
  modifiedDate: string; // ISO,
  deletedDate: string; // ISO,
  deleted: boolean;
  selections: Selections[]; //*IMPORTANT FIELD,
  customer: Customer;
  billingCustomer: Customer;
  guestProfile: Omit<ExternalReference, "externalId">;
  appliedLoyaltyInfo: AppliedLoyaltyInfo;
  taxExempt: boolean;
  taxExemptionAccount: { number: string; state: string };
  displayNumber: string;
  appliedServiceCharges: AppliedServiceCharge[];
  amount: number;
  netAmount: number;
  taxAmount: number;
  tipAmount: number; //! MAY NOT EXIST,
  totalAmount: number;
  totalDiscountAmount: number;
  payments: Payment[];
  tabName: string;
  paymentStatus: "OPEN" | "PAID" | "CLOSED";
  appliedDiscounts: AppliedDiscounts[];
  voided: boolean; // *IMPORTANT FIELD (condition),
  voidDate: string; //ISO,
  voidBusinessDate: string;
  paidDate: string;
  pickedUpDate: string;
  createdDevice: { id: string };
  lastModifiedDevice: { id: string };
  appliedPreauthInfo: AppliedPreAuthInfo;
  shift: ExternalReference;
  driverShift: ExternalReference;
  removedSelections: {
    entityType: string;
    guid: string;
    price: number;
    quantity: number;
  }[];
  duration: number;
};

//Child of Order
type RevenueCenter = { guid: string; entityType: string; externalId: string };

//* Primary Return Type
export type MultiOrderReturn = {
  guid: string;
  entityType: string;
  externalId: string;
  openedDate: string;
  modifiedDate: string;
  promisedDate: string;
  channelGuid: string;
  diningOptions: ExternalReference;
  checks: Check[]; // *IMPORTANT FIELD - Checks -> Map Net Rev, Tax, Tips, & payments,
  table: ExternalReference;
  serviceArea: ExternalReference;
  restaurantService: ExternalReference; // *IMPORTANT FIELD (Mapped) - Meal Period,
  revenueCenter: ExternalReference<"RevenueCenter">; // *IMPORTANT FIELD (Mapped),
  source:
    | "In Store"
    | "Online"
    | "Order-and-Pay-at-Table"
    | "API"
    | "Kiosk"
    | "Caller Id"
    | "Google"
    | "Invoice"
    | "Toast Pickup App"
    | "Toast Local"
    | "Branded Online Ordering"
    | "Catering"
    | "Catering Online Ordering"
    | "Toast Tables";
  duration: number;
  deliveryInfo: {};
  requiredPrepTime: string;
  estimatedFulfillmentDate: string; // ISO,
  numberOfGuests: number; // *IMPORTANT FIELD,
  voided: boolean;
  voidDate: string; // ISO,
  voidBusinessDate: number;
  paidDate: string; // ISO,
  closedDate: string; // ISO,
  deletedDate: string; // ISO,
  deleted: boolean;
  businessDate: number; // * IMPORTANT FIELD,
  server: ExternalReference<"RestaurantUser">;
  owner: ExternalReference;
  pricingFeatures: "TAXESV2" | "TAXESV3"[];
  approvalStatus: "NEEDS_APPROVAL" | "APPROVED" | "FUTURE" | "NOT_APPROVED";
  guestOrderStatus: string;
  createdDevice: { id: string };
  createdDate: string; //ISO,
  initialDate: number;
  lastModifiedDevice: { id: string };
  curbsidePickupInfo: {
    entityType: string;
    guid: string;
    notes: string;
    transportColor: string;
    transportDescription: string;
  };
  deliveryServiceInfo: {
    driverName: string;
    driverPhoneNumber: string;
    entityType: string;
    guid: string;
    originalQuotedDeliveryDate: string; //ISO
    providerId: string;
    providerInfo: string;
    ProviderName: string;
  };
  marketplaceFacilitatorTaxInfo: {
    facilitatorCollectAndRemitTaxOrder: boolean;
    taxes: AppliedTaxRate[];
  };
  createdInTestMode: boolean;
  appliedPackagingInfo: {
    entityType: string;
    guid: string;
    appliedPackagingItems: {
      entityType: string;
      guestDisplayName: string;
      guid: string;
      inclusion: "YES" | "NO";
      itemTypes: string[];
    }[];
  };
  captureSequenceKey: number;
  excessFood: boolean;
  voidServiceCharges: boolean;
};

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
type DefaultIDType = {
  guid: string;
  entityType: string;
  externalId: string;
};

//Child of Selection
type Item = {
  guid: string;
  entityType: string;
  externalId: string;
  multiLocationId: string;
};

//Child of Selection
type ItemGroup = {
  guid: string;
  entityType: string;
  externalId: string;
  multiLocationId: string;
};

//Child of Selection
type OptionGroup = {
  guid: string;
  entityType: string;
  externalId: string;
  multiLocationId: string;
};

//Child of Selection
type SalesCategory = {
  guid: string;
  entityType: string;
  externalId: string;
};

//Child of Selection & Check
type AppliedDiscounts = {
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

//Child of Refund Reason
type RefundTransaction = { guid: string; entityType: string };

//Child of Selection
type RefundReason = {
  refundAmount: number;
  taxRefundAmount: number;
  refundTransaction: RefundTransaction;
};

//Child of Modifier & Selection
type Tax = {
  guid: string;
  entityType: string;
  facilitatorCollectAndRemitTax: boolean;
  name: string;
  rate: number;
  taxAmount: number;
  type: string;
};

type Modifier = {
  appliedDiscounts: AppliedDiscounts[];
  appliedTaxes: Tax[];
  createdDate: string;
  deferred: boolean;
};

//Child of Order & Selection
type DiningOptions = { guid: string; entityType: string; externalId: string };

//Child of Selection
type GiftCard = { guid: string; entityType: string };

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

//Child of Check
export type AppliedServiceCharge = {
  guid: string;
  entityType: string;
  externalId: string;
  chargeAmount: number;
  serviceCharge: DefaultIDType; // GUID REFERENCE AVAILABLE,
  chargeType: string;
  name: string;
  delivery: boolean;
  takeout: boolean;
  dineIn: boolean;
  gratuity: boolean;
  taxable: boolean;
  appliedTaxes: [];
  tags: [];
  serviceChargeCalculation: string;
  refundDetails: {};
  serviceChargeCategory: string;
  paymentGuid: string;
  percent: number;
  destination: string;
};

//Child of Check
export type Payments = {
  guid: string;
  entityType: string;
  externalId: string;
  paidDate: string; // ISO,
  paidBusinessDate: number;
  type: string;
  cardEntryMode: string;
  amount: number;
  tipAmount: number;
  amountTendered: number;
  cardType: string;
  last4Digits: string;
  originalProcessingFee: number;
  server: {};
  referenceCode: string;
  cashDrawer: {};
  refundStatus: string;
  refund: {};
  paymentStatus: string;
  voidInfo: {};
  houseAccount: {};
  otherPayment: {};
  createdDevice: {};
  lastModifiedDevice: {};
  mcaRepaymentAmount: number;
  cardPaymentId: string;
  paymentCardToken: {};
  giftCard: {};
  giftCardInfo: {};
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
  shift: {};
  serverShift: {};
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
  item: Item;
  itemGroup: ItemGroup; //*IMPORTANT FIELD - Menu Group,
  optionGroup: OptionGroup;
  preModifier: DefaultIDType;
  quantity: number;
  seatNumber: number;
  unitOfMeasure: string;
  selectionType: string;
  salesCategory: SalesCategory; //! GUID REFERENCE AVAILABLE (name),
  appliedDiscounts: AppliedDiscounts[];
  deferred: boolean;
  perDiscountPrice: number;
  price: number;
  tax: number;
  voided: boolean;
  voidDate: string; // ISO,
  voidBusinessDate: number;
  voidReason: DefaultIDType; //! GUID REFERENCE AVAILABLE,
  refundDetails: RefundReason;
  displayName: string;
  createdDate: string; //ISO,
  modifiedDate: string; //ISO,
  modifiers: Selections[];
  fulfillmentStatus: string;
  taxInclusion: string;
  appliedTaxes: Tax[];
  diningOption: DefaultIDType;
  openPriceAmount: number;
  receiptLinePrice: number;
  optionGroupPricingMode: string;
  externalPriceAmount: number;
  toastGiftCard: GiftCard;
  storedValueTransactionId: number;
  giftCardSelectionInfo: GiftCardSelection;
};

//Child of Order
type _Checks = {
  guid: string;
  entityType: string;
  externalId: string;
  openedDate: string; // ISO,
  closedDate: string; // ISO,
  modifiedDate: string; // ISO,
  deletedDate: string; // ISO,
  deleted: boolean;
  selections: Selections[]; //*IMPORTANT FIELD,
  customer: Customer;
  billingCustomer: {};
  guestProfile: {};
  appliedLoyaltyInfo: {};
  taxExempt: boolean;
  taxExemptionAccount: {};
  displayNumber: string;
  appliedServiceCharges: AppliedServiceCharge[];
  amount: number;
  netAmount: number;
  taxAmount: number;
  tipAmount: number; //! MAY NOT EXIST,
  totalAmount: number;
  totalDiscountAmount: number;
  payments: Payments[];
  tabName: string;
  paymentStatus: string;
  appliedDiscouts: AppliedDiscounts[];
  voided: boolean; // *IMPORTANT FIELD (condition),
  voidDate: string; //ISO,
  voidBusinessDate: string;
  paidDate: string;
  pickedUpDate: string;
  createdDevice: {};
  lastModifiedDevice: {};
  appliedPreauthInfo: {};
  shift: {};
  driverShift: {};
  removedSelections: {}[];
  duration: number;
};

//Child of Order
type _RevenueCenter = { guid: string; entityType: string; externalId: string };

//* Primary Return Type
export type MultiOrderReturn = {
  guid: string;
  entityType: string;
  externalId: string;
  openedDate: string;
  modifiedDate: string;
  promisedDate: string;
  channelGuid: string;
  diningOptions: DiningOptions;
  checks: _Checks[]; // *IMPORTANT FIELD - Checks -> Map Net Rev, Tax, Tips, & payments,
  table: {};
  serviceArea: {};
  restaurantService: DefaultIDType; // *IMPORTANT FIELD (Mapped) - Meal Period,
  revenueCenter: _RevenueCenter; // *IMPORTANT FIELD (Mapped),
  source: string;
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
  server: {};
  owner: {};
  pricingFeatures: string[];
  approvalStatus: string;
  guestOrderStatus: string;
  createdDevice: {};
  createdDate: string; //ISO,
  initialDate: number;
  lastModifiedDevice: {};
  curbsidePickupInfo: {};
  deliveryServiceInfo: {};
  marketplaceFacilitatorTaxInfo: {};
  createdInTestMode: boolean;
  appliedPackagingInfo: {};
  captureSequenceKey: number;
  excessFood: boolean;
  voidServiceCharges: boolean;
};

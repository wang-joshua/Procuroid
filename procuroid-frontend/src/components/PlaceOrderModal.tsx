import { useEffect, useMemo, useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Slider } from '@heroui/react';
import { sendQuoteRequest } from '../api/apiCalls';
import { useAuth } from '../context/AuthProvider';

interface PlaceOrderModalProps {
  onClose: () => void;
}

type SupplierType = 'manufacturer' | 'distributor' | 'service_provider';

interface OrderFormData {
  // Step 1 — Supplier Details
  supplierType: SupplierType;
  productName: string;
  productDescription: string;
  productSpecifications: string;
  productCertification: string;

  // Step 2 — Order Details
  quantityRequired: string;
  unitOfMeasurement: string;
  unitPrice: string;
  lowerLimit: string;
  upperLimit: string;
  currency: string;
  totalPriceEstimate: string; // auto-calculated, stored as string for inputs

  // Step 3 — Delivery & Payment
  paymentTerms: string;
  preferredPaymentMethod: string;
  requiredDeliveryDate: string;
  location: string;
  shippingCost: 'included' | 'separate';
  packagingDetails: string;
  incoterms: string;
}

const PlaceOrderModal = ({ onClose }: PlaceOrderModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>({
    supplierType: 'manufacturer',
    productName: '',
    productDescription: '',
    productSpecifications: '',
    productCertification: '',

    quantityRequired: '',
    unitOfMeasurement: '',
    unitPrice: '',
    lowerLimit: '',
    upperLimit: '',
    currency: 'USD',
    totalPriceEstimate: '',

    paymentTerms: 'Net 30',
    preferredPaymentMethod: 'Bank Transfer',
    requiredDeliveryDate: '',
    location: '',
    shippingCost: 'included',
    packagingDetails: '',
    incoterms: 'FOB',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
  }));
  };

  const canProceedStep1 = useMemo(() => {
    // If service provider, specs/incoterms can be skipped later
    return (
      formData.supplierType &&
      formData.productName.trim() &&
      formData.productDescription.trim() &&
      (formData.supplierType === 'service_provider' || formData.productSpecifications.trim() || true)
    );
  }, [formData]);

  const canProceedStep2 = useMemo(() => {
    return (
      formData.quantityRequired !== '' &&
      formData.unitOfMeasurement.trim() &&
      formData.unitPrice !== '' &&
      formData.currency.trim() &&
      formData.lowerLimit.trim() &&
      formData.upperLimit.trim()
    );
  }, [formData]);

  const canProceedStep3 = useMemo(() => {
    return (
      formData.paymentTerms.trim() &&
      formData.preferredPaymentMethod.trim() &&
      formData.requiredDeliveryDate.trim() &&
      formData.location.trim() &&
      formData.shippingCost &&
      (formData.supplierType === 'service_provider' || formData.incoterms.trim() || true)
    );
  }, [formData]);

  useEffect(() => {
    const q = parseFloat(formData.quantityRequired || '');
    const p = parseFloat(formData.unitPrice || '');
    if (!isNaN(q) && !isNaN(p)) {
      setFormData(prev => ({ ...prev, totalPriceEstimate: String(q * p) }));
    } else {
      setFormData(prev => ({ ...prev, totalPriceEstimate: '' }));
    }
  }, [formData.quantityRequired, formData.unitPrice]);

  const numericUnitPrice = parseFloat(formData.unitPrice || '');
  const hasUnitPrice = !isNaN(numericUnitPrice) && numericUnitPrice > 0;
  const sliderMin = hasUnitPrice ? parseFloat((numericUnitPrice * 0.5).toFixed(2)) : 0;
  const sliderMax = hasUnitPrice ? parseFloat((numericUnitPrice * 1.5).toFixed(2)) : 0;

  const currentLower = hasUnitPrice
    ? (formData.lowerLimit ? Math.max(sliderMin, Math.min(parseFloat(formData.lowerLimit), sliderMax)) : sliderMin)
    : sliderMin;
  const currentUpper = hasUnitPrice
    ? (formData.upperLimit ? Math.max(currentLower, Math.min(parseFloat(formData.upperLimit), sliderMax)) : sliderMax)
    : sliderMax;
  const formattedLower = hasUnitPrice ? currentLower.toFixed(2) : '--';
  const formattedUpper = hasUnitPrice ? currentUpper.toFixed(2) : '--';

  useEffect(() => {
    if (!hasUnitPrice) {
      setFormData(prev => {
        if (prev.lowerLimit === '' && prev.upperLimit === '') return prev;
        return { ...prev, lowerLimit: '', upperLimit: '' };
      });
      return;
    }

    setFormData(prev => {
      const normalizedLower = prev.lowerLimit ? Math.max(sliderMin, Math.min(parseFloat(prev.lowerLimit), sliderMax)) : sliderMin;
      const normalizedUpper = prev.upperLimit ? Math.max(normalizedLower, Math.min(parseFloat(prev.upperLimit), sliderMax)) : sliderMax;
      const lowerStr = normalizedLower.toFixed(2);
      const upperStr = normalizedUpper.toFixed(2);

      if (prev.lowerLimit === lowerStr && prev.upperLimit === upperStr) {
        return prev;
      }

      return {
        ...prev,
        lowerLimit: lowerStr,
        upperLimit: upperStr,
      };
    });
  }, [hasUnitPrice, sliderMin, sliderMax]);

  const handleSliderChange = (value: number | number[]) => {
    if (!hasUnitPrice || !Array.isArray(value)) return;
    const [lower, upper] = value;
    setFormData(prev => ({
      ...prev,
      lowerLimit: Math.max(sliderMin, Math.min(lower, sliderMax)).toFixed(2),
      upperLimit: Math.max(sliderMin, Math.min(Math.max(lower, upper), sliderMax)).toFixed(2),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      console.error('Cannot place order: no authenticated user');
      return;
    }

    try {
      await sendQuoteRequest(user.id, formData as unknown as any);
      onClose();
    } catch (err) {
      console.error('Failed to submit order:', err);
    }
  };

  const handleSaveDraft = () => {
    // Minimal draft behavior: log and close (or store locally)
    console.log('Draft saved:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Place New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Multi-step progress */}
          <div className="flex items-center mb-6">
            {[1, 2, 3, 4].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > s ? <Check className="h-4 w-4" /> : String(s)}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {s === 1 ? 'Supplier' : s === 2 ? 'Order' : s === 3 ? 'Delivery' : 'Review'}
                </span>
                {idx < 3 && (<div className={`flex-1 h-0.5 mx-4 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />)}
              </div>
            ))}
          </div>

          {/* Step 1 — Supplier Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Type</label>
                  <select name="supplierType" value={formData.supplierType} onChange={handleInputChange} className="input-field" required>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="service_provider">Service Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product / Item Name</label>
                  <input name="productName" value={formData.productName} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <textarea name="productDescription" value={formData.productDescription} onChange={handleInputChange} className="input-field h-20 resize-none" placeholder="overall description, context of use, etc." required />
              </div>

              {formData.supplierType !== 'service_provider' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Specifications</label>
                    <textarea name="productSpecifications" value={formData.productSpecifications} onChange={handleInputChange} className="input-field h-20 resize-none" placeholder="grade, size, material, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Certification / Quality Standards</label>
                    <input name="productCertification" value={formData.productCertification} onChange={handleInputChange} className="input-field" placeholder="ISO, ASTM, FDA, etc." />
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <button type="button" className="btn-secondary" onClick={handleSaveDraft}>Save as Draft</button>
                <button type="button" onClick={() => setStep(2)} disabled={!canProceedStep1} className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Order Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Required</label>
                  <input type="number" name="quantityRequired" value={formData.quantityRequired} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
                  <select name="unitOfMeasurement" value={formData.unitOfMeasurement} onChange={handleInputChange} className="input-field" required>
                    <option value="">Select unit</option>
                    <option value="kg">kg</option>
                    <option value="pieces">pieces</option>
                    <option value="boxes">boxes</option>
                    <option value="meters">meters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                  <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="input-field" required>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Negotiation Range (50% - 150% of unit price)</label>
                <Slider
                  step={0.01}
                  minValue={hasUnitPrice ? sliderMin : 0}
                  maxValue={hasUnitPrice ? sliderMax : 1}
                  value={[currentLower, currentUpper]}
                  onChange={handleSliderChange}
                  isDisabled={!hasUnitPrice}
                  showTooltip
                  aria-label="Negotiation range"
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Lower: {formattedLower}</span>
                  <span>Upper: {formattedUpper}</span>
                </div>
                {!hasUnitPrice && (
                  <p className="text-xs text-red-500 mt-1">Enter a unit price to configure range limits.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Price Estimate</label>
                <input readOnly value={formData.totalPriceEstimate} className="input-field bg-gray-50" />
              </div>

              <div className="flex justify-between">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!canProceedStep2} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3 — Delivery & Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} className="input-field" required>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Method</label>
                  <select name="preferredPaymentMethod" value={formData.preferredPaymentMethod} onChange={handleInputChange} className="input-field" required>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Delivery Date</label>
                  <input type="date" name="requiredDeliveryDate" value={formData.requiredDeliveryDate} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                  <input name="location" value={formData.location} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="shippingCost" value="included" checked={formData.shippingCost === 'included'} onChange={handleInputChange} className="mr-2" />
                      Included
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="shippingCost" value="separate" checked={formData.shippingCost === 'separate'} onChange={handleInputChange} className="mr-2" />
                      Separate
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Details</label>
                  <textarea name="packagingDetails" value={formData.packagingDetails} onChange={handleInputChange} className="input-field h-20 resize-none" placeholder="special handling, etc." />
                </div>
              </div>

              {formData.supplierType !== 'service_provider' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incoterms</label>
                  <select name="incoterms" value={formData.incoterms} onChange={handleInputChange} className="input-field">
                    <option value="EXW">EXW</option>
                    <option value="FOB">FOB</option>
                    <option value="CIF">CIF</option>
                    <option value="DDP">DDP</option>
                  </select>
                </div>
              )}

              <div className="flex justify-between">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button type="button" onClick={() => setStep(4)} disabled={!canProceedStep3} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
              </div>
            </div>
          )}

          {/* Step 4 — Review & Confirm */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Supplier Details</h3>
                  <button type="button" className="text-primary-600 text-sm" onClick={() => setStep(1)}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><span className="font-medium">Supplier Type:</span> {formData.supplierType}</div>
                  <div><span className="font-medium">Product Name:</span> {formData.productName}</div>
                  <div className="col-span-2"><span className="font-medium">Product Description:</span> {formData.productDescription}</div>
                  {formData.supplierType !== 'service_provider' && (
                    <>
                      <div className="col-span-2"><span className="font-medium">Product Specifications:</span> {formData.productSpecifications || '-'}</div>
                      <div className="col-span-2"><span className="font-medium">Certifications:</span> {formData.productCertification || '-'}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Order Details</h3>
                  <button type="button" className="text-primary-600 text-sm" onClick={() => setStep(2)}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><span className="font-medium">Quantity:</span> {formData.quantityRequired} {formData.unitOfMeasurement}</div>
                  <div><span className="font-medium">Unit Price:</span> {formData.unitPrice} {formData.currency}</div>
                  <div><span className="font-medium">Total Estimate:</span> {formData.totalPriceEstimate} {formData.currency}</div>
                  <div><span className="font-medium">Lower Limit:</span> {formData.lowerLimit}</div>
                  <div><span className="font-medium">Upper Limit:</span> {formData.upperLimit}</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Delivery & Payment</h3>
                  <button type="button" className="text-primary-600 text-sm" onClick={() => setStep(3)}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><span className="font-medium">Payment Terms:</span> {formData.paymentTerms}</div>
                  <div><span className="font-medium">Payment Method:</span> {formData.preferredPaymentMethod}</div>
                  <div><span className="font-medium">Required Delivery Date:</span> {formData.requiredDeliveryDate}</div>
                  <div><span className="font-medium">Location:</span> {formData.location}</div>
                  <div><span className="font-medium">Shipping Cost:</span> {formData.shippingCost}</div>
                  {formData.supplierType !== 'service_provider' && (
                    <div><span className="font-medium">Incoterms:</span> {formData.incoterms}</div>
                  )}
                  <div className="col-span-2"><span className="font-medium">Packaging Details:</span> {formData.packagingDetails || '-'}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <button type="button" className="btn-secondary" onClick={handleSaveDraft}>Save as Draft</button>
                <button type="submit" className="btn-primary">Submit Order Request</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderModal;

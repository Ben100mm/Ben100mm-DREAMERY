/**
 * Rental Data Card Component
 * Displays rental market data in a card format
 */

import React from 'react';
import { RentalMarketData, RentCastData, FreeWebApiData } from '../types/rental';
import { useRentalDataValidation } from '../hooks/useRentalData';

interface RentalDataCardProps {
  rentalData?: RentalMarketData;
  rentcastData?: RentCastData;
  freewebapiData?: FreeWebApiData;
  showDetails?: boolean;
  className?: string;
  title?: string;
}

const RentalDataCard: React.FC<RentalDataCardProps> = ({
  rentalData,
  rentcastData,
  freewebapiData,
  showDetails = false,
  className = '',
  title = 'Rental Market Data'
}) => {
  const validation = useRentalDataValidation(rentalData || null);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  if (!rentalData && !rentcastData && !freewebapiData) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500">No rental data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {validation && (
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getConfidenceColor(validation.quality_score / 100)}`}>
              Quality: {validation.quality_score}%
            </span>
            {!validation.is_valid && (
              <span className="text-red-500 text-sm">⚠️ Issues detected</span>
            )}
          </div>
        )}
      </div>

      {/* Main Rental Data */}
      {rentalData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Estimated Rent</label>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(rentalData.estimated_rent)}
              </p>
            </div>
            
            {rentalData.rent_range_low && rentalData.rent_range_high && (
              <div>
                <label className="text-sm font-medium text-gray-600">Rent Range</label>
                <p className="text-lg text-gray-900">
                  {formatCurrency(rentalData.rent_range_low)} - {formatCurrency(rentalData.rent_range_high)}
                </p>
              </div>
            )}
          </div>

          {rentalData.market_rent_per_sqft && (
            <div>
              <label className="text-sm font-medium text-gray-600">Rent per Sq Ft</label>
              <p className="text-lg text-gray-900">
                {formatCurrency(rentalData.market_rent_per_sqft)}/sq ft
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Data Source</label>
              <p className="text-sm text-gray-900">{rentalData.data_source || 'Unknown'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Confidence</label>
              <p className={`text-sm font-medium ${getConfidenceColor(rentalData.confidence_score)}`}>
                {getConfidenceText(rentalData.confidence_score)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="text-sm text-gray-900">{formatDate(rentalData.last_updated)}</p>
          </div>
        </div>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Detailed Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentalData?.bedrooms && (
              <div>
                <label className="text-sm font-medium text-gray-600">Bedrooms</label>
                <p className="text-sm text-gray-900">{rentalData.bedrooms}</p>
              </div>
            )}
            
            {rentalData?.bathrooms && (
              <div>
                <label className="text-sm font-medium text-gray-600">Bathrooms</label>
                <p className="text-sm text-gray-900">{rentalData.bathrooms}</p>
              </div>
            )}
            
            {rentalData?.square_feet && (
              <div>
                <label className="text-sm font-medium text-gray-600">Square Feet</label>
                <p className="text-sm text-gray-900">{rentalData.square_feet.toLocaleString()}</p>
              </div>
            )}
            
            {rentalData?.vacancy_rate && (
              <div>
                <label className="text-sm font-medium text-gray-600">Vacancy Rate</label>
                <p className="text-sm text-gray-900">{formatPercentage(rentalData.vacancy_rate)}</p>
              </div>
            )}
            
            {rentalData?.rent_growth_rate && (
              <div>
                <label className="text-sm font-medium text-gray-600">Rent Growth Rate</label>
                <p className="text-sm text-gray-900">{formatPercentage(rentalData.rent_growth_rate)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source-Specific Data */}
      {(rentcastData || freewebapiData) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Source Data</h4>
          
          {rentcastData && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">RentCast</h5>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <span className="font-medium">Rent:</span> {formatCurrency(rentcastData.estimated_rent)}
                </p>
                {rentcastData.rent_range_low && rentcastData.rent_range_high && (
                  <p className="text-sm">
                    <span className="font-medium">Range:</span> {formatCurrency(rentcastData.rent_range_low)} - {formatCurrency(rentcastData.rent_range_high)}
                  </p>
                )}
                {rentcastData.confidence && (
                  <p className="text-sm">
                    <span className="font-medium">Confidence:</span> {rentcastData.confidence}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {freewebapiData && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">FreeWebApi</h5>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <span className="font-medium">Zestimate Rent:</span> {formatCurrency(freewebapiData.zestimate_rent)}
                </p>
                {freewebapiData.rent_zestimate_range_low && freewebapiData.rent_zestimate_range_high && (
                  <p className="text-sm">
                    <span className="font-medium">Range:</span> {formatCurrency(freewebapiData.rent_zestimate_range_low)} - {formatCurrency(freewebapiData.rent_zestimate_range_high)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Issues */}
      {validation && !validation.is_valid && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h5 className="text-sm font-medium text-yellow-800 mb-2">Data Quality Issues</h5>
          <ul className="text-sm text-yellow-700 list-disc list-inside">
            {validation.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RentalDataCard;

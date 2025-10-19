/**
 * ML Risk Prediction Display Component
 * Shows ML-enhanced risk predictions with comparison to rule-based scoring
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { MLRiskPrediction, EnhancedRiskAnalysis } from '../types/mlRisk';
import { DealState } from '../types/deal';
import { getEnhancedRiskAnalysis } from '../services/mlRiskService';

interface MLRiskPredictionDisplayProps {
  dealState: DealState;
}

export const MLRiskPredictionDisplay: React.FC<MLRiskPredictionDisplayProps> = ({
  dealState,
}) => {
  const [enhancedAnalysis, setEnhancedAnalysis] = useState<EnhancedRiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMLPrediction = async () => {
      setLoading(true);
      setError(null);

      try {
        const analysis = await getEnhancedRiskAnalysis(dealState);
        if (isMounted) {
          setEnhancedAnalysis(analysis);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to get ML prediction');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMLPrediction();

    return () => {
      isMounted = false;
    };
  }, [dealState]);

  const getRiskColor = (score: number) => {
    if (score <= 3) return brandColors.success;
    if (score <= 5) return brandColors.warning;
    if (score <= 7) return '#ff9800'; // Orange
    return brandColors.error;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      case 'Very High':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
            <Typography>Loading ML Risk Prediction...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || !enhancedAnalysis) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Alert severity="info">
            <Typography variant="body2">
              ML Risk Model is currently unavailable. Using rule-based risk assessment only.
            </Typography>
            {error && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Error: {error}
              </Typography>
            )}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { mlPrediction, mlAvailable, combinedScore, combinedCategory, ruleBasedScore } =
    enhancedAnalysis;

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PsychologyIcon sx={{ color: brandColors.primary }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
          ML-Enhanced Risk Assessment
        </Typography>
        {mlAvailable && (
          <Chip
            label="ML Active"
            size="small"
            color="success"
            icon={<PsychologyIcon />}
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Combined Score Card */}
      <Card sx={{ mb: 2, background: `linear-gradient(135deg, ${brandColors.backgrounds.secondary} 0%, ${brandColors.backgrounds.primary} 100%)` }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Combined Risk Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: 700, color: getRiskColor(combinedScore) }}
                >
                  {combinedScore.toFixed(1)}
                </Typography>
                <Box>
                  <Chip
                    label={combinedCategory}
                    color={getCategoryColor(combinedCategory) as any}
                    sx={{ fontWeight: 600, mb: 1 }}
                  />
                  <Typography variant="caption" display="block">
                    Scale: 1 (Low) - 10 (Very High)
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(combinedScore / 10) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: brandColors.neutral[200],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getRiskColor(combinedScore),
                      borderRadius: 6,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Model Comparison
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, color: brandColors.neutral[700] }}>
                    Rule-Based Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon sx={{ color: brandColors.neutral[500], fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {ruleBasedScore.toFixed(1)}/10
                    </Typography>
                  </Box>
                </Box>

                {mlAvailable && mlPrediction && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, color: brandColors.neutral[700] }}>
                      ML Model Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {mlPrediction.overall_risk_score.toFixed(1)}/10
                      </Typography>
                      <Tooltip title={`Confidence: ${(mlPrediction.confidence_score * 100).toFixed(1)}%`}>
                        <Chip
                          label={`${(mlPrediction.confidence_score * 100).toFixed(0)}%`}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                )}

                {mlAvailable && mlPrediction && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, color: brandColors.neutral[700] }}>
                      Difference
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {mlPrediction.comparison.ml_vs_rule_difference > 0 ? (
                        <TrendingUpIcon sx={{ color: brandColors.error, fontSize: 20 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: brandColors.success, fontSize: 20 }} />
                      )}
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mlPrediction.comparison.ml_vs_rule_difference > 0 ? '+' : ''}
                        {mlPrediction.comparison.ml_vs_rule_difference.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                        {Math.abs(mlPrediction.comparison.ml_vs_rule_difference) < 0.5
                          ? 'Models agree'
                          : mlPrediction.comparison.ml_vs_rule_difference > 0
                            ? 'ML sees higher risk'
                            : 'ML sees lower risk'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ML Details Expandable Section */}
      {mlAvailable && mlPrediction && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon sx={{ color: brandColors.primary }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ML Model Details
                </Typography>
              </Box>
              <IconButton
                size="small"
                sx={{
                  transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>

            <Collapse in={showDetails}>
              <Divider sx={{ my: 2 }} />

              {/* Confidence Interval */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  95% Confidence Interval
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`Lower: ${mlPrediction.confidence_interval.lower_bound.toFixed(1)}`}
                    variant="outlined"
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {mlPrediction.overall_risk_score.toFixed(1)}
                  </Typography>
                  <Chip
                    label={`Upper: ${mlPrediction.confidence_interval.upper_bound.toFixed(1)}`}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: brandColors.neutral[600] }}>
                  The model predicts the true risk score falls within this range with 95% confidence
                </Typography>
              </Box>

              {/* Top Risk Drivers */}
              {mlPrediction.top_risk_drivers && mlPrediction.top_risk_drivers.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Top Risk Drivers (Feature Importance)
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Importance
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Impact
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mlPrediction.top_risk_drivers.map((driver, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {driver.feature.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </TableCell>
                            <TableCell align="right">
                              {(driver.importance * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell align="right">
                              <LinearProgress
                                variant="determinate"
                                value={driver.importance * 100}
                                sx={{
                                  width: 80,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: brandColors.neutral[200],
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* ML Recommendations */}
              {mlPrediction.ml_recommendations && mlPrediction.ml_recommendations.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ML-Driven Recommendations
                  </Typography>
                  {mlPrediction.ml_recommendations.map((rec, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 1 }}>
                      {rec}
                    </Alert>
                  ))}
                </Box>
              )}

              {/* Model Metadata */}
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${brandColors.neutral[200]}` }}>
                <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                  Model Version: {mlPrediction.metadata.model_version} | 
                  Prediction Time: {new Date(mlPrediction.metadata.prediction_timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* All Recommendations */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Combined Recommendations
          </Typography>
          {enhancedAnalysis.allRecommendations.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {enhancedAnalysis.allRecommendations.map((rec, index) => (
                <Alert
                  key={index}
                  severity={rec.includes('⚠️') ? 'warning' : 'info'}
                  sx={{ '& .MuiAlert-message': { width: '100%' } }}
                >
                  {rec}
                </Alert>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
              No specific recommendations at this time.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MLRiskPredictionDisplay;


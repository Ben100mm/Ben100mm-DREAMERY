/**
 * Basic Info Section Component
 * Handles basic property information inputs
 */

import React from "react";
import {
  Box,
  Card,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DealState, PropertyType, OperationType, OfferType } from "./types";
import { parseCurrencyWithValidation, getTodayFormatted, getOperationTypeOptions, getOfferTypeOptions } from "./utils";

interface BasicInfoSectionProps {
  state: DealState;
  onUpdate: (field: keyof DealState, value: any) => void;
  setState: React.Dispatch<React.SetStateAction<DealState>>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  state,
  onUpdate,
  setState,
}) => {
  const percentageDifference = state.listedPrice > 0
    ? (((state.purchasePrice - state.listedPrice) / state.listedPrice) * 100).toFixed(1)
    : "0.0";

  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Basic Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <TextField
              fullWidth
              label="Agent/Owner"
              value={state.agentOwner}
              onChange={(e) => onUpdate("agentOwner", e.target.value)}
            />
            <TextField
              fullWidth
              label="Property Address"
              value={state.propertyAddress}
              onChange={(e) => onUpdate("propertyAddress", e.target.value)}
            />
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                },
              }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={state.email}
                onChange={(e) => onUpdate("email", e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={state.call}
                onChange={(e) => onUpdate("call", e.target.value)}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "3fr 4fr 4fr 2fr",
                },
              }}
            >
              <TextField
                fullWidth
                label="Analysis Date"
                placeholder="MM / DD / YY"
                value={getTodayFormatted()}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Listed Price"
                value={
                  state.listedPrice
                    ? state.listedPrice.toLocaleString("en-US")
                    : ""
                }
                onChange={(e) =>
                  onUpdate(
                    "listedPrice",
                    parseCurrencyWithValidation(
                      e.target.value,
                      "Listed Price",
                      setState,
                    ),
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Purchase Price"
                value={
                  state.purchasePrice
                    ? state.purchasePrice.toLocaleString("en-US")
                    : ""
                }
                onChange={(e) =>
                  onUpdate(
                    "purchasePrice",
                    parseCurrencyWithValidation(
                      e.target.value,
                      "Purchase Price",
                      setState,
                    ),
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="% Difference"
                value={`${percentageDifference}%`}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={state.propertyType}
                onChange={(e) =>
                  onUpdate("propertyType", e.target.value as PropertyType)
                }
                label="Property Type"
              >
                <MenuItem value="Single Family">Single Family</MenuItem>
                <MenuItem value="Multi Family">Multi Family</MenuItem>
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Operation Type</InputLabel>
              <Select
                value={state.operationType}
                onChange={(e) =>
                  onUpdate("operationType", e.target.value as OperationType)
                }
                label="Operation Type"
              >
                {getOperationTypeOptions(state.propertyType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Finance Type</InputLabel>
              <Select
                value={state.offerType}
                onChange={(e) =>
                  onUpdate("offerType", e.target.value as OfferType)
                }
                label="Finance Type"
              >
                {getOfferTypeOptions(
                  state.propertyType,
                  state.operationType,
                ).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};


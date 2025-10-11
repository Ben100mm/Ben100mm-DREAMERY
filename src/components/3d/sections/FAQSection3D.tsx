/**
 * FAQ Section 3D Component
 */

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { brandColors } from '../../../theme/theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  { q: 'What is the minimum spend requirement?', a: 'Our starter plan begins at $199/month with no long-term contract required.' },
  { q: 'How long does campaign approval take?', a: 'Most campaigns are reviewed and approved within 24 hours.' },
  { q: 'Can I pause or cancel my campaign?', a: 'Yes, you can pause or cancel anytime with no penalties.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH transfers, and wire transfers.' },
  { q: 'Do you offer performance guarantees?', a: 'Yes, we offer a 30-day money-back guarantee if you are not satisfied with results.' },
];

export const FAQSection3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <group visible={visible} position={[0, 0, 0]}>
      {faqs.map((_, index) => (
        <mesh key={index} position={[-4 + index * 2, 1 - index * 0.3, -2]}>
          <boxGeometry args={[1.5, 0.3, 0.1]} />
          <meshStandardMaterial color={brandColors.primary} metalness={0.6} roughness={0.4} transparent opacity={0.8} />
        </mesh>
      ))}

      <Html position={[0, 3, 0]} center distanceFactor={10}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Frequently Asked Questions
        </Typography>
      </Html>

      <Html position={[0, -2, 0]} center distanceFactor={8}>
        <Box sx={{ width: '800px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', p: 4 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={() => setExpanded(expanded === `panel${index}` ? false : `panel${index}`)}
              sx={{ mb: 2, borderRadius: '12px !important', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Html>
    </group>
  );
};


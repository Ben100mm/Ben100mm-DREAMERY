import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Chip } from '@mui/material';
import PageTemplate from '../components/PageTemplate';

const PartnerProfileCompletionPage: React.FC = () => {
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:5055/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          company,
          bio,
          services: services.split(',').map((s) => s.trim()).filter(Boolean),
          languages: languages.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTemplate title="Complete Your Partner Profile" subtitle="Tell clients about your services and coverage" showAuthContent={true}>
      <Box sx={{ display: 'grid', gap: 2, maxWidth: 720, mx: 'auto' }}>
        <Card><CardContent>
          <Typography variant="h6" gutterBottom>Basic Info</Typography>
          <TextField fullWidth label="Company" value={company} onChange={(e) => setCompany(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} multiline rows={4} sx={{ mb: 2 }} />
          <TextField fullWidth label="Services (comma-separated)" value={services} onChange={(e) => setServices(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Languages (comma-separated)" value={languages} onChange={(e) => setLanguages(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </Button>
          {saved && <Chip color="success" label="Saved" sx={{ ml: 2 }} />}
        </CardContent></Card>
      </Box>
    </PageTemplate>
  );
};

export default PartnerProfileCompletionPage;



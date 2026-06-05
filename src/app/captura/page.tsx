import React from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { OcrValidationForm } from '@/components/organisms/OcrValidationForm';

export default function Captura() {
  return (
    <MobileLayout>
      <OcrValidationForm />
    </MobileLayout>
  );
}

// app/(Pages)/EmailVerification/page.tsx
import { Suspense } from 'react';
import EmailVerificationClient from './EmailVerifcation';

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <EmailVerificationClient />
    </Suspense>
  );
}

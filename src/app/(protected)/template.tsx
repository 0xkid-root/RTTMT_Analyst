'use client';

import { PageTransition } from '@/components/animations/PageTransition';

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

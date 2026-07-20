import type { ReactNode } from 'react';
import { ReaderShell } from '../../components/layout';

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return <ReaderShell>{children}</ReaderShell>;
}

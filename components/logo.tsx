import { cn } from '@/lib/utils';
import Image from 'next/image';
import type React from 'react';

export const LogoIcon = (props: React.ComponentProps<'div'>) => (
  <div {...props}>
    <Image
      src="/Logos/AppLogo.png"
      alt="Xevora Logo"
      width={24}
      height={24}
      className="object-contain"
    />
  </div>
);

export const Logo = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('inline-flex items-center gap-2', className)} {...props}>
    <Image
      src="/Logos/AppLogo.png"
      alt="Xevora Logo"
      width={32}
      height={32}
      className="object-contain"
    />
    <span className="text-lg font-semibold">Xevora</span>
  </div>
);

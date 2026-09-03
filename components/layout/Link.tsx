'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export function Link({
  href,
  children,
  className = '',
  activeClassName = 'is-active',
  ...props
}: LinkProps) {
  const pathname = usePathname() || '';
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <NextLink
      href={href}
      className={combinedClassName || undefined}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export default Link;

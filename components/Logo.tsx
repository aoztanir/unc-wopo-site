import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Image } from '@mantine/core';

export default function Logo({
  size = 100,
  href = '/',
  variant = 'blue',
  ...props
}: {
  size: number;
  href: string;
  variant: 'blue' | 'white';
}) {
  const router = useRouter();
  return (
    <>
      <Image
        src={variant === 'white' ? '/unc_white.png' : '/unc_blue.png'}
        alt="Ace Glass Logo"
        mah={size}
        maw={size}
        // component={Link}
        onClick={() => router.push(href)}
        style={{ cursor: 'pointer' }}
        {...props}
        // href="/"
      />
    </>
  );
}

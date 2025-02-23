'use client';

import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { Box, Burger, Button, Drawer, Group, Menu, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from './Logo';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="bebas-neue-font"
    style={{
      textDecoration: 'none',
      color: 'white',
      padding: '8px 12px',
      fontWeight: 'bold',
      fontSize: '24px',
    }}
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    className="bebas-neue-font"
    onClick={onClick}
    style={{
      textDecoration: 'none',
      color: 'white',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '20px',
      width: '100%',
      display: 'block',
    }}
  >
    {children}
  </Link>
);

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/roster', label: 'Team' },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#recruitment', label: 'Recruitment' },
  { href: '/#about', label: 'About' },
  { href: '/#donate', label: 'Donate' },
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <Box bg="var(--mantine-color-blue-3)" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Group justify="space-between" h={{ base: 60, sm: 80 }} px={{ base: 'xs', sm: 'md' }}>
        {/* Logo and Burger Section */}
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="white" />
          <Box style={{ position: 'relative' }}>
            <Logo size={{ base: 40, sm: 50 }} href="/" variant="white" />
          </Box>
        </Group>

        {/* Desktop Navigation */}
        <Group gap={{ base: 'xs', sm: 'md' }} visibleFrom="md">
          <Link href="https://www.instagram.com/unc/" target="_blank">
            <ThemeIcon size={35} color="white" variant="transparent">
              <IconBrandInstagram size="25" />
            </ThemeIcon>
          </Link>

          {navLinks.map((link, index) => (
            <NavLink key={index} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <Button variant="white" size="sm" radius="md" c="black" component={Link} href="/admin">
            Login
          </Button>
        </Group>

        {/* Mobile Navigation Drawer */}
        <Drawer
          opened={opened}
          onClose={close}
          size="100%"
          padding="md"
          hiddenFrom="md"
          title={<Logo size={40} href="/" variant="white" />}
          styles={{
            content: {
              backgroundColor: 'var(--mantine-color-blue-3)',
            },
            header: {
              backgroundColor: 'var(--mantine-color-blue-3)',
            },
            close: {
              color: 'white',
            },
          }}
        >
          <Box mt="xl">
            <Link
              href="https://www.instagram.com/unc/"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Group align="center" mb="md">
                <ThemeIcon size={30} color="white" variant="transparent">
                  <IconBrandInstagram size="24" />
                </ThemeIcon>
                <span className="bebas-neue-font" style={{ fontSize: '20px', color: 'white' }}>
                  Instagram
                </span>
              </Group>
            </Link>

            {navLinks.map((link, index) => (
              <MobileNavLink key={index} href={link.href} onClick={close}>
                {link.label}
              </MobileNavLink>
            ))}
          </Box>
        </Drawer>
      </Group>
    </Box>
  );
}

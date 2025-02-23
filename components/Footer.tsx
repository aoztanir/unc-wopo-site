'use client';

import Link from 'next/link';
import { Container, Group, Stack, Text, Title } from '@mantine/core';
import Logo from './Logo';

export default function Footer() {
  return (
    <div style={{ backgroundColor: 'var(--mantine-color-blue-3)', marginTop: '100px' }}>
      <Container size="lg" py="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap="md">
            <Logo size={60} href="/" />
            <Text size="sm" c="white" maw={300}>
              UNC Men's Water Polo - Fostering excellence in athletics and team spirit since 1995
            </Text>
          </Stack>

          <Stack gap="xs">
            <Title order={4} c="white" fz="30">
              Quick Links
            </Title>
            <Link href="/roster" style={{ textDecoration: 'none' }}>
              <Text size="md" c="white">
                Roster
              </Text>
            </Link>
            <Link href="/schedule" style={{ textDecoration: 'none' }}>
              <Text size="md" c="white">
                Schedule
              </Text>
            </Link>
            <Link href="/about" style={{ textDecoration: 'none' }}>
              <Text size="md" c="white">
                About Us
              </Text>
            </Link>
            <Link href="/join" style={{ textDecoration: 'none' }}>
              <Text size="md" c="white">
                Join the Team
              </Text>
            </Link>
          </Stack>

          <Stack gap="xs">
            <Title order={4} fz="30" c="white">
              Contact
            </Title>
            <Text size="sm" c="white">
              Email: waterpolo@unc.edu
            </Text>
            <Text size="sm" c="white">
              Practice Location:
            </Text>
            <Text size="sm" c="white">
              Koury Natatorium
            </Text>
            <Text size="sm" c="white">
              Chapel Hill, NC 27514
            </Text>
          </Stack>
        </Group>

        <Text ta="center" c="white" mt={50} size="sm">
          © 2024 UNC Men's Water Polo. All rights reserved.
        </Text>
      </Container>
    </div>
  );
}

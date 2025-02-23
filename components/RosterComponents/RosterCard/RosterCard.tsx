import Link from 'next/link';
import { GraduationCap, House, NumberCircleOne, Trophy, User } from '@phosphor-icons/react';
import { UserCircle } from '@phosphor-icons/react/dist/ssr';
import { BackgroundImage, Badge, Box, Card, Group, Overlay, Stack, Text } from '@mantine/core';

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  graduation_year: string;
  hometown: string;
  headshot_url: string;
  major: string;
  is_staff: boolean;
}

interface RosterCardProps {
  index: number;
  player: Player;
  height: number;
  small?: boolean;
}

export default function RosterCard({
  index,
  player,
  height,
  small = false,
  ...props
}: RosterCardProps) {
  return (
    <Card
      shadow="xl"
      padding="lg"
      radius="lg"
      withBorder
      maw={height}
      mx="auto"
      {...props}
      component={Link}
      href={`/roster/${player.id}`}
    >
      <Card.Section pos="relative">
        <BackgroundImage
          src={
            player.headshot_url ||
            'https://media.istockphoto.com/id/613519648/photo/confident-proud-portrait-of-professional-water-polo-player-holding-ball.jpg?s=612x612&w=0&k=20&c=RHFugb7h-qnZJv4YnfIvaondapyHxyHCrioJNumcR84='
          }
          h={height}
          w={height}
          style={{ objectFit: 'cover', aspectRatio: '1/1' }}
        />
        <Box pos="absolute" bottom={0} left={0} right={0} p="md">
          <Overlay
            gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)"
            opacity={0.5}
          />
          <Group gap="xs" wrap="nowrap" style={{ position: 'relative', zIndex: 2 }}>
            <User size={20} color="white" weight="fill" />
            <Text fw={900} size="xl" c="white" style={{ lineHeight: 1.2 }}>
              {player.name}
            </Text>
          </Group>
          {!player.is_staff ? (
            <Text size="xs" c="gray.3" style={{ position: 'relative', zIndex: 2 }}>
              {player.hometown}
            </Text>
          ) : (
            <Text size="xs" c="gray.3" style={{ position: 'relative', zIndex: 2 }}>
              {player.major}
            </Text>
          )}
        </Box>
      </Card.Section>

      {player.is_staff ? (
        <>
          <Stack gap="xs" mt="md" mb="xs">
            <Group gap="xs">
              <House size={16} weight="fill" />
              <Text size="sm" c="dimmed">
                {player.hometown}
              </Text>
            </Group>
          </Stack>
        </>
      ) : (
        <Stack gap="xs" mt="md" mb="xs">
          <Group gap="xs">
            <GraduationCap size={16} weight="fill" />
            <Text size="sm" c="dimmed">
              {player.graduation_year}
            </Text>
          </Group>

          {!small && (
            <Group gap="xs">
              <House size={16} weight="fill" />
              <Text size="sm" c="dimmed">
                {player.hometown}
              </Text>
            </Group>
          )}
        </Stack>
      )}

      {player.is_staff ? (
        <>
          <Badge
            mt={small ? 'sm' : 'md'}
            size="md"
            variant="light"
            color="orange"
            leftSection={<UserCircle size={14} />}
          >
            Staff
          </Badge>
        </>
      ) : (
        <Group justify="space-between" mb="0" mt={small ? 'sm' : 'md'}>
          <Badge size="md" variant="light" color="blue">
            #{player.number}
          </Badge>
          <Badge size="md" variant="light" color="gray" leftSection={<Trophy size={14} />}>
            {player.position}
          </Badge>
        </Group>
      )}
    </Card>
  );
}

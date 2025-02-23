'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GraduationCap,
  House,
  NumberCircleOne,
  Trophy,
  User,
} from '@phosphor-icons/react';
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/utils/supabase/client';

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  graduation_year: string;
  hometown: string;
  major: string;
  headshot_url: string;
  is_staff: boolean;
}

export default function PlayerPage({ params }: { params: { id: string[] } }) {
  const resolvedParams = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data, error } = await supabase
        .from('roster')
        .select('*')
        .eq('id', resolvedParams.id[0])
        .single();

      if (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch player details',
          color: 'red',
        });
      } else {
        setPlayer(data);
      }
    };

    fetchPlayer();
  }, [resolvedParams.id]);

  if (!player) {
    return (
      <Container size="lg" py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
        <Loader size="xl" type="bars" />
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'md', md: 'xl' }}>
      <Button
        variant="subtle"
        color="gray"
        size="sm"
        mb="xl"
        leftSection={<ArrowLeft size={16} />}
        component={Link}
        href="/roster"
      >
        Back to Roster
      </Button>
      <Card shadow="xl" p={{ base: 'md', md: 'xl' }} withBorder>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 'md', md: 'xl' }}
          align={{ md: 'stretch' }}
        >
          <Card w={{ base: '100%', md: '40%' }} p="0" radius="md">
            <Image
              src={player.headshot_url || '/default-avatar.png'}
              alt={player.name}
              radius="md"
              h={{ base: 300, md: 450 }}
              fit="cover"
            />
          </Card>

          <Stack w={{ base: '100%', md: '60%' }} justify="flex-start">
            <Title order={1} size="h1" className="bebas-neue-font">
              {player.name}
            </Title>
            <Badge size="xl" variant="light" radius="md" mt="0" ta="center">
              {player.is_staff ? 'Staff' : `#${player.number} • ${player.position}`}
            </Badge>

            <Stack gap="lg" mt={{ base: 'xs', md: 'md' }}>
              {!player.is_staff && (
                <Group gap="sm">
                  <GraduationCap size={32} weight="fill" />
                  <Text size={{ base: 'lg', sm: 'xl' }} fw={500}>
                    Class of {player.graduation_year}
                  </Text>
                </Group>
              )}

              <Group gap="sm">
                <House size={32} weight="fill" />
                <Text size={{ base: 'lg', sm: 'xl' }} fw={500}>
                  {player.hometown}
                </Text>
              </Group>

              {!player.is_staff && (
                <Group gap="sm">
                  <Trophy size={32} weight="fill" />
                  <Text size={{ base: 'lg', sm: 'xl' }} fw={500}>
                    {player.major}
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>
        </Flex>
      </Card>
    </Container>
  );
}

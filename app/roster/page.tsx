'use client';

import { useEffect, useState } from 'react';
import { Container, Group, Select, SimpleGrid, Title } from '@mantine/core';
import RosterCard from '@/components/RosterComponents/RosterCard/RosterCard';
import { createClient } from '@/utils/supabase/client';

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  year: string;
  hometown: string;
  headshot_url: string;
  roster_year_id: string;
}

interface RosterYear {
  id: string;
  year: string;
  current: boolean;
}

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rosterYears, setRosterYears] = useState<RosterYear[]>([]);
  const [selectedRoster, setSelectedRoster] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchRosterYears = async () => {
      const { data, error } = await supabase.from('roster_years').select('*');
      if (error) {
        console.error('Error fetching roster years:', error);
      } else {
        setRosterYears(data || []);
        // Set default selected roster to current year
        const currentYear = data?.find((year) => year.current);
        if (currentYear) {
          setSelectedRoster(currentYear.id);
        }
      }
    };

    fetchRosterYears();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!selectedRoster) return;

      const { data, error } = await supabase
        .from('roster')
        .select('*')
        .eq('roster_year_id', selectedRoster)
        .order('number');

      if (error) {
        console.error('Error fetching players:', error);
      } else {
        setPlayers(data || []);
      }
    };

    fetchPlayers();
  }, [selectedRoster]);

  return (
    <Container size="100%" py="xl">
      <Group justify="space-between" align="flex-end" mb="xl">
        <Title ta="left" fz="60px" fw={900} c="blue.7">
          Team Roster
        </Title>
        <Select
          // label="Select Roster Year"
          size="xl"
          value={selectedRoster}
          onChange={(value) => setSelectedRoster(value || '')}
          data={rosterYears.map((ry) => ({
            value: ry.id,
            label: ry.year,
          }))}
          w={200}
          styles={{
            input: {
              fontFamily: 'Bebas Neue',
              fontSize: '35px',
              fontWeight: 900,
            },
          }}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {players.map((player, index) => (
          <RosterCard key={player.id} index={index} player={player} height={300} mb="sm" />
        ))}
      </SimpleGrid>
    </Container>
  );
}

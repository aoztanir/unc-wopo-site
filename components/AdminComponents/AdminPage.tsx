'use client';

import { useEffect, useState } from 'react';
import { Center, Container, Loader, Tabs, Text, Title } from '@mantine/core';
import { createClient } from '@/utils/supabase/client';
import EditRosterPage from './EditRosterPage';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('roster');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (data) {
          setIsAdmin(data.is_admin);
        }
      }
      setLoading(false);
    }

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <Container size="xl" mt="xl" h="70vh">
        <Center>
          <Loader size="xl" type="bars" />
        </Center>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container size="xl" mt="xl" h="70vh">
        <Title order={1} mb="xl" c="red">
          Access Denied
        </Title>
        <Text>You do not have administrator privileges to view this page.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={1} mb="xl">
        Admin Dashboard
      </Title>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
        <Tabs.List grow>
          <Tabs.Tab value="roster">Edit Roster</Tabs.Tab>
          <Tabs.Tab value="schedule">Edit Schedule</Tabs.Tab>
          <Tabs.Tab value="website">Edit Website</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="roster">
          <EditRosterPage />
        </Tabs.Panel>

        <Tabs.Panel value="schedule">
          <Title order={2} mt="xl">
            Schedule Editor Coming Soon
          </Title>
        </Tabs.Panel>

        <Tabs.Panel value="website">
          <Title order={2} mt="xl">
            Website Editor Coming Soon
          </Title>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

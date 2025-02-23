'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Paper, PasswordInput, Tabs, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import AdminPage from '@/components/AdminComponents/AdminPage';
import { createClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      notifications.show({
        title: 'Login Error',
        message: error.message,
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });
      setIsLoggedIn(true);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      notifications.show({
        title: 'Signup Error',
        message: error.message,
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Please check your email for the confirmation link',
        color: 'green',
      });
    }
  };

  if (isLoggedIn) {
    return <AdminPage />;
    // <Container size={420} my={40} mih="60vh">
    //   <Title ta="center" className="bebas-neue-font">
    //     Admin Dashboard
    //   </Title>
    //   <Paper withBorder shadow="md" p={30} mt={30} radius="md">
    //     <p>Welcome to the admin dashboard!</p>
    //     {/* Add your admin dashboard content here */}
    //   </Paper>
    // </Container>
  }

  return (
    <Container size={420} my={40} mih="60vh">
      <Title ta="center" className="bebas-neue-font">
        Admin Portal
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="signup">Create Account</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <form onSubmit={handleLogin}>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mt="md"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth mt="xl">
                Sign in
              </Button>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup">
            <form onSubmit={handleSignUp}>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mt="md"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth mt="xl">
                Create Account
              </Button>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

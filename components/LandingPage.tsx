'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowSquareOut,
  CalendarPlus,
  Car,
  DownloadSimple,
  Handshake,
  List,
  MagnifyingGlass,
  SwimmingPool,
  Trophy,
  Users,
  Volleyball,
} from '@phosphor-icons/react';
import { IconPool, IconWaterpolo } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/utils/supabase/client';
import Logo from './Logo';
import RosterCard from './RosterComponents/RosterCard/RosterCard';

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  graduation_year: string;
  hometown: string;
  major: string;
  headshot_url: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  year: string;
  about: string;
}

interface RosterYear {
  year: string;
  current: boolean;
  id: string;
}
export default function LandingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rosterYears, setRosterYears] = useState<RosterYear[]>([]);
  const [selectedRoster, setSelectedRoster] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: '',
    year: '',
    about: '',
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchRosterData = async () => {
      // First fetch roster years
      const { data: yearData, error: yearError } = await supabase
        .from('roster_years')
        .select('*')
        .order('year', { ascending: false });

      if (yearError) {
        console.error('Error fetching roster years:', yearError);
        return;
      }

      if (yearData) {
        setRosterYears(yearData);

        // Find current year and set as default
        const currentYear = yearData.find((year) => year.current);
        if (currentYear) {
          setSelectedRoster(currentYear.id);

          // Fetch players for current year
          const { data: playerData, error: playerError } = await supabase
            .from('roster')
            .select('*')
            .eq('roster_year_id', currentYear.id)
            .order('number');

          if (playerError) {
            console.error('Error fetching players:', playerError);
            notifications.show({
              title: 'Error',
              message: 'Failed to fetch roster data',
              color: 'red',
            });
          } else {
            setPlayers(playerData || []);
          }
        }
      }
    };

    fetchRosterData();
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
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch roster data',
          color: 'red',
        });
      } else {
        setPlayers(data || []);
      }
    };

    fetchPlayers();
  }, [selectedRoster]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.from('recruits').insert([
      {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone_number: formData.phone,
        experience_level: formData.experienceLevel,
        year: formData.year,
        about_response: formData.about,
      },
    ]);

    if (error) {
      console.error('Error submitting form:', error);
      notifications.show({
        title: 'Error!',
        message: 'There was an error submitting your form. Please try again.',
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success!',
        message: 'Thank you for your interest! We will contact you soon.',
        color: 'green',
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        experienceLevel: '',
        year: '',
        about: '',
      });
    }
  };

  return (
    <>
      <BackgroundImage
        src="/team.jpg"
        h={{ base: '300px', sm: '400px', md: '450px', xl: '500px' }}
        w="100%"
      >
        <Center h="100%">
          <Title
            fz={{ base: '3rem', sm: '5rem', md: '7rem' }}
            fw={700}
            c="white"
            ta="center"
            px="md"
          >
            Club Water Polo
          </Title>
        </Center>
      </BackgroundImage>
      <Container size="100%" mt="xl" px={{ base: 'xs', sm: 'xl' }}>
        <Group
          align="center"
          justify="space-between"
          gap={{ base: 'xs', sm: 'xl' }}
          mb="lg"
          wrap="wrap"
        >
          <Select
            data={rosterYears.map((year) => ({
              value: year.id,
              label: year.year,
            }))}
            // size={{ base: 'md', sm: 'xl' }}
            size="xl"
            variant="filled"
            defaultValue={rosterYears.find((year) => year.current)?.id}
            fw="900"
            value={selectedRoster}
            onChange={(value) => setSelectedRoster(value || '')}
            className="bebas-neue-font"
            styles={{
              input: {
                fontFamily: 'Bebas Neue',
                fontSize: '35px',
              },
            }}
            w={{ base: '100%', sm: 'auto' }}
          />
          <Group align="center" gap="md" wrap="wrap">
            <TextInput
              placeholder="Search players..."
              leftSection={<MagnifyingGlass size={20} />}
              size="md"
              radius="md"
              w={{ base: '100%', sm: 'auto' }}
            />
            <Group
              w={{ base: '100%', sm: 'auto' }}
              justify={{ base: 'space-between', sm: 'flex-start' }}
            >
              <Button
                variant="default"
                size="md"
                radius="md"
                leftSection={<List size={20} />}
                component={Link}
                href="/roster"
                fullWidth={false}
              >
                View Full Roster
              </Button>
              <ActionIcon variant="filled" size="xl" radius="md" component={Link} href="/roster">
                <ArrowSquareOut weight="fill" size="25" />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Container>

      <Container size="100%" pr={{ base: 'xs', sm: '0' }}>
        <Carousel
          slideSize={{ base: '250px', sm: '300px' }}
          height={{ base: '350px', sm: '400px' }}
          slideGap="md"
          align="start"
          slidesToScroll={1}
          loop
        >
          {players.map((player) => (
            <Carousel.Slide key={player.id}>
              <RosterCard player={player} height={250} small />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>

      <Container size="100%" px={{ base: 'xs', sm: 'xl' }}>
        <Group align="center" justify="space-between" gap="xl" mb="lg" id="schedule">
          <Title ta="left" fz={{ base: '40px', sm: '60px' }} fw={900}>
            Team Schedule
          </Title>
          <Button variant="default" size="md" radius="md" leftSection={<CalendarPlus size={20} />}>
            Calendar (Coming Soon!)
          </Button>
        </Group>
        <Title order={2} ta="center" c="dimmed" my="xl">
          Schedule Coming Soon
        </Title>

        <Box id="recruitment">
          <Group mb="lg" mt="75px" justify="space-between" align="center" wrap="wrap">
            <Title ta="left" fz={{ base: '50px', sm: '90px' }} fw={900} c="blue.7">
              Interested?
            </Title>
            <Volleyball size={100} color="var(--mantine-color-yellow-4)" />
          </Group>

          <Text size={{ base: 'md', sm: 'lg' }} c="dimmed" mb="xl">
            Interested in joining UNC Men's Water Polo? Fill out the form below and we'll get back
            to you with more information about tryouts and practice schedules.
          </Text>

          <form onSubmit={handleFormSubmit}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
              <TextInput
                size="md"
                label="First Name"
                placeholder="Your first name"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                variant="filled"
              />
              <TextInput
                size="md"
                label="Last Name"
                placeholder="Your last name"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                variant="filled"
              />
              <TextInput
                size="md"
                label="Email"
                placeholder="your.email@example.com"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                variant="filled"
              />
              <TextInput
                size="md"
                label="Phone Number"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                variant="filled"
              />
              <Select
                label="Experience Level"
                placeholder="Select your experience"
                data={[
                  { value: 'none', label: 'No experience' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                  { value: 'competitive', label: 'Competitive/Club Experience' },
                ]}
                required
                value={formData.experienceLevel}
                onChange={(value) => handleInputChange('experienceLevel', value || '')}
                variant="filled"
              />
              <Select
                label="Year"
                placeholder="Select your year"
                data={[
                  { value: 'incoming', label: 'Incoming Freshman' },
                  { value: 'freshman', label: 'Freshman' },
                  { value: 'sophomore', label: 'Sophomore' },
                  { value: 'junior', label: 'Junior' },
                  { value: 'senior', label: 'Senior' },
                  { value: 'graduate', label: 'Graduate Student' },
                ]}
                required
                value={formData.year}
                onChange={(value) => handleInputChange('year', value || '')}
                variant="filled"
              />
            </SimpleGrid>

            <Textarea
              size="md"
              label="Tell us about yourself"
              placeholder="Share any relevant experience, why you want to join the team, or questions you have"
              minRows={4}
              mb="md"
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              variant="filled"
            />
            <Group justify="flex-end">
              <Button
                mt="md"
                type="submit"
                size="md"
                variant="default"
                fullWidth={{ base: true, sm: false }}
              >
                Submit Interest Form
              </Button>
            </Group>
          </form>
        </Box>

        <Box id="about">
          <Group mb="lg" mt="75px" justify="space-between" align="center" wrap="wrap">
            <Title ta="left" fz={{ base: '50px', sm: '90px' }} fw={900}>
              About Us
            </Title>
            <Logo size={100} href="/" variant="blue" />
          </Group>

          <Text size={{ base: 'md', sm: 'lg' }} c="dimmed" mb="xl">
            The UNC Men's Water Polo team is a competitive club sports program at the University of
            North Carolina at Chapel Hill. Founded in 1995, we compete against other collegiate
            teams in the CWPA. Our team welcomes players of all skill levels, from beginners to
            experienced athletes, fostering an environment of growth, teamwork, and athletic
            excellence.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
            <Box>
              <ThemeIcon size={40} radius={40}>
                <Trophy style={{ width: 24, height: 24 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={500}>
                Competitive Success
              </Text>
              <Text size="sm" c="dimmed">
                We host the largest Spring tournament in the nation, the UNC Invitational
              </Text>
            </Box>
            <Box>
              <ThemeIcon size={40} radius={40}>
                <Users style={{ width: 24, height: 24 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={500}>
                Team Culture
              </Text>
              <Text size="sm" c="dimmed">
                Strong brotherhood, excellent team spirit, and frequent social events both in and
                out of the pool
              </Text>
            </Box>
            <Box>
              <ThemeIcon size={40} radius={40}>
                <SwimmingPool style={{ width: 24, height: 24 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={500}>
                Development
              </Text>
              <Text size="sm" c="dimmed">
                Dedicated coaches and elite training programs for all skill levels
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box mt={100} style={{ borderRadius: 20 }} id="donate">
          <Group mb="lg" justify="space-between" align="center" wrap="wrap">
            <Title ta="left" fz={{ base: '50px', sm: '90px' }} fw={900} c="blue.7">
              Support Us
            </Title>
            <Handshake size={100} color="var(--mantine-color-teal-4)" />
          </Group>
          <Text size={{ base: 'md', sm: 'lg' }} c="dimmed" mb="xl" maw={800}>
            Your support helps us maintain our competitive program, purchase equipment, and cover
            travel expenses for tournaments. Consider making a donation to help the UNC Men's Water
            Polo team continue to grow and succeed.
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb="xl">
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <ThemeIcon size={50} radius={50} variant="light" color="blue">
                <Trophy style={{ width: 30, height: 30 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={600} c="blue.9">
                Equipment Needs
              </Text>
              <Text size="sm" c="dimmed">
                Help us purchase new balls, caps, goals and other essential equipment
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <ThemeIcon size={50} radius={50} variant="light" color="blue">
                <Car style={{ width: 30, height: 30 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={600} c="blue.9">
                Travel Support
              </Text>
              <Text size="sm" c="dimmed">
                Enable us to compete in tournaments across the Southeast and nationally
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <ThemeIcon size={50} radius={50} variant="light" color="blue">
                <IconPool style={{ width: 30, height: 30 }} />
              </ThemeIcon>
              <Text mt="sm" mb="xs" fw={600} c="blue.9">
                Pool Time
              </Text>
              <Text size="sm" c="dimmed">
                Support our practice facility rentals and coaching expenses
              </Text>
            </Card>
          </SimpleGrid>

          <Group mt={40} justify={{ base: 'center', sm: 'flex-start' }} wrap="wrap">
            <Button
              size="xl"
              component="a"
              radius="lg"
              href="https://give.unc.edu"
              target="_blank"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              fullWidth={{ base: true, sm: false }}
            >
              Donate Now
            </Button>
            <Button
              size="xl"
              component="a"
              href="/contact"
              variant="outline"
              color="blue"
              radius="lg"
              fullWidth={{ base: true, sm: false }}
            >
              Contact Us
            </Button>
          </Group>

          <Text
            size="sm"
            c="dimmed"
            mt="xl"
            ta="center"
            maw={600}
            mx="auto"
            px={{ base: 'xs', sm: 0 }}
            style={{ fontStyle: 'italic' }}
          >
            All donations are tax-deductible. UNC Men's Water Polo is a registered club sport at the
            University of North Carolina at Chapel Hill.
          </Text>
        </Box>
      </Container>
    </>
  );
}

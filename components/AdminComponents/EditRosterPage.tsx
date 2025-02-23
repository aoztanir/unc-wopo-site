'use client';

import { useEffect, useState } from 'react';
import { Upload, X } from '@phosphor-icons/react';
import { IconPhoto } from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  Container,
  FileInput,
  Group,
  Image,
  Modal,
  NumberInput,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/utils/supabase/client';

interface RosterYear {
  id: string;
  year: string;
}

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
  roster_year_id: string;
}

interface NewPlayer {
  name: string;
  number: number;
  position: string;
  graduation_year: string;
  hometown: string;
  major: string;
  headshot: File | null;
  previewUrl: string | null;
  is_staff: boolean;
  roster_year_id: string;
}

export default function EditRosterPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [selectedRosterYearId, setSelectedRosterYearId] = useState<string | null>(null);
  const [availableRosterYears, setAvailableRosterYears] = useState<RosterYear[]>([]);
  const [newPlayerData, setNewPlayerData] = useState<NewPlayer>({
    name: '',
    number: 0,
    position: '',
    graduation_year: '',
    hometown: '',
    major: '',
    headshot: null,
    previewUrl: null,
    is_staff: false,
    roster_year_id: '',
  });
  const supabase = createClient();

  useEffect(() => {
    fetchAvailableRosterYears();
  }, []);

  useEffect(() => {
    if (selectedRosterYearId !== null) {
      fetchPlayers();
    }
  }, [selectedRosterYearId]);

  const fetchAvailableRosterYears = async () => {
    const { data, error } = await supabase
      .from('roster_years')
      .select('id, year')
      .order('year', { ascending: false });
    if (!error && data) {
      setAvailableRosterYears(data);
    }
  };

  const fetchPlayers = async () => {
    try {
      console.log('Selected roster year ID:', selectedRosterYearId);
      const { data, error } = await supabase
        .from('roster')
        .select('*')
        .eq('roster_year_id', selectedRosterYearId)
        .order('number');

      if (error) {
        throw error;
      }

      console.log('Fetched players:', data); // Debug log
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch roster',
        color: 'red',
      });
    }
  };

  const deleteImageFromStorage = async (url: string) => {
    if (!url) return;
    const fileName = url.split('/').pop();
    if (fileName) {
      const { error } = await supabase.storage.from('headshots').remove([fileName]);
      if (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleDeletePlayer = async (player: Player) => {
    if (player.headshot_url) {
      await deleteImageFromStorage(player.headshot_url);
    }

    const { error } = await supabase.from('roster').delete().eq('id', player.id);

    if (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete player',
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Player deleted successfully',
        color: 'green',
      });
      fetchPlayers();
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
    }
  };

  const handleEditPlayer = async (updatedPlayer: Player, newHeadshot?: File) => {
    let newHeadshotUrl = updatedPlayer.headshot_url;

    if (newHeadshot) {
      // Delete old image if it exists
      if (updatedPlayer.headshot_url) {
        await deleteImageFromStorage(updatedPlayer.headshot_url);
      }

      // Upload new image
      const fileExt = newHeadshot.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('headshots')
        .upload(fileName, newHeadshot);

      if (uploadError) {
        notifications.show({
          title: 'Error',
          message: 'Failed to upload new headshot',
          color: 'red',
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('headshots').getPublicUrl(fileName);
      newHeadshotUrl = publicUrl;
    }

    const { error } = await supabase
      .from('roster')
      .update({
        name: updatedPlayer.name,
        number: updatedPlayer.number,
        position: updatedPlayer.position,
        graduation_year: updatedPlayer.graduation_year,
        hometown: updatedPlayer.hometown,
        major: updatedPlayer.major,
        headshot_url: newHeadshotUrl,
        is_staff: updatedPlayer.is_staff,
        roster_year_id: updatedPlayer.roster_year_id,
      })
      .eq('id', updatedPlayer.id);

    if (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update player',
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Player updated successfully',
        color: 'green',
      });
      fetchPlayers();
      setIsModalOpen(false);
    }
  };

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    let headshotUrl = '';

    if (newPlayerData.headshot) {
      const fileExt = newPlayerData.headshot.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('headshots')
        .upload(fileName, newPlayerData.headshot);

      if (uploadError) {
        notifications.show({
          title: 'Error',
          message: 'Failed to upload headshot',
          color: 'red',
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('headshots').getPublicUrl(fileName);

      headshotUrl = publicUrl;
    }

    const { error } = await supabase.from('roster').insert([
      {
        name: newPlayerData.name,
        number: newPlayerData.number,
        position: newPlayerData.position,
        graduation_year: newPlayerData.graduation_year,
        hometown: newPlayerData.hometown,
        major: newPlayerData.major,
        headshot_url: headshotUrl,
        is_staff: newPlayerData.is_staff,
        roster_year_id: selectedRosterYearId,
      },
    ]);

    if (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create player',
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Player created successfully',
        color: 'green',
      });
      fetchPlayers();
      setIsNewPlayerModalOpen(false);
      setNewPlayerData({
        name: '',
        number: 0,
        position: '',
        graduation_year: '',
        hometown: '',
        major: '',
        headshot: null,
        previewUrl: null,
        is_staff: false,
        roster_year_id: selectedRosterYearId || '',
      });
    }
  };

  const handleImageDrop = (files: File[]) => {
    const file = files[0];
    setNewPlayerData({
      ...newPlayerData,
      headshot: file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const EditModal = () => {
    if (!editingPlayer) return null;

    const [formData, setFormData] = useState(editingPlayer);
    const [newHeadshot, setNewHeadshot] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(editingPlayer.headshot_url);

    const handleEditImageDrop = (files: File[]) => {
      const file = files[0];
      setNewHeadshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    };

    return (
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Player"
        size="lg"
        zIndex={1000}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditPlayer(formData, newHeadshot || undefined);
          }}
        >
          <TextInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            // required
            mb="md"
          />
          <NumberInput
            label="Number"
            value={formData.number}
            onChange={(val) => setFormData({ ...formData, number: val || 0 })}
            // required
            mb="md"
          />
          <TextInput
            label="Position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            // required
            mb="md"
          />
          <TextInput
            label="Graduation Year"
            value={formData.graduation_year}
            onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
            // required
            mb="md"
          />
          <TextInput
            label="Hometown"
            value={formData.hometown}
            onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
            // required
            mb="md"
          />
          <TextInput
            label="Major"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            // required
            mb="md"
          />
          <Checkbox
            label="Staff Member"
            checked={formData.is_staff}
            onChange={(e) => setFormData({ ...formData, is_staff: e.currentTarget.checked })}
            mb="md"
          />
          <Dropzone onDrop={handleEditImageDrop} accept={['image/*']} maxFiles={1} mb="md">
            <Group justify="center" gap="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <Upload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <X size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>
              <div>
                <Text size="xl" inline>
                  Drag new headshot here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
          {previewUrl && <Image src={previewUrl} alt="Preview" maw={200} mx="auto" mb="md" />}
          <Button type="submit" fullWidth mb="md">
            Save Changes
          </Button>
        </form>
      </Modal>
    );
  };

  return (
    <Container size="xl" my={40}>
      <Group justify="space-between" mb={30}>
        <Title ta="center" className="bebas-neue-font">
          Roster Management
        </Title>
        <Group>
          <Select
            label="Select Roster Year"
            value={selectedRosterYearId}
            onChange={(value) => setSelectedRosterYearId(value)}
            data={availableRosterYears.map((ry) => ({
              value: ry.id,
              label: ry.year,
            }))}
            // required
          />
          <Button onClick={() => setIsNewPlayerModalOpen(true)}>Add New Player</Button>
        </Group>
      </Group>

      <Modal
        opened={isNewPlayerModalOpen}
        onClose={() => setIsNewPlayerModalOpen(false)}
        title="Add New Player"
        size="lg"
        zIndex={1000}
      >
        <form onSubmit={handleCreatePlayer}>
          <TextInput
            label="Name"
            value={newPlayerData.name}
            onChange={(e) => setNewPlayerData({ ...newPlayerData, name: e.target.value })}
            // required
            mb="md"
          />
          <NumberInput
            label="Number"
            value={newPlayerData.number}
            onChange={(val) => setNewPlayerData({ ...newPlayerData, number: val || 0 })}
            // required
            mb="md"
          />
          <TextInput
            label="Position"
            value={newPlayerData.position}
            onChange={(e) => setNewPlayerData({ ...newPlayerData, position: e.target.value })}
            // required
            mb="md"
          />
          <TextInput
            label="Graduation Year"
            value={newPlayerData.graduation_year}
            onChange={(e) =>
              setNewPlayerData({ ...newPlayerData, graduation_year: e.target.value })
            }
            // required
            mb="md"
          />
          <TextInput
            label="Hometown"
            value={newPlayerData.hometown}
            onChange={(e) => setNewPlayerData({ ...newPlayerData, hometown: e.target.value })}
            // required
            mb="md"
          />
          <TextInput
            label="Major"
            value={newPlayerData.major}
            onChange={(e) => setNewPlayerData({ ...newPlayerData, major: e.target.value })}
            // required
            mb="md"
          />
          <Checkbox
            label="Staff Member"
            checked={newPlayerData.is_staff}
            onChange={(e) =>
              setNewPlayerData({ ...newPlayerData, is_staff: e.currentTarget.checked })
            }
            mb="md"
          />
          <Dropzone onDrop={handleImageDrop} accept={['image/*']} maxFiles={1} mb="md">
            <Group justify="center" gap="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <Upload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <X size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>
              <div>
                <Text size="xl" inline>
                  Drag player headshot here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
          {newPlayerData.previewUrl && (
            <Image src={newPlayerData.previewUrl} alt="Preview" maw={200} mx="auto" mb="md" />
          )}
          <Button type="submit" fullWidth>
            Create Player
          </Button>
        </form>
      </Modal>

      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Player"
        size="sm"
        zIndex={1000}
      >
        <Text mb="xl">
          Are you sure you want to delete this player? This action cannot be undone.
        </Text>
        <Group justify="space-between">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => playerToDelete && handleDeletePlayer(playerToDelete)}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Photo</Table.Th>
              <Table.Th>Number</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Graduation Year</Table.Th>
              <Table.Th>Hometown</Table.Th>
              <Table.Th>Staff</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((player) => (
              <Table.Tr key={player.id}>
                <Table.Td>
                  {player.headshot_url && (
                    <Image src={player.headshot_url} alt={player.name} width={50} height={50} />
                  )}
                </Table.Td>
                <Table.Td>{player.number}</Table.Td>
                <Table.Td>{player.name}</Table.Td>
                <Table.Td>{player.position}</Table.Td>
                <Table.Td>{player.graduation_year}</Table.Td>
                <Table.Td>{player.hometown}</Table.Td>
                <Table.Td>{player.is_staff ? 'Yes' : 'No'}</Table.Td>
                <Table.Td>
                  <Group>
                    <Button
                      onClick={() => {
                        setEditingPlayer(player);
                        setIsModalOpen(true);
                      }}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => {
                        setPlayerToDelete(player);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <EditModal />
    </Container>
  );
}

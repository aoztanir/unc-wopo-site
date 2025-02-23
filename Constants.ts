import {
  AlignLeft,
  Barbell,
  ChartBar,
  ChartLine,
  GameController,
  GearSix,
  Lifebuoy,
  QuestionMark,
} from '@phosphor-icons/react';

export const navbarLinks = [
  {
    label: 'Live Games',
    icon: GameController,
    color: 'var(--mantine-color-red-7)',
    href: '/play',
  },
  {
    label: 'Progress',
    icon: AlignLeft,
    color: 'var(--mantine-color-indigo-7)',
    href: '/play/progress',
  },

  {
    label: 'Practice',
    icon: Barbell,
    color: 'var(--mantine-color-orange-7)',
    href: '/play/practice',
  },

  {
    label: 'Settings',
    icon: GearSix,
    color: 'var(--mantine-color-gray-5)',
    href: '/play/settings',
  },
];

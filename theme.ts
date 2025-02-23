'use client';

import { Badge, Button, Card, createTheme } from '@mantine/core';
import classes from './theme.module.css';

export const theme = createTheme({
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif',
  primaryColor: 'blue',
  defaultRadius: 'md',

  components: {
    Button: Button.extend({
      classNames: classes,
    }),
    Card: Card.extend({
      classNames: {
        root: classes.cardRoot,
      },
      defaultProps: {
        shadow: 'lg',
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: 'sm',
        tt: 'none',
      },
    }),
  },
  /* Put your mantine theme override here */
});

import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {vi} from "vitest";

vi.mock('@/config/config', () => {
  return {
    default: {
      getConfig: vi.fn(key => {
        const mockConfigs = {
          minInputLimit: 1,
          maxInputLimit: 5,
          initialLength: 3,
          matchedInputColor: 'green',
        };
        return mockConfigs[key];
      }),
      getConfigs: vi.fn(() => ({
        minInputLimit: 1,
        maxInputLimit: 5,
        initialLength: 3,
        matchedInputColor: 'green',
      })),
    },
  };
});

const vuetify = createVuetify({
  components,
  directives,
})

config.global.plugins = [vuetify]

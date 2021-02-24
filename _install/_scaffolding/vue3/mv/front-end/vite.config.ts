import { defineConfig } from 'vite';
import * as path from 'path';
import vue from '@vitejs/plugin-vue';

const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '~', replacement: path.resolve(projectRootDir, './') },
      { find: 'Components', replacement: path.resolve(projectRootDir, './_source/_components/') },
      { find: 'CSS', replacement: path.resolve(projectRootDir, './_source/_css/') },
      { find: 'GQL', replacement: path.resolve(projectRootDir, './gql/') },
      { find: 'Layouts', replacement: path.resolve(projectRootDir, './src/layouts/') },
      { find: 'Pages', replacement: path.resolve(projectRootDir, './src/pages/') },
      { find: 'JS', replacement: path.resolve(projectRootDir, './_source/_js/') },
      { find: 'Source', replacement: path.resolve(projectRootDir, './_source/') },
      { find: 'WB', replacement: path.resolve(projectRootDir, './_wb/') },
    ],
  },
});

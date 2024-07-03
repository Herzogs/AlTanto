import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  passWithNoTests:true,
  //setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  reporters: ["jest-console-group-reporter"],
};

export default config;

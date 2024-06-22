// __mocks__/react-router-dom.js
import { createContext } from 'vitest';

export const useParams = createContext({ id: '1' });

import { ws } from '../Pages/Layout/Layout';

export const connectToWS = async (): Promise<WebSocket> => {
  if (!ws) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    connectToWS();
  }

  return ws;
};

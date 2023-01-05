import { AxiosError, AxiosInstance } from 'axios';
import { Socket } from 'socket.io-client';
import { User } from '../models/User';
import api from './api';
import { Api } from './api';

class MMApi {
  private matchMakingSocket?: Socket;
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating matchmaking api class instance');
    this.matchMakingSocket = _client.getMatchMakingSocket();
    this.client = _client.getClient();
  }

  setMatchMakingSocket(instance: Api) {
    this.matchMakingSocket = instance.getMatchMakingSocket();
  }

  async sendGameRequest(user: User, recipient: number) {
    try {
      const response = await this.client.post(
        `/matches/friendly/${recipient}`,
        {
          user: user,
        },
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async updateGameRequest(status: string, user1: User, user2: User) {
    try {
      const response = await this.client.put(`/matches/friendly`, {
        status: status,
        user1: user1,
        user2: user2,
      });
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  findMatch(
    type: 'CLASSIC' | 'TURBO',
    onMatchFound: Function,
    onError?: Function,
  ) {
    // console.log('match type: ' + type);

    const matchFound = 'match-found';
    const error = 'match-error';
    this.matchMakingSocket?.once(matchFound, (matchData) => {
      console.log('match found', matchData);
      this.matchMakingSocket?.removeAllListeners(matchFound);
      this.matchMakingSocket?.removeAllListeners(error);
      onMatchFound(matchData);
    });

    this.matchMakingSocket?.once(error, (matchData) => {
      console.log('match error', matchData);
      this.matchMakingSocket?.removeAllListeners(matchFound);
      this.matchMakingSocket?.removeAllListeners(error);
      onError?.call(matchData);
    });

    this.matchMakingSocket?.emit('enqueue', { type });
  }

  stopFindingMatch() {
    if (this.matchMakingSocket?.connected) {
      console.log('dequeueing user');
      this.matchMakingSocket.emit('dequeue');
    }
  }
}

export default new MMApi(api);

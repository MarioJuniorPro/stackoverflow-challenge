import fp from 'fastify-plugin';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import axios from 'axios';
import { User } from 'src/interfaces';
import { Queue, Worker, Job } from 'bullmq';

const queueName = 'fetcher';
const fetcherQueue = new Queue(queueName);

export interface StackOverflowUsersResponse {
  items: User[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
  backoff?: number;
}

export const getStackOverflowUsers = async ({ page = 1 }: { page?: number }): Promise<StackOverflowUsersResponse> => {
  console.log('getStackOverflowUsers');
  try {
    const endpoint = 'https://api.stackexchange.com/2.2/users';
    const resp = await axios.get(`${endpoint}?site=stackoverflow&page=${page}&pagesize=${100}`);
    return resp.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

export const storeUsers = async (users: User[]): Promise<void> => {
  // Persist
  const brazilians = users.filter((user: User) => user.location && user.location.indexOf('Brazil')); // TODO Check

  console.log({ brazilians: brazilians.length });
};

export const handleFetchUsers = async ({ page, log }: { page: number; log: FastifyLoggerInstance }): Promise<void> => {
  try {
    // Fetch
    const { items, has_more, quota_max, quota_remaining, backoff } = await getStackOverflowUsers({ page });
    const nextPage = has_more ? page + 1 : 1;
    let totalDelay = quota_max === quota_remaining ? 15 * 1000 : 75;
    totalDelay += backoff ? backoff * 1000 : 0;

    // Save
    storeUsers(items);

    // Enqueue next page
    fetcherQueue.add('fetchUsers', { page: nextPage }, { delay: totalDelay });
  } catch (e) {
    log.error(e.message);
    fetcherQueue.add('fetchUsers', { page });
  }
};

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('getStackOverflowUsers', getStackOverflowUsers({}));

  fastify.register(async () => {
    new Worker(queueName, async (job: Job<{ page: number }, { page: number }>) => {
      handleFetchUsers({ page: job.data.page, log: fastify.log });
    });

    await fetcherQueue.add('fetchUsers', { page: 1 });
  });
});

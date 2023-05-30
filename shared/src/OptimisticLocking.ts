import * as retry from 'retry';

export class OptimisticLockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OptimisticLockError';
  }
}

export const optimisticLockRetry = async (workToRetry: () => Promise<void>): Promise<void> => {
  const operation = retry.operation({
    retries: 5,
    factor: 2,
    minTimeout: 1000,
  });
  return new Promise<void>((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        workToRetry();
        resolve();
      } catch (error) {
        console.error(error);
        if ((error instanceof OptimisticLockError) && operation.retry()) {
          return;
        }
        reject(operation.mainError());
      }
    });
  });
}

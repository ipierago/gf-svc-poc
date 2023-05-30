import { BuyItemRequest, BuyItemResponse, CreateUserRequest, CreateUserResponse } from '../../shared/dist/gen/backend'

const BACKEND_URL = "http://localhost:30000";

const addMessage = (message: string) => {
  const messagesDiv = document.querySelector('#messages') as HTMLDivElement;
  var div = document.createElement('div');
  div.innerText = message;
  div.style.whiteSpace = 'nowrap';
  messagesDiv.insertBefore(div, messagesDiv.firstChild);
};

const console_log = (message: string) => {
  console.log(message);
  addMessage(message);
};

const console_error = (message: string) => {
  console.error(message);
  addMessage(message);
};

/*
const getContentText = async (res: Response): Promise<string> => {
  const contentType = res.headers.get('Content-Type');
  const m =
    contentType && contentType.includes('application/json')
      ? JSON.stringify(await res.json())
      : await res.text();
  return m;
};
*/

const fetchPost = async (url: string, data: any = undefined): Promise<any> => {
  try {
    console_log(`POST ${url}, body: ${JSON.stringify(data)}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data === undefined ? '' : JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const json = await res.json();
    return json;
  } catch (e: any) {
    console_error((e as Error)?.message);
    throw e;
  }
};

let lastCreatedUserId = -1;

document.getElementById('buy-item')?.addEventListener('click', async () => {
  console_log('buy-item');
  if (lastCreatedUserId === -1) {
    console_error('create a user first');
  } else {
    const buyItemRequest: BuyItemRequest = { itemId: 42, userId: lastCreatedUserId };
    console_log(JSON.stringify(buyItemRequest));
    const buyItemResponse: BuyItemResponse = await fetchPost(`${BACKEND_URL}/marketplace/buy-item`, buyItemRequest);
    console_log(JSON.stringify(buyItemResponse));
  }
});

document.getElementById('create-user')?.addEventListener('click', async () => {
  console_log('create-user');
  const createUserRequest: CreateUserRequest = { name: 'foobar' };
  console_log(JSON.stringify(createUserRequest));
  const createUserResponse: CreateUserResponse = await fetchPost(`${BACKEND_URL}/user/create`, createUserRequest);
  console_log(JSON.stringify(createUserResponse));
  lastCreatedUserId = createUserResponse.userId;
});

console_log('ready');

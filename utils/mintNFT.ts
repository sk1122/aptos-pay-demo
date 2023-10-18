import {
  AptosClient,
  AptosAccount,
  TokenClient,
  TransactionBuilderRemoteABI,
  FaucetClient,
  BCS,
} from "aptos";

import base58 from "bs58";
import { Address } from "cluster";

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

const tokenClient = new TokenClient(client);

const faucetClient = new FaucetClient(
  "https://fullnode.devnet.aptoslabs.com",
  "https://faucet.devnet.aptoslabs.com"
);

export const createCollection = async () => {
  const alice = new AptosAccount();
  const bob = new AptosAccount();

  await faucetClient.fundAccount(alice.address(), 100_000_000);
  await faucetClient.fundAccount(bob.address(), 100_000_000);
  const txnHash1 = await tokenClient.createCollection(
    alice,
    "FetcchTestCollection",
    "Fetcch Test Collection",
    "https://fetcch.xyz"
  );

  console.log(txnHash1);
};

export const mintNFT = async (account: string, name: string) => {
  const builder = new TransactionBuilderRemoteABI(client, {
    sender: account,
  });
  // const rawTxn = await builder.build(
  //   "0x3::token::create_token_script",
  //   [],
  //   [
  //     "FetcchTestCollection",
  //     "Fetcch",
  //     "Fetcch Test Collection",
  //     1,
  //     10000000,
  //     "https://aptos.dev/img/nyan.jpeg",
  //     account,
  //     0,
  //     0,
  //     [false, false, false, false, false],
  //     [],
  //     [],
  //     [],
  //   ]
  // );
  const rawTxn = await builder.build(
    "0x45cf970c205f5e08c33b7551543f884d8109a7427fcbccce51588302c0baf1b9::create::mint",
    [],
    [account, name]
  );

  const alice = new AptosAccount(Buffer.from(process.env.NEXT_PUBLIC_PRIVATE_KEY!, "hex"));
console.log(account, name, alice.address().toString())
  const transactionHash = await client.signAndSubmitTransaction(alice, rawTxn)

  return transactionHash
};

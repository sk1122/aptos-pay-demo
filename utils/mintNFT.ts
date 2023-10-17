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
  const alice = new AptosAccount(
    Buffer.from(
      "e74d9065a06ce98e1276ce52cbabb0eef8ea0984e285c1bfa9d8049acdf01b5e",
      "hex"
    )
  );
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

export const mintNFT = async (account: string) => {
  const builder = new TransactionBuilderRemoteABI(client, {
    sender: account,
  });
  const rawTxn = await builder.build(
    "0x3::token::create_token_script",
    [],
    [
      "FetcchTestCollection",
      "Fetcch",
      "Fetcch Test Collection",
      1,
      10000000,
      "https://aptos.dev/img/nyan.jpeg",
      account,
      0,
      0,
      [false, false, false, false, false],
      [],
      [],
      [],
    ]
  );
  const serializer = new BCS.Serializer();
  rawTxn.serialize(serializer);

  return base58.encode(serializer.getBytes());
};

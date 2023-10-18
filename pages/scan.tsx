import {
  decodeTransaction,
  generateTransferTransaction,
  parseUrl,
  TransferURI,
} from "@fetcch/aptos-pay";
import { BCS, TxnBuilderTypes } from "aptos";
import base58 from "bs58";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [parsed, setParsed] = useState<TransferURI>();
  const [address, setAddress] = useState<any>(undefined);

  useEffect(() => {
    if (url) {
      console.log(url);
      const parsed = parseUrl(url);

      setParsed(parsed);
    }
  }, [url]);

  const connectAptos = async () => {
    const w = window as any;

    await w.aptos.connect();

    const account = await w.aptos.getAccount();

    setAddress(account);
  };

  const pay = async () => {
    const p = parsed as any;
    const w = window as any;

    if (p.transaction) {
      const transaction = JSON.parse(Buffer.from(base58.decode(p.transaction)).toString())
      console.log(transaction)

      await w.aptos.signAndSubmitTransaction(transaction);
    } else if (p.token && p.amount) {
      const transaction = generateTransferTransaction(
        p.receiver,
        p.token,
        p.amount
      );

      await w.aptos.signAndSubmitTransaction(transaction);
    } else if (p.data && p.nonce) {
      const message = {
        message: p.data,
        nonce: p.nonce
      }

      const signature = await w.aptos.signMessage(message)

      alert(JSON.stringify(signature))
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center space-y-10 p-24 ${inter.className}`}
    >
      <QrReader
        containerStyle={{ width: "50%", height: "50%" }}
        onResult={(result, error) => {
          if (!!result) {
            setUrl(result.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
        // open the front camera
        constraints={{ facingMode: "environment" }}
      />
      {parsed && <p>Parsed Data - {JSON.stringify(parsed)}</p>}

      {!address && (
        <div
          className="cursor-pointer border p-3 rounded-xl"
          onClick={() => connectAptos()}
        >
          Connect Petra
        </div>
      )}
      {address && <p>Address - {address.address}</p>}

      {address && url && (
        <div
          className="cursor-pointer border p-3 rounded-xl"
          onClick={() => pay()}
        >
          Pay
        </div>
      )}
    </main>
  );
}

import { mintNFT } from "@/utils/mintNFT";
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
import QrReader from "react-qr-reader";
import nacl from "tweetnacl"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [parsed, setParsed] = useState<any>();
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

  console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)

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

      if(nacl.sign.detached.verify(Buffer.from(signature.fullMessage), Buffer.from(signature.signature, "hex"), Buffer.from(address.publicKey.slice(2), "hex"))) {
        const tx = await mintNFT(p.receiver, p.data)

        alert(`Your NFT is minted at -> ${tx}`)
      }
    }
  };

  let handleScan = (data: any) => {
    if (data) {
      setUrl(data);
    }
  };

  let handleError = (err: any) => {
    alert(err);
  };

  return (
    <main
      className={`flex min-h-screen items-center justify-center space-x-10 p-24 ${inter.className}`}
    >
      <div className="w-full h-full flex justify-center items-center">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
          facingMode="environment"
        />
      </div>
      <div className="w-full h-full flex justify-start flex-col items-center space-y-10">
        {parsed && 
          <div className="space-y-3 flex justify-center items-start flex-col">
            <h1 className="text-3xl font-bold">Aptos Pay Request</h1>
            <div>
              <p>Receiver - {parsed.receiver}</p>
              <p>Message - {parsed.message}</p>
              <p>Label - {parsed.label}</p>

              {parsed.transaction && <p>Transaction - {parsed.transaction}</p>}

              {parsed.token && <p>Token - {parsed.token}</p>}
              {parsed.amount && <p>Amount - {parsed.amount}</p>}

              {parsed.data && <p>Sign Data - {parsed.data}</p>}
              {parsed.nonce && <p>Nonce - {parsed.nonce}</p>}

              {address && <p>Address - {address.address}</p>}
            </div>
          </div>
        }

        <div className="flex justify-center items-center flex-col space-y-5">
          {!address && (
            <div
              className="cursor-pointer border p-3 rounded-xl hover:bg-white hover:text-black"
              onClick={() => connectAptos()}
            >
              Connect Petra
            </div>
          )}

          {address && url && (
            <div
              className="cursor-pointer border p-3 rounded-xl hover:bg-white hover:text-black"
              onClick={() => pay()}
            >
              Execute
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

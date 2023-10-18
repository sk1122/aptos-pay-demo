import { generateUrl, TransferURI } from "@fetcch/aptos-pay";
import { Inter } from "next/font/google";
import { useState } from "react";
import { mintNFT } from "../utils/mintNFT";
import QRCode from "qrcode";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const args: TransferURI = {
    receiver:
      "0x2d91309b5b07a8be428ccd75d0443e81542ffcd059d0ab380cefc552229b1a",
    chain_id: 1,
    data: "",
    nonce: 1,
    message: "MESSAGE",
    label: "LABEL",
  };

  const [receiver, setReceiver] = useState("");
  const [name, setName] = useState("");

  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const generate = async () => {
    const mintData = await mintNFT(receiver, name);
    const url = generateUrl({
      ...args,
      receiver,
      data: "Mint a NFT from Collection",
      nonce: 1
    });
    setUrl(url);
    setImage(await generateQrCode(url));
  };

  const generateQrCode = async (url: string) => {
    const qrCode = await QRCode.toDataURL(url);

    return qrCode;
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center space-y-10 p-24 ${inter.className}`}
    >
      <div className="w-full text-black flex justify-center items-center space-x-3">
        <input
          name="token"
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Enter token address"
          className="p-3 border rounded-xl"
        />
        <input
          name="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter token name"
          className="p-3 border rounded-xl"
        />
      </div>
      {url && <p>{url}</p>}
      {image && <img src={image} />}
      <div
        className="cursor-pointer border p-3 rounded-xl"
        onClick={() => generate()}
      >
        Generate URL
      </div>
    </main>
  );
}

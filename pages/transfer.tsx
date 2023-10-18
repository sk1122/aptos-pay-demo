import { generateUrl, TransferURI } from "@fetcch/aptos-pay";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import QRCodeStyling, { Options as QRCodeStylingOptions, FileExtension } from "qr-code-styling";

const inter = Inter({ subsets: ["latin"] });

const styles = {
  inputWrapper: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputBox: {
    flexGrow: 1,
    marginRight: 20,
  },
}

const qrOptions: QRCodeStylingOptions = {
  width: 300,
  height: 300,
  image: "https://aptos-pay-demo.vercel.app/aptos.svg",
  dotsOptions: {
    color: "#4267b2",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 0,
  },
}

const useQRCodeStyling = (options: QRCodeStylingOptions): QRCodeStyling | null => {
  //Only do this on the client
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const QRCodeStylingLib = require('qr-code-styling')
    const qrCodeStyling: QRCodeStyling = new QRCodeStylingLib(options)
    return qrCodeStyling
  }
  return null
}


export default function Home() {
  const args: TransferURI = {
    receiver:
      "0x2d91309b5b07a8be428ccd75d0443e81542ffcd059d0ab380cefc552229b1a",
    chain_id: 1,
    amount: "100",
    token: "0x1::aptos_coin::AptosCoin",
    message: "MESSAGE",
    label: "LABEL",
  };

  const [receiver, setReceiver] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<any>();
  
  const qrCode = useQRCodeStyling(qrOptions)
  const ref = useRef(null);

  const generate = async () => {
    const url = generateUrl({
      ...args,
      receiver,
      token,
      amount,
    });
    setUrl(url);
    // setImage(await generateQrCode(url));
  };

  useEffect(() => {
    qrCode?.append(ref.current!)
  }, [qrCode])

  useEffect(() => {
    qrCode?.update({
      data: url
    })
  }, [url])

  return (
    <main
      className={`flex min-h-screen flex-col items-start justify-start space-y-10 p-24 ${inter.className}`}
    >
      <div className="w-full flex justify-start items-start flex-col space-y-5">
        <h1 className="text-5xl font-bold">Transfer - Aptos Pay Demo</h1>
        <p className="flex">
          Powered by{" "}
          <img src="/logo.svg" className="w-20	h-20 -translate-y-1/3" />
        </p>
      </div>

      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full h-full flex justify-start items-start flex-col space-y-10">
          <div className="w-1/2 text-black flex justify-start items-start space-y-3 flex-col">
            <p className="text-white">Receiver Address</p>
            <input
              name="receiver"
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Enter receiver address"
              className="w-full p-3 border rounded-xl"
            />
            <p className="text-white">Amount (in lowest denominator)</p>
            <input
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border rounded-xl"
            />
            <p className="text-white">Token address</p>
            <input
              name="token"
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter token address"
              className="w-full p-3 border rounded-xl"
            />
          </div>
          <div
            className="cursor-pointer border p-3 rounded-xl hover:bg-white hover:text-black"
            onClick={() => generate()}
          >
            Generate URL
          </div>
        </div>

        <div className="w-full h-full flex justify-start items-center flex-col space-y-4">
          <p>{url}</p>
          <div ref={ref}></div>
        </div>
      </div>
    </main>
  );
}

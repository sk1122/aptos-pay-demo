import { generateUrl, TransferURI } from "@fetcch/aptos-pay"
import { Inter } from 'next/font/google'
import { useState } from "react"
import QRCode from "qrcode"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const args: TransferURI = {
    receiver: "0x2d91309b5b07a8be428ccd75d0443e81542ffcd059d0ab380cefc552229b1a",
    chain_id: 1,
    amount: "100",
    token: "0x1::aptos_coin::AptosCoin",
    message: "MESSAGE",
    label: "LABEL"
  }

  const [receiver, setReceiver] = useState("")
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")
  const [url, setUrl] = useState("")
  const [image, setImage] = useState("")

  const generate = async () => {
    const url = generateUrl({
      ...args,
      receiver,
      token,
      amount
    })
    setUrl(url)
    setImage(await generateQrCode(url))
  }
  
  const generateQrCode = async (url: string) => {
    const qrCode = await QRCode.toDataURL(url)

    return qrCode
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center space-y-10 p-24 ${inter.className}`}
    >
      <div className="w-full text-black flex justify-center items-center space-x-3">
        <input name="receiver" onChange={(e) => setReceiver(e.target.value)} placeholder="Enter receiver address" className="p-3 border rounded-xl" />
        <input name="amount" onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="p-3 border rounded-xl" />
        <input name="token" onChange={(e) => setToken(e.target.value)} placeholder="Enter token address" className="p-3 border rounded-xl" />
      </div>
      {url && <p>{url}</p>}
      {image && <img src={image} />}
      <div className="cursor-pointer border p-3 rounded-xl" onClick={() => generate()}>Generate URL</div>
    </main>
  )
}

import { generateUrl, TransferURI } from "@fetcch/aptos-pay";
import { Inter } from "next/font/google";
import { useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-start justify-start space-y-10 p-24 ${inter.className}`}
    >
      <div className="w-full flex justify-start items-start flex-col space-y-5">
        <h1 className="text-5xl font-bold">Aptos Pay Demo</h1>
        <p className="flex">
          Powered by{" "}
          <img src="/logo.svg" className="w-20	h-20 -translate-y-1/3" />
        </p>
      </div>

			<div className="w-full flex justify-start items-start flex-col space-y-5 pb-10">
				<p className="text-2xl font-bold">
					Aptos Pay will be the first open, free-to-use payments and connectivity
					framework built on Aptos.
				</p>
				<ul className="list-disc translate-x-5">
					<li>
						A standard protocol to encode any Aptos transaction requests within
						URLs to enable payments and other usecases.
					</li>

					<li>This standard draws inspiration from BIP21, EIP681, SolanaPay.</li>

					<li>
						These URLs may be encoded in QR codes or NFC tags, or sent between
						users and applications to request payment and compose transactions.
						Helping create easiest user experience for move based mobile wallets
						and applications.
					</li>
					<li>
						By standardizing a simple approach to solving these problems, It aims
						to ensure basic compatibility of applications and wallets so
						developers can focus on higher level abstractions.
					</li>
				</ul>
			</div>

			<div className="w-full flex justify-start items-start flex-col space-y-5">
				<h1 className="text-2xl font-bold">Demos</h1>
				<div className="w-full h-full flex justify-start items-center space-x-4">
					<Link href="/transfer" className="px-5 py-3 border text-center rounded-xl hover:bg-white hover:text-black cursor-pointer duration-300">
						Transfer
					</Link>

					<Link href="/mint-nft" className="px-5 py-3 border text-center rounded-xl hover:bg-white hover:text-black cursor-pointer duration-300">
						Mint NFT (Gasless)
					</Link>

					<Link href="/scan" className="px-5 py-3 border text-center rounded-xl hover:bg-white hover:text-black cursor-pointer duration-300">
						Scan
					</Link>
				</div>
			</div>
    </main>
  );
}

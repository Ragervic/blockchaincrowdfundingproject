import react from "react";
import reactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import App from "./App"; 

import { StateContextProvider } from "./context"


import "./index.css"
import { defineChain } from "thirdweb";


// Creating the root of the project
const root = reactDOM.createRoot(document.getElementById("root"));

// customizing own chain
const sepolia = {
  chainId: 11155111, // Sepolia Chain ID
  rpc: ["https://11155111.rpc.thirdweb.com"], // Add your RPC URL
  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  shortName: "sepolia",
  slug: "sepolia",
  testnet: true,
};

// Wrapper for the entire application
root.render(
  <ThirdwebProvider activeChain={sepolia}>
    <Router>
      <StateContextProvider>
        <App />
        </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);

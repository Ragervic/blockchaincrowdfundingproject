import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
// const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
const clientId = process.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: clientId,
  secretKey:
    "Jo5AihVKMUcgifPikLGz3eLecEHjXNBA_zUBDe6Arv0sM-BLiz8tkOk6_oWJbZyEiWNxrwMsdmZu88MCxrSiaQ",
});
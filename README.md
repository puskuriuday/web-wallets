# UD Wallets (LocalStorage First Demo)

UD Wallets is a lightweight multi-chain (Ethereum + Solana) demo wallet built with React + TypeScript + Vite. It treats the browser's `localStorage` as a user-specific database: all sensitive artifacts (mnemonic, wallets, transactions, password flag) are stored locally and never sent to a server.

> IMPORTANT: This is a learning/demo project. Plaintext storage of mnemonics, private keys, and passwords in `localStorage` is **not secure**. For production you must add encryption, secure secret handling, and ideally hardware or browser extension isolation.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS for styling
- `ethers` for Ethereum HD wallet derivation
- `@solana/web3.js` + temporary derivation logic (replace with SLIP-0010 compliant Ed25519 derivation for real use)
- `bip39` for mnemonic generation
- `tweetnacl` for Ed25519 keypair creation (Solana)

## LocalStorage Data Model

The app uses the following keys. All values (except simple flags) are JSON strings.

| Key | Description |
|-----|-------------|
| `mnemonic` | User's BIP-39 12-word mnemonic (plain text). |
| `mnemonicAcknowledged` | `'true'` when user has viewed/acknowledged mnemonic. |
| `Password` | User password (plain text demo). |
| `isLoggedIn` | Login status flag set by helper. |
| `ethereumWallets` | Array of Ethereum wallet objects `{ publicKey, privateKey, chain, index }`. |
| `solanaWallets` | Array of Solana wallet objects `{ publicKey, privateKey, chain, index }`. |
| `ethereumNextIndex` | Next derivation index integer for Ethereum HD path. |
| `solanaNextIndex` | Next derivation index integer for Solana pseudo-derivation. |
| `ethereumTransactions` | Array of transaction objects for Ethereum. |
| `solanaTransactions` | Array of transaction objects for Solana. |

### Transaction Object Shape
```ts
interface Transaction {
  hash: string;        // pseudo / generated hash
  amount: string;      // decimal string
  from: string;        // sender address
  to: string;          // recipient address
  status: 'success' | 'fail' | 'pending';
  time: number;        // epoch ms
}
```

### Wallet Object Shapes
```ts
interface ethereumWalletInfo {
  publicKey: string;   // EVM address
  privateKey: string;  // hex private key
  chain: 'Ethereum';
  index: number;       // derivation index
}

interface solanaWalletInfo {
  publicKey: string;   // base58 public key
  privateKey: string;  // hex serialized secretKey
  chain: 'Solana';
  index: number;
}
```

## Auto-Increment Derivation

Each new wallet uses the stored `ethereumNextIndex` or `solanaNextIndex`. If absent, the app scans existing wallets and sets next = (max index + 1) starting at 0.

## Mnemonic Lifecycle

1. On first load (no `mnemonic` key) the app generates and stores a mnemonic.
2. `mnemonicAcknowledged` set to `'false'` so mnemonic reveal modal appears after unlock.
3. After the user confirms, the flag switches to `'true'` (preventing repeat exposure).

## Sending Transactions (Demo)

The Send form produces a synthetic transaction stored in `ethereumTransactions` or `solanaTransactions`. Real network broadcasting is not implemented.

## Security Caveats

Plaintext secrets in `localStorage` are vulnerable to:
- XSS (script can read keys)
- Browser profile copying
- Lack of encryption at rest

Hardening suggestions:
1. Encrypt sensitive values with a key derived from the password (e.g. PBKDF2 + AES-GCM).
2. Use a browser extension context (Manifest V3) to isolate secrets.
3. Never keep raw private keys in render state; derive short-lived session objects.
4. Add a logout timeout & clear decrypted material from memory.

## Development

Install dependencies and start dev server:
```powershell
npm install
npm run dev
```

## Future Improvements

- Replace Solana pseudo-derivation with proper SLIP-0010 Ed25519 path (e.g. `noble-ed25519` + hardened chain codes)
- Real RPC integration for balances & transaction statuses
- Encrypted storage wrapper
- Unit tests for index progression & transaction persistence

## License

Demo code – adapt freely. Verify third-party dependencies licenses separately.

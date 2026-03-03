# Bitespeed Identity Reconciliation

## Hosted Endpoint
POST https://bitespeed-identity-o7wy.onrender.com/identify

## Request Format
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}

## Example Response
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["doc@flux.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}

## Tech Stack
- Node.js
- TypeScript
- PostgreSQL (Neon)
- Express
- Hosted on Render(https://bitespeed-identity-o7wy.onrender.com)

# FlowIQ — Service Setup Guide

Follow these steps to configure all required services before deploying.

---

## 1. Anthropic API (Claude LLM)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and verify your email
3. Navigate to **API Keys** → **Create Key**
4. Copy the key → set as `ANTHROPIC_API_KEY`

---

## 2. Airtable (CRM Database)

1. Go to [airtable.com](https://airtable.com) → Create a free account
2. Create a new **Base** named "FlowIQ CRM"
3. Create a table named **Leads** with these fields:

| Field Name | Type |
|---|---|
| Session ID | Single line text |
| Approval Token | Single line text |
| Company Name | Single line text |
| Industry | Single select |
| Company Size | Single select |
| Contact Name | Single line text |
| Contact Email | Email |
| Website | URL |
| Operations Description | Long text |
| Pain Points Summary | Long text |
| Suggested AI Workflows | Long text |
| Tools Needed | Long text |
| Best Practices | Long text |
| Est. Time Savings (hrs/wk) | Number |
| Est. Cost Reduction | Single line text |
| ROI Timeline (months) | Number |
| Approval Status | Single select (options: Pending, Approved, Sent) |
| Follow-up Sent At | Date |
| PDF Downloaded | Checkbox |
| Email Sent | Checkbox |
| Budget Range | Single line text |
| Timeline | Single line text |
| Created At | Date |

4. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens) → Create a Personal Access Token
   - Scope: `data.records:read`, `data.records:write`
   - Access: your FlowIQ CRM base
5. Copy the token → set as `AIRTABLE_API_KEY`
6. Copy the Base ID from the URL (starts with `app...`) → set as `AIRTABLE_BASE_ID`

---

## 3. Resend (Email)

1. Go to [resend.com](https://resend.com) → Create a free account
2. Add and verify your domain (or use sandbox for testing)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key → set as `RESEND_API_KEY`
5. Set `RESEND_FROM_EMAIL` to your verified sender address (e.g. `noreply@yourdomain.com`)
6. Set `OWNER_EMAIL` to your personal email (where you'll receive notifications)
7. Set `OWNER_NAME` to your name or business name

---

## 4. Stripe (Payments)

1. Go to [stripe.com](https://stripe.com) → Create an account
2. In the Dashboard, go to **Products** → **Add Product**
   - Product 1: "PDF Report Download" — one-time price: $9.99
   - Product 2: "Email Report Delivery" — one-time price: $4.99
3. Copy each Price ID (starts with `price_...`) → set as `STRIPE_PDF_PRICE_ID` and `STRIPE_EMAIL_PRICE_ID`
4. Go to **Developers** → **API Keys**
   - Copy the Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy the Secret Key → `STRIPE_SECRET_KEY`
5. After deployment, set up the webhook:
   - Go to **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://yourdomain.com/api/payment/webhook`
   - Events: `checkout.session.completed`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

For local testing, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

---

## 5. Cloudflare (Deployment)

The D1 database is already created:
- Database name: `workflow-analyzer`
- Database ID: `eab21ec6-0c35-474a-a5ed-c463a2d10f8f`

For deployment:
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages**
2. Connect your GitHub repository
3. Build settings:
   - Framework: Next.js
   - Build command: `npx @cloudflare/next-on-pages`
   - Output directory: `.vercel/output/static`
4. Add all environment variables in **Settings → Environment Variables**

For the Cloudflare API token (needed for local D1 access):
1. Go to **My Profile** → **API Tokens** → **Create Token**
2. Use the "Edit Cloudflare Workers" template
3. Copy the token → set as `CLOUDFLARE_API_TOKEN`
4. Set `CLOUDFLARE_ACCOUNT_ID=92a6621ea9e2ba0f4f1335f6bcdd2bb4`
5. Set `CLOUDFLARE_D1_DATABASE_ID=eab21ec6-0c35-474a-a5ed-c463a2d10f8f`

---

## 6. Environment Variables (.env.local)

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Then fill in each variable following the steps above.

---

## 7. Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

For local D1, the app falls back to the Cloudflare REST API using your `CLOUDFLARE_API_TOKEN`.

---

## 8. Admin Dashboard

Go to `/admin` — enter your `ADMIN_PASSWORD` to access the dashboard where you can:
- Review all analyses
- Edit the follow-up message before sending
- Approve and send follow-ups to clients

---

## 9. Approval Flow

When a client submits their analysis:
1. You receive an email with the full summary + proposal draft + follow-up message
2. Click **"Approve & Send Follow-Up"** in the email — this instantly sends the follow-up to the client
3. Or go to `/admin` to edit the message first, then approve

The client receives a personalised email with a link to their full analysis report.

---

## 10. PayPal (Global payments — 200+ countries)

1. Go to [developer.paypal.com](https://developer.paypal.com) → Log in or create a Business account
2. Navigate to **Dashboard** → **Apps & Credentials**
3. Click **Create App** (choose "Merchant" type)
4. Copy the **Client ID** → set as `PAYPAL_CLIENT_ID`
5. Copy the **Secret** → set as `PAYPAL_CLIENT_SECRET`
6. For testing: leave `PAYPAL_ENV=sandbox` and use PayPal's sandbox accounts
7. For live: change to `PAYPAL_ENV=production` and use your live credentials

PayPal supports USD payments from customers in 200+ countries including:
South Africa, Nigeria, Kenya, Ghana, Egypt, Uganda, Tanzania, and more.

---

## 11. PayNow Zimbabwe (EcoCash, OneMoney, TeleCash, Web Pay)

PayNow is Zimbabwe's leading payment gateway supporting:
- **EcoCash** — Econet mobile money
- **OneMoney** — NetOne mobile money
- **TeleCash** — Telecel mobile money
- **Web Pay** — Visa/Mastercard via PayNow's hosted page

### Setup Steps

1. Go to [developers.paynow.co.zw](https://developers.paynow.co.zw) or [paynow.co.zw](https://www.paynow.co.zw)
2. Register for a merchant/business account
3. Verify your business
4. Navigate to **Integrations** → **Create Integration**
5. Set your **Result URL** (webhook) to: `https://yourdomain.com/api/payment/paynow/result`
6. Set your **Return URL** to: `https://yourdomain.com/payment/success`
7. Copy the **Integration ID** → set as `PAYNOW_INTEGRATION_ID`
8. Copy the **Integration Key** → set as `PAYNOW_INTEGRATION_KEY`

### Testing PayNow

PayNow provides a test environment. Use these test details:
- Integration ID: `XXXXX` (from your developer dashboard)
- Integration Key: `XXXXX`
- Test EcoCash number: Use any valid Zimbabwean number format (+263 7X XXX XXXX)

### Supported Currencies

PayNow processes in **USD** and **ZWL** (Zimbabwean Dollar). The app sends USD amounts.

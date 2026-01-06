# AIDE Platform - Simple Setup Guide

This guide explains exactly what you need to deploy the AIDE platform.

## What You Need (3 Things)

### 1. Database Connection String

**What it is:** Where your application stores data (projects, files, build history, etc.)

**How to get it:**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click on your project "Manus web"
3. Go to **Settings** → **Database**
4. Look for "Connection string" or "URI"
5. Copy the MySQL connection string

**It will look like:**
```
postgresql://postgres.ihmffkvpjuodgeqiibfd:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Or for MySQL:**
```
mysql://postgres:password@ihmffkvpjuodgeqiibfd.supabase.co:3306/postgres
```

**Set as:** `DATABASE_URL`

---

### 2. JWT Secret (Random Security Key)

**What it is:** A random key that keeps users logged in securely.

**How to generate it:**

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 127)}) -join ''))
```

**Or just use a random string:**
```
MySecretKey12345MySecretKey12345MySecretKey123
```

**Set as:** `JWT_SECRET`

---

### 3. Google Gemini API Key

**You already have this!** ✅

It's the key you provided earlier:
```
AIzaSyA9RqUdhImXtO5iWoLl17z3TDQRXh988QU
```

**Set as:** `GOOGLE_API_KEY`

---

## Deploy to Vercel (5 Minutes)

### Step 1: Go to Vercel
https://vercel.com/dashboard

### Step 2: Add New Project
Click **"Add New"** → **"Project"**

### Step 3: Import GitHub Repository
Search for: `aide-platform`

Select: `LilpatrickFf/aide-platform`

Click **"Import"**

### Step 4: Add Environment Variables

In the "Environment Variables" section, add these 3 variables:

| Variable Name | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | Your generated random key |
| `GOOGLE_API_KEY` | `AIzaSyA9RqUdhImXtO5iWoLl17z3TDQRXh988QU` |

### Step 5: Deploy
Click **"Deploy"**

Vercel will:
- Build your application
- Run tests
- Deploy to a live URL
- Give you a URL like: `https://aide-platform-xxxxx.vercel.app`

**That's it! Your AIDE platform is live!**

---

## Optional: Add Hugging Face Token Later

When you have a Hugging Face API token, you can add it to Vercel:

1. Go to Vercel dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add: `HUGGING_FACE_API_KEY` = your token

This will enable the DeepSeek Coder agent for code generation.

---

## Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Make sure Supabase is running
- Verify the password in the connection string

### "JWT_SECRET is required"
- Generate a new random key
- Add it to Vercel environment variables
- Redeploy

### "Google API key invalid"
- Double-check the key is correct
- Make sure it's enabled in Google Cloud Console

---

## What Happens After Deployment

Once deployed, your AIDE platform will:

1. **Accept user logins** via Manus OAuth
2. **Store projects** in your Supabase database
3. **Run AI agents** to help build applications
4. **Generate code** using Google Gemini Pro
5. **Store memories** of lessons learned

All powered by the multi-agent system you built!

---

## Questions?

If you get stuck:
1. Check the error message in Vercel logs
2. Verify all environment variables are set correctly
3. Make sure your Supabase database is accessible
4. Check that API keys are valid

You've got this! 🚀

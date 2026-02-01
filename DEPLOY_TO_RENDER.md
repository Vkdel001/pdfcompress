# Deploy PDF Compressor to Render (Free)

## 🎯 Why Render?

- ✅ Completely FREE (no credit card required)
- ✅ Easy setup (5 minutes)
- ✅ Automatic deployments from GitHub
- ✅ Free SSL certificate
- ✅ 750 hours/month free

**Only limitation:** App sleeps after 15 minutes of inactivity (wakes up in ~30 seconds on first request)

---

## 📋 Prerequisites

1. GitHub account (free)
2. Render account (free - sign up at render.com)
3. Your iLovePDF API keys

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code

First, make sure your code is ready for deployment.

**Create a `.gitignore` file** (already done):
```
node_modules/
.env
*.pdf
uploads/
compressed/
```

**Verify `package.json`** has the correct start script (already done):
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

### Step 2: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to github.com
   - Click "New repository"
   - Name it: `pdf-compressor`
   - Make it Public or Private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - PDF Compressor"
   
   # Add remote (replace with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/pdf-compressor.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your repositories

---

### Step 4: Create Web Service

1. **Click "New +"** in the top right
2. Select **"Web Service"**
3. **Connect your repository:**
   - Find `pdf-compressor` in the list
   - Click **"Connect"**

4. **Configure the service:**
   ```
   Name: pdf-compressor (or any name you like)
   Region: Choose closest to you
   Branch: main
   Root Directory: (leave blank)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Select Free plan:**
   - Instance Type: **Free**
   - Click **"Advanced"** to add environment variables

---

### Step 5: Add Environment Variables

In the "Advanced" section:

1. Click **"Add Environment Variable"**
2. Add your API keys:
   ```
   Key: PUBLIC_KEY
   Value: your_actual_public_key_here
   
   Key: SECRET_KEY
   Value: your_actual_secret_key_here
   ```

3. **Important:** Don't include quotes around the values

---

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render will start building your app
3. Wait 2-3 minutes for deployment
4. You'll see logs in real-time

**Look for:**
```
🚀 PDF Compressor server running on http://localhost:3000
📁 Upload limit: 1GB
🔑 API configured: Yes
```

---

### Step 7: Access Your App

Once deployed, Render gives you a URL like:
```
https://pdf-compressor-xxxx.onrender.com
```

**Click the URL** and your app is live! 🎉

---

## 🔄 Automatic Deployments

Every time you push to GitHub, Render automatically redeploys:

```bash
# Make changes to your code
git add .
git commit -m "Updated styling"
git push

# Render automatically detects and redeploys!
```

---

## ⚠️ Important Notes

### File Storage
Render's free tier has **ephemeral storage**, meaning:
- Uploaded files are temporary
- Files are deleted when app restarts
- This is PERFECT for your app (you clean up files anyway)

### Sleep Mode
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Subsequent requests are instant

**To keep it awake** (optional):
Use a service like UptimeRobot to ping your app every 5 minutes:
1. Go to uptimerobot.com (free)
2. Add monitor: `https://your-app.onrender.com/api/health`
3. Check interval: 5 minutes

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `npm install` fails
**Solution:** Make sure `package.json` is in the root directory

### App Crashes
**Error:** App starts but crashes immediately
**Solution:** Check environment variables are set correctly

### API Errors
**Error:** Compression fails
**Solution:** Verify PUBLIC_KEY and SECRET_KEY are correct

### Port Issues
**Error:** Port already in use
**Solution:** Render automatically sets PORT environment variable, no changes needed

---

## 📊 Monitor Your App

### View Logs
1. Go to your service dashboard on Render
2. Click **"Logs"** tab
3. See real-time logs

### Check Health
Visit: `https://your-app.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "PDF Compressor API is running"
}
```

---

## 💰 Cost Breakdown

**Render Free Tier:**
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 100GB bandwidth/month
- ✅ Free SSL certificate
- ✅ Automatic deployments

**Total Cost:** $0/month 🎉

---

## 🔒 Security Best Practices

### 1. Keep API Keys Secret
- ✅ Never commit `.env` to GitHub
- ✅ Use Render's environment variables
- ✅ Rotate keys periodically

### 2. Monitor Usage
- Check Render dashboard for traffic
- Monitor iLovePDF API usage
- Set up alerts if needed

### 3. Rate Limiting (Optional)
Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🎨 Custom Domain (Optional)

Want to use your own domain?

1. **Buy a domain** (Namecheap, Google Domains, etc.)
2. **In Render dashboard:**
   - Go to your service
   - Click "Settings"
   - Scroll to "Custom Domain"
   - Add your domain
3. **Update DNS records** as instructed by Render
4. Wait for SSL certificate (automatic)

---

## 📈 Upgrade Options

If you need more:

**Render Starter Plan ($7/month):**
- No sleep
- More RAM (512MB → 2GB)
- More CPU
- Priority support

**When to upgrade:**
- High traffic (>100 users/day)
- Need instant response (no sleep)
- Processing large files frequently

---

## 🔄 Alternative: Deploy to Railway

If Render doesn't work for you, try Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Set environment variables
railway variables set PUBLIC_KEY=your_key
railway variables set SECRET_KEY=your_secret

# Deploy
railway up
```

Railway gives you $5/month free credit (usually enough for light use).

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `.env` file NOT in GitHub (check .gitignore)
- [ ] `package.json` has correct start script
- [ ] API keys ready to add to Render
- [ ] Tested locally one more time

After deploying:
- [ ] App builds successfully
- [ ] Can access the URL
- [ ] Can upload a PDF
- [ ] Compression works
- [ ] Download works
- [ ] Health check returns OK

---

## 🎉 Success!

Once deployed, share your app:
```
https://your-app-name.onrender.com
```

**Your PDF Compressor is now live and accessible to anyone!** 🚀

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Your Logs:** Check Render dashboard → Logs tab

---

## 🎊 Congratulations!

You've successfully deployed your PDF Compressor to the cloud for FREE!

**What you achieved:**
- ✅ Built a web application
- ✅ Deployed to production
- ✅ Made it accessible worldwide
- ✅ All for $0/month

**Now go compress some PDFs!** 📄➡️📦

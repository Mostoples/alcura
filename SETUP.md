# Firebase Setup Guide - Alcura Project

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Check setup
node scripts/check-setup.js

# 3. Deploy to Firebase (Windows PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\firebase-config.json"
npx firebase-tools deploy

# Or (Linux/Mac)
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-config.json"
npx firebase-tools deploy
```

## Environment Setup (No gcloud required)

### Prerequisites
- **Node.js 16+** (check: `node --version`)
- **npm** (check: `npm --version`)
- **Git** (check: `git --version`)
- Service account JSON (already in `firebase-config.json`)

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- `firebase` - Web SDK
- `firebase-admin` - Server SDK  
- `firebase-tools` - Deployment CLI

### Step 2: Verify Setup
```bash
# Check all required files exist
node scripts/check-setup.js

# Should output:
# ✓ firebase-config.json
# ✓ .firebaserc
# ✓ firebase.json
# ✓ public directory
# ✓ package.json
```

### Step 3: Deploy to Firebase

#### Option A: Windows PowerShell
```powershell
# Set environment variable
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\firebase-config.json"

# Deploy everything
npx firebase-tools deploy

# Or deploy specific targets
npx firebase-tools deploy --only hosting
npx firebase-tools deploy --only database
```

#### Option B: Linux/Mac Shell
```bash
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-config.json"

# Deploy
npx firebase-tools deploy
```

#### Option C: Using npm scripts
```bash
# For manual CLI deployment
npm run deploy:cli

# Test locally first
npm run serve
```

### Step 4: Local Testing
```bash
# Start local emulator
npx firebase-tools serve

# Visit http://localhost:5000
```

## File Structure

```
alcura/
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project reference
├── firebase-config.json   # Service account credentials ⚠️ SECRET
├── public/                # Hosting files
│   └── index.html
├── scripts/
│   ├── deploy.js         # Deployment helper
│   └── check-setup.js    # Setup validator
├── package.json          # Node dependencies
└── database.rules.json   # Realtime Database rules
```

## GitHub Integration

Repository: https://github.com/Mostoples/alcura.git

### Clone from GitHub
```bash
git clone https://github.com/Mostoples/alcura.git
cd alcura
```

### Push Changes
```bash
# Stage changes
git add .

# Commit
git commit -m "describe your changes"

# Push to GitHub
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

### Check Remote
```bash
git remote -v
# Should show:
# origin  https://github.com/Mostoples/alcura.git (fetch)
# origin  https://github.com/Mostoples/alcura.git (push)
```

## Account & Project Details

### Firebase
- **Project ID**: alcura-id
- **Email**: mersif.storage1@gmail.com
- **Database URL**: https://alcura-id-default-rtdb.firebaseio.com
- **Hosting URL**: https://alcura-id.web.app
- **Service Account**: firebase-adminsdk-fbsvc@alcura-id.iam.gserviceaccount.com

### GitHub
- **Email**: mostoplesam@gmail.com
- **Repository**: https://github.com/Mostoples/alcura.git

## Deployment Options Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Firebase CLI** | Easy, all-in-one, official | Requires npm, larger install |
| **REST API** | Lightweight, no CLI | More manual setup |
| **GitHub Actions** | Automated, CI/CD | Requires GitHub config |

## Common Commands

```bash
# Deployment
npx firebase-tools deploy              # Deploy all
npx firebase-tools deploy --only hosting   # Host only
npx firebase-tools deploy --only database  # DB rules only

# Local
npx firebase-tools serve               # Start emulator
npx firebase-tools emulators:start     # Emulators only

# Project info
npx firebase-tools projects:list       # List projects
npx firebase-tools use alcura-id       # Switch project

# Cleanup
npx firebase-tools logout              # Remove stored auth
```

## Troubleshooting

### "GOOGLE_APPLICATION_CREDENTIALS not set"
```powershell
# Windows - set before deploy
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\firebase-config.json"
```

### "Permission denied" or "Authorization failed"
- Check service account has correct permissions in Firebase Console
- Verify `firebase-config.json` is valid JSON
- Ensure service account email is in Firebase IAM

### "Cannot find module 'firebase-tools'"
```bash
npm install
```

### "Node version too old"
- Check: `node --version`
- Need Node 16+
- Update from nodejs.org

### firebase-config.json missing/corrupted
- File should be in project root directory
- Contains service account credentials
- Keep this file SECRET (in .gitignore)

### "firebase.json not found"
- File must be in project root
- Contains Firebase project configuration
- Required for deployment

## Security Notes

⚠️ **IMPORTANT**
- `firebase-config.json` contains sensitive credentials
- Already in `.gitignore` - DO NOT commit to GitHub
- Never share this file publicly
- If leaked, regenerate service account in Firebase Console

## Next Steps

1. **Local Development**
   - Edit files in `public/` directory
   - Run `npm run serve` to test locally
   - Visit http://localhost:5000

2. **Deploy**
   - Set GOOGLE_APPLICATION_CREDENTIALS environment variable
   - Run `npx firebase-tools deploy`
   - Check deployment at https://alcura-id.web.app

3. **Version Control**
   - Use Git to track changes
   - Push to GitHub: `git push origin main`
   - Pull team changes: `git pull origin main`

## Support

- Firebase Docs: https://firebase.google.com/docs
- Firebase CLI Docs: https://firebase.google.com/docs/cli
- GitHub Docs: https://docs.github.com

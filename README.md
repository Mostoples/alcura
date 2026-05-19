# Alcura Project

Firebase-hosted project with GitHub integration.

## Quick Links

- 🔧 **Setup Guide**: [SETUP.md](SETUP.md)
- 🚀 **Live Site**: https://alcura-id.web.app
- 📦 **GitHub**: https://github.com/Mostoples/alcura.git
- 📊 **Database**: https://alcura-id-default-rtdb.firebaseio.com

## Setup (2 minutes)

### 1. Install
```bash
npm install
```

### 2. Deploy (Windows)
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\firebase-config.json"
npx firebase-tools deploy
```

### 2. Deploy (Linux/Mac)
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-config.json"
npx firebase-tools deploy
```

### Or use batch script (Windows)
```bash
.\deploy-windows.bat
```

## Directory Layout

```
alcura/
├── public/              # Website files
│   └── index.html      
├── scripts/            # Helper scripts
├── firebase.json       # Firebase config
├── .firebaserc         # Project reference
└── SETUP.md           # Detailed setup guide
```

## Development

### Local testing
```bash
npm run serve
# Visit http://localhost:5000
```

### Edit files
- Modify files in `public/` directory
- Changes appear after refresh (if serving locally)
- Deploy to update live site

## Deployment Methods

1. **Via CLI** (Recommended)
   - Set `GOOGLE_APPLICATION_CREDENTIALS` 
   - Run `npx firebase-tools deploy`

2. **Via npm script**
   - `npm run deploy:cli`

3. **Via batch script (Windows)**
   - `.\deploy-windows.bat`

## GitHub

Push changes to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Pull team changes:
```bash
git pull origin main
```

## Accounts

- **Firebase**: mersif.storage1@gmail.com
- **GitHub**: mostoplesam@gmail.com

## Important Files

⚠️ **firebase-config.json** — Service account, never commit!
- Already in `.gitignore`
- Keep it secret
- Contains deployment credentials

## Documentation

- [Firebase Setup Guide](SETUP.md)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase CLI Docs](https://firebase.google.com/docs/cli)

---

**Status**: ✅ Ready to deploy

 # Wallet-App
 
 ---
## For Developers:
# To install all dependencies from package.json use: npm install

## To run front-end App: npm run dev
## To run back-end server.js: npm run start:dev

### Node version: v18.17.1
### npm version: 9.8.0

## Install all packages included in package.json: npm install

Installed packages:
Vite: npm create vite@latest // Use React + Vite / JavaScript + SWC (Speedy Web Compiler)
modern-normalize: npm install modern-normalize
Prettier: npm install --save-dev --save-exact prettier
Redux Toolkit: npm install @reduxjs/toolkit
React-Redux: npm install @reduxjs/toolkit react-redux
redux-persist: npm install redux-persist
react-router-dom: npm install react-router-dom
Firebase: npm install -g firebase-tools
dotenv: npm install dotenv --save
Axios: npm install axios
Mui/material: npm install @mui/material @emotion/react @emotion/styled
Notiflix: npm i notiflix

gh-pages: npm install gh-pages --save-dev

---

Deploying Vite App to GitHub Pages using gh-pages and script deploy:

Install gh-pages: npm install gh-pages --save-dev

Add script in package.json:
"scripts": { "deploy": "npm run build && gh-pages -d dist" },

Run script to build and publish in gh-pages branch on github: 
npm run deploy
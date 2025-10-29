# CampusBarter Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- MongoDB
- Node.js 18+

### Local Development

#### 1. Start MongoDB
```bash
mongod
```

#### 2. Start Backend (Terminal 1)
```bash
cd server
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

#### 3. Start Frontend (Terminal 2)
```bash
npm install
npm run dev
```
Frontend runs on: http://localhost:5177

---

## 🌐 Production Deployment

### Option 1: Deploy to Railway (Recommended for Backend)

#### Backend Deployment:

1. **Create Railway Account**: https://railway.app
2. **Create New Project** → **Deploy from GitHub**
3. **Select CampusBarter repository**
4. **Configure Build**:
   - Root Directory: `server`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/campusbarter-server-0.0.1-SNAPSHOT.jar`
5. **Add Environment Variables**:
   ```
   SPRING_DATA_MONGODB_URI=your-mongodb-connection-string
   SERVER_PORT=8080
   ```
6. **Deploy** and get your backend URL (e.g., `https://campusbarter-production.up.railway.app`)

#### Frontend Deployment (Netlify):

1. **Update `.env.production`**:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```

2. **Build locally**:
   ```bash
   npm run build
   ```

3. **Deploy dist folder to Netlify**:
   - Drag `dist/` folder to Netlify
   - OR connect GitHub repo and set:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Environment variable: `VITE_API_URL=https://your-backend-url`

4. **Configure CORS** on backend:
   Update `AuthController.java` and other controllers:
   ```java
   @CrossOrigin(origins = {"https://your-netlify-app.netlify.app"})
   ```

---

### Option 2: Deploy to Render

#### Backend:
1. Create account at https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Root Directory: `server`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
   - Instance Type: Free
5. Add Environment Variables (MongoDB URI)
6. Deploy

#### Frontend:
Same as Netlify steps above, but deploy to Render Static Site instead.

---

### Option 3: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 🔧 Environment Variables

### Backend (`server/src/main/resources/application.properties`)
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/campusbarter
server.port=8080
jwt.secret=your-secret-key-here
```

### Frontend (`.env.production`)
```
VITE_API_URL=https://your-backend-api-url.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB connected
- [ ] Frontend deployed
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly
- [ ] Test registration and login
- [ ] Test item creation
- [ ] Test messaging feature

---

## 🐛 Troubleshooting

### Login not working on deployed site?
- ✅ Check if backend is running
- ✅ Verify `VITE_API_URL` is set correctly
- ✅ Check CORS configuration includes your Netlify domain
- ✅ Open browser console for error messages

### API calls failing?
- ✅ Check Network tab in browser DevTools
- ✅ Verify API URL is correct (not localhost)
- ✅ Check backend logs for errors

---

## 📞 Support

For issues, create an issue on GitHub: https://github.com/Hellbot15/CampusBarter/issues

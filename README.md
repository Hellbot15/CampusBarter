# CampusBarter — The Rizvi Exchange

This workspace contains a React frontend (Vite) and a minimal Java Spring Boot backend skeleton.

Frontend:
- Location: `./` (root of this repo)
- Start (dev): npm install; npm run dev
- Build: npm run build

Backend (Java Spring Boot):
- Location: `./server`
- Build & Run (Maven): mvn -f server/pom.xml spring-boot:run
- Package: mvn -f server/pom.xml clean package
- Build & Run (Maven Wrapper): server\mvnw.cmd spring-boot:run (requires JAVA_HOME set to JDK 17)

Notes:
- Frontend dev server (Vite) runs on port 5173 by default. Backend CORS is configured to allow `http://localhost:5173` for the demo `/api/items` endpoint.
- The backend now uses H2 in-memory database with JPA for persistence. Data is lost on restart. H2 console is enabled at `/h2-console`.
- Two sample items are loaded on startup via DataLoader.

Docker (build/run backend without Maven installed)
------------------------------------------------
If you have Docker installed you can build and run the backend container without installing Maven or JDK locally:

```powershell
# from repo root
docker build -f server/Dockerfile -t campusbarter-server:local ./server
docker run --rm -p 8080:8080 campusbarter-server:local
```

This will build the app inside a Maven container and run the packaged jar on port 8080.

Windows (install Java + Maven)
------------------------------
If you prefer to install Java and Maven locally on Windows, install a JDK 17 (Temurin/Adoptium or other) and Maven, then set JAVA_HOME environment variable:

```powershell
# Example: set JAVA_HOME (adjust path to your JDK 17 install)
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.9.9-hotspot"
java -version
mvn -v
```

Or use the Maven Wrapper (requires JAVA_HOME set):

```powershell
cd server
.\mvnw.cmd spring-boot:run
```

Then run from repository root:

```powershell
mvn -f server/pom.xml spring-boot:run
```

Maven Wrapper and other options
------------------------------
The repository includes a Maven Wrapper (mvnw / mvnw.cmd) so you can run `.\mvnw.cmd` without pre-installed Maven, but you still need Java 17 and JAVA_HOME set. The easiest option if you don't have Java installed is to use the Docker route above.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

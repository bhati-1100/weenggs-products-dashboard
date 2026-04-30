// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import "./App.css";
import PageLayout from "./components/layout/PageLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <PageLayout>
      <Dashboard />
    </PageLayout>
  );
}

export default App;

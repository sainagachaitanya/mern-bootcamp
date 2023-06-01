import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import BootcampPage from "./pages/BootcampsPage";
import NavBar from "./components/NavBar";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

function App() {
  const client = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={client}>
        <NavBar />
        <Router>
          <Routes>
            <Route path="/" element={<BootcampPage />}/>
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;

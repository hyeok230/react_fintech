import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AddUser from "./pages/AddUser";
import AuthResult from "./pages/AuthResult";
import Main from "./pages/Main";
import Balance from "./pages/Balance";
import QrCode from "./pages/QrCode";
import QrcodeReader from "./pages/QrcodeReader";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/adduser" exact>
          <AddUser></AddUser>
        </Route>
        <Route path="/authResult" exact>
          <AuthResult></AuthResult>
        </Route>
        <Route path="/main" exact>
          <Main></Main>
        </Route>
        <Route path="/balance">
          <Balance></Balance>
        </Route>
        <Route path="/qrcode">
          <QrCode></QrCode>
        </Route>
        <Route path="/qrreader" exact>
          <QrcodeReader></QrcodeReader>
        </Route>
      </Switch>

    </Router>
  );
}

export default App;

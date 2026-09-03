import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Seite nicht gefunden</h2>
      <p>
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>

      <Link to="/" className="primary-button">
        Zur Startseite
      </Link>
    </div>
  );
}

export default NotFound;
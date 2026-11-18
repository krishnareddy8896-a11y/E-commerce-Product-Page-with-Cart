import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="message-panel empty-panel not-found">
      <span className="eyebrow">A LITTLE OFF TRACK</span><h1>Well, this is awkward.</h1>
      <p>That page isn’t here, but there are plenty of good things back at the shop.</p>
      <Link className="button button-dark" to="/">Back to the collection <span>↗</span></Link>
    </div>
  );
}

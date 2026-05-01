import { useParams } from "react-router-dom";
import { DocumentViewer } from "../features/document-viewer/DocumentViewer";

export default function DocumentPage() {
  const { encodedUrl } = useParams<{ encodedUrl: string }>();

  if (!encodedUrl) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          background: "#1a1a2e",
        }}
      >
        URL no especificada.
      </div>
    );
  }

  let decoded: string;
  try {
    decoded = atob(encodedUrl);
  } catch {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          background: "#1a1a2e",
        }}
      >
        URL inválida.
      </div>
    );
  }

  return <DocumentViewer githubRawUrl={decoded} />;
}

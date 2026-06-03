import { useEffect, useMemo, useState } from "react";

import { fetchScriptureReference } from "../api/scripture";
import type { ScriptureReference } from "../api/scripture";

type Props = {
  reference: string;
};

const BIBLE_VERSIONS = [
  {
    id: 111,
    label: "NIV",
    bibleGatewayVersion: "NIV",
  },
  {
    id: 2692,
    label: "NASB",
    bibleGatewayVersion: "NASB",
  },
];

function ScriptureBlock({ reference }: Props) {
  const [selectedBibleId, setSelectedBibleId] = useState(111);
  const [scripture, setScripture] = useState<ScriptureReference | null>(null);
  const [error, setError] = useState("");

  const selectedVersion = BIBLE_VERSIONS.find(
    (version) => version.id === selectedBibleId
  );

  const bibleGatewayUrl = useMemo(() => {
    const params = new URLSearchParams({
      search: reference,
      version: selectedVersion?.bibleGatewayVersion ?? "NIV",
    });

    return `https://www.biblegateway.com/passage/?${params.toString()}`;
  }, [reference, selectedVersion]);

  useEffect(() => {
    setScripture(null);
    setError("");

    fetchScriptureReference(reference, selectedBibleId)
      .then((data) => setScripture(data))
      .catch(() => setError("Could not load scripture passage."));
  }, [reference, selectedBibleId]);

  return (
    <div className="scripture-block">
      <div className="scripture-toolbar">
        <strong>{scripture?.reference ?? reference}</strong>

        <select
          value={selectedBibleId}
          onChange={(event) => setSelectedBibleId(Number(event.target.value))}
        >
          {BIBLE_VERSIONS.map((version) => (
            <option key={version.id} value={version.id}>
              {version.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="scripture-error">{error}</p>}

      {!error && !scripture && <p>Loading scripture...</p>}

      {!error && scripture && (
        <div
          className="scripture-content"
          dangerouslySetInnerHTML={{ __html: scripture.content }}
        />
      )}

      <a
        className="scripture-external-link"
        href={bibleGatewayUrl}
        target="_blank"
        rel="noreferrer"
      >
        Read this passage in other versions on Bible Gateway
      </a>
    </div>
  );
}

export default ScriptureBlock;
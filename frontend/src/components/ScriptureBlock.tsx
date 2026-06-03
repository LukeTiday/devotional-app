import { useEffect, useState } from "react";

import { fetchScriptureReference } from "../api/scripture";
import type { ScriptureReference } from "../api/scripture";

type Props = {
  reference: string;
};

function ScriptureBlock({ reference }: Props) {
  const [scripture, setScripture] = useState<ScriptureReference | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setScripture(null);
    setError("");

    fetchScriptureReference(reference)
      .then((data) => setScripture(data))
      .catch(() => setError("Could not load scripture passage."));
  }, [reference]);

  if (error) {
    return (
      <div className="scripture-block scripture-block-error">
        <strong>{reference}</strong>
        <p>{error}</p>
      </div>
    );
  }

  if (!scripture) {
    return (
      <div className="scripture-block">
        <strong>{reference}</strong>
        <p>Loading scripture...</p>
      </div>
    );
  }

  return (
    <div className="scripture-block">
        <strong>{scripture.reference}</strong>

        <div
        className="scripture-content"
        dangerouslySetInnerHTML={{ __html: scripture.content }}
        />
    </div>
  );
}

export default ScriptureBlock;
import { useCallback, useEffect, useState } from "react";

export function useProducts(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`The product service returned ${response.status}.`);
        return response.json();
      })
      .then(setData)
      .catch((cause) => {
        if (cause.name !== "AbortError") {
          setData(null);
          setError(cause.message || "Products could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [url, attempt]);

  return { data, loading, error, retry };
}

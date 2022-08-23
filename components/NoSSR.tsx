import { ReactElement, useEffect, useState } from "react";

export default function NoSSR(props: { children: ReactElement | null }) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (isLoading) return null;

  return props.children;
}

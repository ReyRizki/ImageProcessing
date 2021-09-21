import React, { useEffect } from 'react';
import { useOpenCv } from 'opencv-react';

export default function Home() {
  const { loaded, cv } = useOpenCv()

  useEffect(() => {
    if (cv) {
    }
  }, [cv])

  return (
    <p>Open CV</p>
  );
}

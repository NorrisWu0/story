import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Dimension = {
  width: number;
  height: number;
};

export default function AboutPage() {
  const containerRef = useRef<React.ComponentRef<"div">>(null);
  const [sectionDimension, setSectionDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const contaienr = containerRef.current;
    if (!contaienr) return;
    const updateSectionDimension = () => {
      setSectionDimension({
        width: contaienr.offsetWidth,
        height: contaienr.offsetHeight,
      });
    };

    updateSectionDimension();
  }, []);

  return (
    <div
      id="scrolling-container"
      ref={containerRef}
      className="flex-1 size-full my-4 overflow-y-auto"
    >
      <TheReality dimension={sectionDimension} />
      <TheProblem dimension={sectionDimension} />
      <TheIdea dimension={sectionDimension} />
    </div>
  );
}

function TheReality(props: { dimension: Dimension }) {
  return (
    <div
      className="ring-1"
      style={{ width: props.dimension.width, height: props.dimension.height }}
    >
      The Reality
    </div>
  );
}
function TheProblem(props: { dimension: Dimension }) {
  return (
    <div
      style={{ width: props.dimension.width, height: props.dimension.height }}
    >
      The Problem
    </div>
  );
}
function TheIdea(props: { dimension: Dimension }) {
  return (
    <div
      style={{ width: props.dimension.width, height: props.dimension.height }}
    >
      The Idea
    </div>
  );
}

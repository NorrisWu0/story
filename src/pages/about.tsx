import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ShinyText } from "@/components/shiny-text";
import { TextType } from "@/components/text-type";

type Dimension = {
  width: number;
  height: number;
};

type Section = {
  title: string;
  component: React.ReactNode;
};

type SectionContainerProps = {
  dimension: Dimension;
  children: React.ReactNode;
  title: string;
};

function SectionContainer({
  dimension,
  children,
  title,
}: SectionContainerProps) {
  return (
    <div
      className="snap-start snap-always flex items-center justify-center"
      style={{ width: dimension.width, height: dimension.height }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "linear" }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-col size-full relative py-4"
      >
        <div className="my-auto">{children}</div>

        <span className="text-xl uppercase text-neutral-300 font-bold">
          {title}
        </span>
      </motion.div>
    </div>
  );
}

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

  const sections: Section[] = [
    { title: "The Reality", component: <TheReality /> },
    { title: "The Problem", component: <TheProblem /> },
    { title: "The Idea", component: <TheIdea /> },
    { title: "The Experience", component: <TheExperience /> },
    { title: "The Outro", component: <TheOutro /> },
  ];

  return (
    <div
      id="scrolling-container"
      ref={containerRef}
      className="flex-1 size-full overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {sections.map((section) => (
        <SectionContainer
          key={section.title}
          dimension={sectionDimension}
          title={section.title}
        >
          {section.component}
        </SectionContainer>
      ))}
    </div>
  );
}

function TheReality() {
  return (
    <>
      <p className="text-base text-muted-foreground mb-4">
        In a world called <strong className="text-blue-500">sohac</strong>, an
        imaginary realm experiencing a turbulent period of history.
      </p>
      <ul className="text-sm text-muted-foreground space-y-2">
        <li>• Power shifts between global superpowers</li>
        <li>• Emerging and disruptive technologies</li>
        <li>• An increasingly faster-paced life</li>
      </ul>
    </>
  );
}
function TheProblem() {
  const problems = [
    "Social anxiety and disconnection",
    "Job insecurity in a rapidly changing economy",
    "Increasing numbers feeling unsafe and uncertain",
    "Large percentage unsure what their future holds",
    "Many held back by the intensity of modern life",
  ];

  return (
    <>
      <p className="text-base text-muted-foreground mb-6">
        People in this world face mounting challenges:
      </p>
      <ul className="text-sm text-muted-foreground space-y-3">
        {problems.map((problem) => (
          <li key={problem}>• {problem}</li>
        ))}
      </ul>
    </>
  );
}
function TheIdea() {
  return (
    <>
      <div className="mb-6">
        <ShinyText text="STORY" speed={3} className="text-6xl text-blue-500" />
      </div>
      <p className="text-base text-muted-foreground mb-4">
        Leveraging the power of AI to help people gain a better understanding of
        themselves.
      </p>
      <p className="text-sm text-muted-foreground">
        <strong className="text-blue-500">STORY</strong> is NOT a teacher,
        instructor, or supervisor.
        <br />
        It's a digital journal, a friend, a mentor—a reflection of yourself.
      </p>
    </>
  );
}

function TheExperience() {
  const useCases = [
    "By providing your biography, you can explore your past...",
    "Ask questions about yourself to find your inner voice...",
    "Discover patterns in your thoughts and behaviors...",
    "Reflect on your journey with an AI companion...",
  ];

  return (
    <>
      <div className="text-base text-muted-foreground min-h-12">
        <TextType
          text={useCases}
          startOnVisible={true}
          loop={true}
          pauseDuration={2000}
          deletingSpeed={30}
          typingSpeed={50}
        />
      </div>
    </>
  );
}

function TheOutro() {
  return (
    <h1 className="text-6xl font-bold">
      So. What's your <span className="text-blue-500">STORY</span>?
    </h1>
  );
}

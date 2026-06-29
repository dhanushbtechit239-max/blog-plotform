import { motion } from 'motion/react';

const Cube = ({ size = 60, color = 'rgba(124, 58, 237, 0.3)', borderColor = '#7c3aed', initialPos = { top: '20%', left: '10%' }, duration = 20, delay = 0 }) => {
  const halfSize = size / 2;

  return (
    <div
      className="absolute pointer-events-none z-0"
      style={{
        top: initialPos.top,
        left: initialPos.left,
        perspective: '1000px',
      }}
    >
      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          rotateX: [0, 360],
          rotateY: [360, 0],
          rotateZ: [0, 180],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
          delay: delay,
        }}
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateY(0deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateY(180deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
        {/* Left */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
        {/* Right */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateY(90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
        {/* Top */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateX(90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
        {/* Bottom */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: color,
            border: `1px solid ${borderColor}`,
            transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 15px ${borderColor}30`,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      </motion.div>
    </div>
  );
};

const BackgroundCubes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden md:block select-none">
      {/* Cube 1: Purple */}
      <Cube
        size={90}
        color="rgba(124, 58, 237, 0.07)"
        borderColor="rgba(124, 58, 237, 0.2)"
        initialPos={{ top: '15%', left: '8%' }}
        duration={28}
        delay={0}
      />
      {/* Cube 2: Cyan */}
      <Cube
        size={70}
        color="rgba(6, 182, 212, 0.07)"
        borderColor="rgba(6, 182, 212, 0.2)"
        initialPos={{ top: '65%', left: '88%' }}
        duration={22}
        delay={3}
      />
      {/* Cube 3: Amber */}
      <Cube
        size={60}
        color="rgba(245, 158, 11, 0.05)"
        borderColor="rgba(245, 158, 11, 0.18)"
        initialPos={{ top: '40%', left: '82%' }}
        duration={25}
        delay={5}
      />
      {/* Cube 4: Emerald Green */}
      <Cube
        size={80}
        color="rgba(16, 185, 129, 0.06)"
        borderColor="rgba(16, 185, 129, 0.18)"
        initialPos={{ top: '75%', left: '15%' }}
        duration={32}
        delay={1.5}
      />
      {/* Cube 5: Pink/Rose */}
      <Cube
        size={75}
        color="rgba(236, 72, 153, 0.06)"
        borderColor="rgba(236, 72, 153, 0.18)"
        initialPos={{ top: '25%', left: '72%' }}
        duration={26}
        delay={2}
      />
      {/* Cube 6: Blue/Indigo */}
      <Cube
        size={65}
        color="rgba(59, 130, 246, 0.06)"
        borderColor="rgba(59, 130, 246, 0.18)"
        initialPos={{ top: '52%', left: '5%' }}
        duration={24}
        delay={4}
      />
      {/* Cube 7: Red/Orange */}
      <Cube
        size={50}
        color="rgba(239, 68, 68, 0.05)"
        borderColor="rgba(239, 68, 68, 0.15)"
        initialPos={{ top: '82%', left: '42%' }}
        duration={20}
        delay={1}
      />
      {/* Cube 8: Gold/Yellow */}
      <Cube
        size={55}
        color="rgba(234, 179, 8, 0.05)"
        borderColor="rgba(234, 179, 8, 0.15)"
        initialPos={{ top: '10%', left: '50%' }}
        duration={18}
        delay={6}
      />
    </div>
  );
};

export default BackgroundCubes;

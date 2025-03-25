/*
This easter egg brought to you almost entirely by Claude. Good work, little AI buddy!
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './flappy-plane.css';
import { useDispatch } from '@/redux/store';
import { setFilterText } from '@/redux/filterSlice';

const FlappyPlane: React.FC = () => {
  // Game states that require re-rendering
  const dispatch = useDispatch();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  // Game physics constants
  const gravity = 0.2;
  const jumpPower = -4;
  const cloudSpeed = 3;
  const cloudGenerationInterval = 50;
  const groundHeight = 15; // ground height as percentage of viewport height
  
  // Viewport size state with initial measurements
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Refs for values that don't need to trigger re-renders
  const gameRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const cloudIdCounter = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  
  // Use refs for position and velocity to avoid re-renders
  const planePositionRef = useRef({ top: window.innerHeight / 2, rotation: 0 });
  const velocityRef = useRef(0);
  
  // Use state for clouds to make them visible in the DOM
  const [clouds, setClouds] = useState<Array<{ 
    left: number, 
    top: number, 
    isThunderstorm: boolean, 
    collected: boolean, 
    id: number 
  }>>([]);
  
  // State for rendering planes and clouds
  const [renderTrigger, setRenderTrigger] = useState(0);
  
  // Calculate ground position in pixels
  const getGroundYPosition = useCallback(() => {
    return viewportSize.height - (viewportSize.height * groundHeight / 100);
  }, [viewportSize.height]);

  
  // Enhanced window resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewportSize({ width, height });
      
      // Also update plane position if game is running to keep it in view
      if (gameStarted && !gameOver) {
        const groundY = getGroundYPosition();
        planePositionRef.current = {
          ...planePositionRef.current,
          top: Math.min(planePositionRef.current.top, groundY - 40)
        };
      }
    };
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Initial call to ensure proper size on first render
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gameStarted, gameOver, getGroundYPosition]);
  
  // Get the horizontal plane position (centered)
  const getPlaneHorizontalPosition = () => {
    return viewportSize.width / 2 - 30; // 30 is half of plane width
  };
  
  // Cleanup function to ensure game loop is properly cancelled
  const cleanupGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    isRunningRef.current = false;
  }, []);
  
  // Start the game
  const startGame = useCallback(() => {
    // Ensure any existing game loop is properly cleaned up
    cleanupGameLoop();
    
    // Reset all state
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setClouds([]);
    
    // Reset all refs with viewport-aware positioning
    planePositionRef.current = { top: viewportSize.height / 2, rotation: 0 };
    velocityRef.current = 0;
    cloudIdCounter.current = 0;
    frameCount.current = 0;
    gameStartTimeRef.current = performance.now();
    lastUpdateTimeRef.current = performance.now();
    isRunningRef.current = true;
    
    // Force a render update
    setRenderTrigger(prev => prev + 1);
  }, [cleanupGameLoop, viewportSize.height]);
  
  // Jump function - modified to not restart when game over
  const jump = useCallback(() => {
    if (gameStarted && !gameOver && isRunningRef.current) {
      velocityRef.current += jumpPower;
    } else if (!gameStarted) {
      // Only start a new game if not started yet, NOT when game over
      startGame();
    }
  }, [gameStarted, gameOver, jumpPower, startGame]);
  
  // Create a new cloud with viewport-aware positioning
  const createCloud = useCallback(() => {
    // Make sure clouds don't appear too close to the ground
    const groundY = getGroundYPosition();
    const maxCloudHeight = groundY - 60; // Keep clouds away from ground
    
    return {
      left: viewportSize.width,
      top: Math.random() * maxCloudHeight,
      isThunderstorm: Math.random() > 0.6,
      collected: false,
      id: cloudIdCounter.current++
    };
  }, [viewportSize, getGroundYPosition]);
  
  // Animation loop with requestAnimationFrame
  const animationLoop = useCallback(() => {
    if (!isRunningRef.current) return;
    
    const now = performance.now();
    const deltaTime = Math.min((now - lastUpdateTimeRef.current) / 16.67, 2);
    lastUpdateTimeRef.current = now;
    
    frameCount.current++;
    
    // Get ground position
    const groundY = getGroundYPosition();
    
    // Update plane position with direct DOM manipulation for smoother animation
    const planeDom = planeRef.current;
    velocityRef.current = velocityRef.current + (gravity * deltaTime);
    
    // Limit plane movement to stay above ground
    const newTop = Math.max(0, Math.min(
      planePositionRef.current.top + (velocityRef.current * deltaTime),
      groundY - 40 // Keep plane above ground (40px is plane height)
    ));
    
    // Calculate rotation based on velocity - adjusted for 90 degree base rotation
    planePositionRef.current = {
      top: newTop,
      rotation: Math.min(Math.max(90 + (velocityRef.current * 15), 15), 165)
    };
    
    if (planeDom) {
      planeDom.style.top = `${planePositionRef.current.top}px`;
      planeDom.style.transform = `rotate(${planePositionRef.current.rotation}deg)`;
    }
    
    // Generate new clouds
    const timeSinceStart = now - gameStartTimeRef.current;
    if (timeSinceStart > 500 && frameCount.current % cloudGenerationInterval === 0) {
      setClouds(prev => [...prev, createCloud()]);
    }
    
    // Update clouds and check collisions
    if (timeSinceStart > 1000) {
      setClouds(prevClouds => {
        const gameElement = gameRef.current;
        const planeElement = planeRef.current;
        
        if (!gameElement || !planeElement) return prevClouds;
        
        const planeRect = planeElement.getBoundingClientRect();
        const gameRect = gameElement.getBoundingClientRect();
        
        // Check boundary and ground collisions
        if (
            planePositionRef.current.top <= 0 || 
            planePositionRef.current.top >= (groundY - 40)
        ) {
          setGameOver(true);
          isRunningRef.current = false;
        }
        
        return prevClouds
          .map(cloud => {
            // Move cloud left
            const updatedCloud = {
              ...cloud,
              left: cloud.left - (cloudSpeed * deltaTime)
            };
            
            // Check for collision if not already collected
            if (!cloud.collected) {
              const cloudRect = {
                left: updatedCloud.left + gameRect.left,
                top: updatedCloud.top + gameRect.top,
                right: updatedCloud.left + gameRect.left + 20,
                bottom: updatedCloud.top + gameRect.top + 20
              };
              
              if (
                planeRect.right > cloudRect.left &&
                planeRect.left < cloudRect.right &&
                planeRect.bottom > cloudRect.top &&
                planeRect.top < cloudRect.bottom
              ) {
                // Collision detected
                if (cloud.isThunderstorm) {
                  // Game over if hit thunderstorm
                  setGameOver(true);
                  isRunningRef.current = false;
                } else {
                  // Collect normal cloud
                  setScore(s => s + 1);
                  return { ...updatedCloud, collected: true };
                }
              }
            }
            
            return updatedCloud;
          })
          .filter(cloud => cloud.left > -60); // Remove clouds that are off-screen
      });
    }
    
    // Request next frame if still running
    if (isRunningRef.current) {
      gameLoopRef.current = requestAnimationFrame(animationLoop);
    }
  }, [createCloud, getGroundYPosition]);
  
  // Main game effect - controls starting and stopping the game loop
  useEffect(() => {
    if (!gameStarted || gameOver) {
      cleanupGameLoop();
      return;
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        jump();
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        dispatch(setFilterText({ filterText: '' }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Ensure we have the proper run state
    isRunningRef.current = true;
    lastUpdateTimeRef.current = performance.now();
    
    // Start animation directly
    gameLoopRef.current = requestAnimationFrame(animationLoop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanupGameLoop();
    };
  }, [gameStarted, gameOver, jump, cleanupGameLoop, animationLoop]);
  
  // Ensure visibility change doesn't cause issues
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupGameLoop();
      } else if (gameStarted && !gameOver) {
        isRunningRef.current = true;
        lastUpdateTimeRef.current = performance.now();
        gameLoopRef.current = requestAnimationFrame(animationLoop);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameStarted, gameOver, cleanupGameLoop, animationLoop]);
  
  // Calculate plane horizontal position
  const planeLeft = getPlaneHorizontalPosition();
  
  // Return with explicit dimensions to ensure proper filling of the viewport
  return (
    <div 
      className="flappy-plane-game" 
      ref={gameRef}
      onClick={jump}  // This will only handle jumps during gameplay or initial start
      style={{
        inset: 0,
        position: 'fixed', // Ensure positioning context
        overflow: 'hidden'   // Ensure content doesn't overflow
      }}
    >

      <button className="fp-button" style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 99, backgroundColor: 'red' }} onClick={()=>dispatch(setFilterText({ filterText: '' }))}>
        Exit
      </button>

      {/* Debug ground with inline styles */}
      <div className="ground"
        style={{
          height: `${groundHeight}vh`,
          zIndex: 8
        }}
      />
      
      {/* Plane */}
      <div 
        key={`plane-${renderTrigger}`}
        className="plane"
        ref={planeRef}
        style={{ 
          top: `${planePositionRef.current.top}px`,
          left: `${planeLeft}px`,
          transform: `rotate(${planePositionRef.current.rotation}deg)`,
          zIndex: 10
        }}
      />
      
      {/* Clouds */}
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className={`cloud ${cloud.isThunderstorm ? 'thunderstorm' : 'normal'} ${cloud.collected ? 'collected' : ''}`}
          style={{
            left: `${cloud.left}px`,
            top: `${cloud.top}px`,
            zIndex: 5
          }}
        />
      ))}
      
      {/* Score counter */}
      <div className="score" style={{ zIndex: 15 }}>{score}</div>
      
      {/* Start screen */}
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <h2>Flappy Plane</h2>
          <p>Click to start</p>
        </div>
      )}
      
      {/* Game over screen - button now stops event propagation */}
      {gameOver && (
        <div 
          className="game-over"
          onClick={(e) => e.stopPropagation()}  // Prevent clicks from reaching the game area  // Prevent key events from reaching the game area
        >
          <h2>Game Over</h2>
          <p>Your score: {score}</p>
          <button className="fp-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              startGame();
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FlappyPlane;

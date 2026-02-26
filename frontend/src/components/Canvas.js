import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';

const Canvas = forwardRef(({ tool, color, brushSize, onDrawing, onSave }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataURL);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [history, historyStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set drawing styles
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.imageSmoothingEnabled = true;
    };

    resizeCanvas();
    contextRef.current = context;

    // Save initial state
    saveState();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [saveState]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
      contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [tool, color, brushSize]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  };

  const startDrawing = (position) => {
    console.log('Starting drawing at:', position);
    setIsDrawing(true);
    setLastPosition(position);
    
    const context = contextRef.current;
    if (!context) {
      console.error('Context not available!');
      return;
    }
    
    console.log('Context settings:', {
      strokeStyle: context.strokeStyle,
      lineWidth: context.lineWidth,
      globalCompositeOperation: context.globalCompositeOperation
    });
    
    context.beginPath();
    context.moveTo(position.x, position.y);

    // Send drawing start event
    onDrawing({
      type: 'start',
      x: position.x,
      y: position.y,
      tool,
      color,
      brushSize
    });
  };

  const draw = (position) => {
    if (!isDrawing) return;

    const context = contextRef.current;
    context.lineTo(position.x, position.y);
    context.stroke();

    // Send drawing data
    onDrawing({
      type: 'draw',
      x: position.x,
      y: position.y,
      prevX: lastPosition.x,
      prevY: lastPosition.y,
      tool,
      color,
      brushSize
    });

    setLastPosition(position);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    const context = contextRef.current;
    context.closePath();

    // Save state for undo/redo
    saveState();

    // Save canvas data
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL());

    // Send drawing end event
    onDrawing({
      type: 'end',
      tool,
      color,
      brushSize
    });
  };

  // Mouse events
  const handleMouseDown = (e) => {
    console.log('Mouse down event triggered');
    const position = getMousePos(e);
    console.log('Mouse position:', position);
    startDrawing(position);
  };

  const handleMouseMove = (e) => {
    const position = getMousePos(e);
    draw(position);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const position = getTouchPos(e);
    startDrawing(position);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const position = getTouchPos(e);
    draw(position);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      saveState();
    },

    loadCanvas: (dataURL) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = dataURL;
    },

    handleRemoteDrawing: (data) => {
      const context = contextRef.current;
      
      // Set drawing properties
      context.strokeStyle = data.color;
      context.lineWidth = data.brushSize;
      context.globalCompositeOperation = data.tool === 'eraser' ? 'destination-out' : 'source-over';

      if (data.type === 'start') {
        context.beginPath();
        context.moveTo(data.x, data.y);
      } else if (data.type === 'draw') {
        context.lineTo(data.x, data.y);
        context.stroke();
      } else if (data.type === 'end') {
        context.closePath();
      }

      // Reset to current user's settings
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    },

    undo: () => {
      if (historyStep > 0) {
        const newStep = historyStep - 1;
        setHistoryStep(newStep);
        const canvas = canvasRef.current;
        const context = contextRef.current;
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };
        img.src = history[newStep];
      }
    },

    redo: () => {
      if (historyStep < history.length - 1) {
        const newStep = historyStep + 1;
        setHistoryStep(newStep);
        const canvas = canvasRef.current;
        const context = contextRef.current;
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };
        img.src = history[newStep];
      }
    },

    downloadCanvas: () => {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    },

    canUndo: () => historyStep > 0,
    canRedo: () => historyStep < history.length - 1
  }));

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'none',
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
        background: 'white'
      }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
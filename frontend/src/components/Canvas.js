import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ tool, color, brushSize, onDrawing, onSave }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Save current canvas content
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Restore canvas content
        ctx.putImageData(imageData, 0, 0);
        
        // Reapply context settings after resize
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    };

    // Only set context once on mount
    if (!context) {
      resizeCanvas();
      setContext(ctx);
    }

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []); // Remove color and brushSize from dependencies

  // Update drawing settings when tool, color, or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [context, tool, color, brushSize]);

  const startDrawing = (e) => {
    if (!context) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x, y);

    onDrawing({
      type: 'start',
      x,
      y,
      tool,
      color,
      brushSize
    });
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();

    onDrawing({
      type: 'draw',
      x,
      y,
      tool,
      color,
      brushSize
    });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }

    // Save canvas
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }

    onDrawing({
      type: 'end',
      tool,
      color,
      brushSize
    });
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },

    loadCanvas: (dataURL) => {
      if (!canvasRef.current || !context) return;
      
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
      img.src = dataURL;
    },

    handleRemoteDrawing: (data) => {
      if (!context) return;

      const prevStrokeStyle = context.strokeStyle;
      const prevLineWidth = context.lineWidth;
      const prevCompositeOp = context.globalCompositeOperation;

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

      context.strokeStyle = prevStrokeStyle;
      context.lineWidth = prevLineWidth;
      context.globalCompositeOperation = prevCompositeOp;
    },

    downloadCanvas: () => {
      if (!canvasRef.current) return;
      
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    },

    undo: () => {
      // Simplified - just clear for now
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },

    redo: () => {
      // Simplified
    },

    canUndo: () => false,
    canRedo: () => false
  }));

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        startDrawing(mouseEvent);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        draw(mouseEvent);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        stopDrawing();
      }}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
        background: 'white',
        touchAction: 'none'
      }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;

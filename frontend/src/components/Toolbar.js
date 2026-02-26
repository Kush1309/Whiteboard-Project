import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  Download, 
  Undo, 
  Redo,
  Palette,
  Minus,
  Plus
} from 'lucide-react';

const Toolbar = ({ 
  tool, 
  setTool, 
  color, 
  setColor, 
  brushSize, 
  setBrushSize, 
  onClear, 
  onDownload,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { isDark } = useTheme();

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  const tools = [
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1rem',
      width: '5rem',
      background: isDark ? '#374151' : 'white',
      borderRight: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
    }}>
      {/* Tools */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tools.map((toolItem) => {
          const Icon = toolItem.icon;
          return (
            <button
              key={toolItem.id}
              onClick={() => setTool(toolItem.id)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s',
                background: tool === toolItem.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: tool === toolItem.id ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={toolItem.label}
              onMouseEnter={(e) => {
                if (tool !== toolItem.id) {
                  e.target.style.background = isDark ? '#4b5563' : '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (tool !== toolItem.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Color Picker */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '2px solid #e5e7eb',
            transition: 'all 0.2s',
            backgroundColor: color,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Color"
          onMouseEnter={(e) => e.target.style.borderColor = '#9ca3af'}
          onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
        >
          <Palette size={20} style={{ color: 'white', mixBlendMode: 'difference' }} />
        </button>
        
        {showColorPicker && (
          <div style={{
            position: 'absolute',
            left: '100%',
            marginLeft: '0.5rem',
            top: 0,
            background: isDark ? '#374151' : 'white',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
            borderRadius: '0.5rem',
            padding: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: 10
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.5rem',
              width: '10rem'
            }}>
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => {
                    setColor(colorOption);
                    setShowColorPicker(false);
                  }}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '0.25rem',
                    border: color === colorOption ? '2px solid #111827' : '2px solid #e5e7eb',
                    backgroundColor: colorOption,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '2rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Brush Size */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Size: {brushSize}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
            style={{
              padding: '0.5rem',
              color: '#6b7280',
              background: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Increase brush size"
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
            style={{
              padding: '0.5rem',
              color: '#6b7280',
              background: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Decrease brush size"
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <Minus size={16} />
          </button>
        </div>
        
        {/* Brush size preview */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0.5rem 0'
        }}>
          <div
            style={{
              width: Math.max(4, Math.min(20, brushSize)),
              height: Math.max(4, Math.min(20, brushSize)),
              borderRadius: '50%',
              border: '1px solid #e5e7eb',
              backgroundColor: color
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              transition: 'all 0.2s',
              color: canUndo ? '#6b7280' : '#d1d5db',
              background: 'transparent',
              border: 'none',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Undo"
            onMouseEnter={(e) => {
              if (canUndo) e.target.style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              if (canUndo) e.target.style.background = 'transparent';
            }}
          >
            <Undo size={20} />
          </button>
        )}
        
        {onRedo && (
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              transition: 'all 0.2s',
              color: canRedo ? '#6b7280' : '#d1d5db',
              background: 'transparent',
              border: 'none',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Redo"
            onMouseEnter={(e) => {
              if (canRedo) e.target.style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              if (canRedo) e.target.style.background = 'transparent';
            }}
          >
            <Redo size={20} />
          </button>
        )}
        
        <button
          onClick={onClear}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            color: '#dc2626',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Clear board"
          onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <Trash2 size={20} />
        </button>
        
        <button
          onClick={onDownload}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            color: '#6b7280',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Download as image"
          onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Code, 
  GitBranch,
  Binary,
  Network,
  List,
  FileText,
  Maximize,
  Minimize
} from 'lucide-react';
import Canvas from '../components/Canvas';

const InterviewBoard = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState(30); // 30, 45, 60 minutes
  
  // Canvas state
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const canvasRef = useRef(null);
  
  // Code editor state
  const [code, setCode] = useState('// Write your code here\n\n');
  const [language, setLanguage] = useState('javascript');
  const [showCodePanel, setShowCodePanel] = useState(true);
  
  // Notes state
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast.success('Time is up!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes) => {
    setTimerSeconds(minutes * 60);
    setTimerMode(minutes);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    if (timerSeconds === 0) {
      startTimer(timerMode);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const resetTimer = () => {
    setTimerSeconds(timerMode * 60);
    setIsTimerRunning(false);
  };

  const insertTemplate = (template) => {
    const templates = {
      linkedList: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insert(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }
}`,
      binaryTree: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    // Insert logic here
  }
}`,
      graph: `class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1);
  }
}`,
      array: `// Array operations
const arr = [];

// Common operations:
arr.push(item);        // Add to end
arr.pop();             // Remove from end
arr.unshift(item);     // Add to start
arr.shift();           // Remove from start
arr.slice(start, end); // Get subarray
arr.splice(i, n);      // Remove n items at i`,
      sorting: `// Sorting algorithms

// Bubble Sort - O(n²)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Quick Sort - O(n log n)
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
      searching: `// Searching algorithms

// Binary Search - O(log n)
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Linear Search - O(n)
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
    };
    
    setCode(templates[template] || code);
    toast.success('Template inserted!');
  };

  const downloadSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      duration: `${timerMode} minutes`,
      timeUsed: formatTime(timerMode * 60 - timerSeconds),
      code: code,
      language: language,
      notes: notes
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Session downloaded!');
  };

  const dataStructures = [
    { id: 'linkedList', icon: List, label: 'Linked List', color: '#3b82f6' },
    { id: 'binaryTree', icon: GitBranch, label: 'Binary Tree', color: '#10b981' },
    { id: 'graph', icon: Network, label: 'Graph', color: '#f59e0b' },
    { id: 'array', icon: Binary, label: 'Array', color: '#8b5cf6' },
    { id: 'sorting', icon: Code, label: 'Sorting', color: '#ec4899' },
    { id: 'searching', icon: Code, label: 'Searching', color: '#06b6d4' }
  ];

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f9fafb',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', margin: 0 }}>
              🎯 AI Interview Practice Board
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              Coding & DSA Interview Preparation
            </p>
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            fontFamily: 'monospace',
            minWidth: '5rem',
            textAlign: 'center'
          }}>
            {formatTime(timerSeconds)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={toggleTimer}
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title={isTimerRunning ? 'Pause' : 'Start'}
            >
              {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={resetTimer}
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <select
            value={timerMode}
            onChange={(e) => setTimerMode(Number(e.target.value))}
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              outline: 'none'
            }}
          >
            <option value={30} style={{ background: '#667eea', color: 'white' }}>30 min</option>
            <option value={45} style={{ background: '#667eea', color: 'white' }}>45 min</option>
            <option value={60} style={{ background: '#667eea', color: 'white' }}>60 min</option>
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              padding: '0.5rem 1rem',
              background: showNotes ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            <FileText size={16} />
            Notes
          </button>
          <button
            onClick={downloadSession}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            <Download size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Drawing Tools & Templates */}
        {!isFullscreen && (
          <div style={{
            width: '250px',
            background: 'white',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
          <div style={{ padding: '1rem' }}>
            {/* Drawing Tools */}
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Drawing Tools
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {/* Tool Selection */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setTool('pencil')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: tool === 'pencil' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f9fafb',
                    color: tool === 'pencil' ? 'white' : '#374151',
                    border: '1px solid',
                    borderColor: tool === 'pencil' ? '#667eea' : '#e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (tool !== 'pencil') {
                      e.currentTarget.style.background = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tool !== 'pencil') {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                >
                  ✏️ Pencil
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: tool === 'eraser' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f9fafb',
                    color: tool === 'eraser' ? 'white' : '#374151',
                    border: '1px solid',
                    borderColor: tool === 'eraser' ? '#667eea' : '#e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (tool !== 'eraser') {
                      e.currentTarget.style.background = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tool !== 'eraser') {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                >
                  🧹 Eraser
                </button>
              </div>

              {/* Color Picker */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      padding: '0.5rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#374151',
                      textAlign: 'center'
                    }}>
                      {color.toUpperCase()}
                    </div>
                  </div>
                </div>
                {/* Quick Colors */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: c,
                        border: color === c ? '3px solid #667eea' : '2px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Brush Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '0.5rem'
                }}>
                  <div
                    style={{
                      width: `${Math.max(8, Math.min(40, brushSize * 2))}px`,
                      height: `${Math.max(8, Math.min(40, brushSize * 2))}px`,
                      borderRadius: '50%',
                      background: color,
                      border: '2px solid #e5e7eb'
                    }}
                  />
                </div>
              </div>

              {/* Clear Canvas */}
              <button
                onClick={() => {
                  if (window.confirm('Clear the entire canvas?')) {
                    canvasRef.current?.clearCanvas();
                  }
                }}
                style={{
                  padding: '0.75rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                }}
              >
                🗑️ Clear Canvas
              </button>
            </div>

            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Data Structure Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dataStructures.map((ds) => {
                const Icon = ds.icon;
                return (
                  <button
                    key={ds.id}
                    onClick={() => insertTemplate(ds.id)}
                    style={{
                      padding: '0.75rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = ds.color;
                      e.currentTarget.style.borderColor = ds.color;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#111827';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {ds.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.5rem',
              color: 'white'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                💡 Quick Tips
              </h4>
              <ul style={{ fontSize: '0.75rem', lineHeight: '1.6', paddingLeft: '1.25rem', margin: 0 }}>
                <li>Draw diagrams on canvas</li>
                <li>Use templates for quick start</li>
                <li>Set timer for mock interviews</li>
                <li>Save your session</li>
              </ul>
            </div>
          </div>
        </div>
        )}

        {/* Center - Canvas */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          position: 'relative'
        }}>
          <div style={{
            padding: '0.75rem 1rem',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Drawing Canvas - Visualize Data Structures
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  padding: '0.5rem 1rem',
                  background: isFullscreen ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
                  color: isFullscreen ? 'white' : '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isFullscreen) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFullscreen) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </button>
              <button
                onClick={() => setShowCodePanel(!showCodePanel)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                <Code size={16} />
                {showCodePanel ? 'Hide' : 'Show'} Code
              </button>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Canvas
              ref={canvasRef}
              tool={tool}
              color={color}
              brushSize={brushSize}
              onDrawing={() => {}}
              onSave={() => {}}
            />
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        {showCodePanel && !isFullscreen && (
          <div style={{
            width: '500px',
            background: '#1e1e1e',
            borderLeft: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: '#2d2d2d',
              borderBottom: '1px solid #3e3e3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '0.5rem',
                  background: '#3e3e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Code Editor
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem',
                background: '#1e1e1e',
                color: '#d4d4d4',
                border: 'none',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Notes Panel */}
        {showNotes && !isFullscreen && (
          <div style={{
            width: '350px',
            background: 'white',
            borderLeft: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                Interview Notes
              </h3>
              <button
                onClick={() => setShowNotes(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ×
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes during your interview practice...&#10;&#10;• Key points&#10;• Edge cases&#10;• Time complexity&#10;• Space complexity"
              style={{
                flex: 1,
                padding: '1rem',
                background: 'white',
                color: '#111827',
                border: 'none',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewBoard;

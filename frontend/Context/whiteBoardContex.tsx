import React, { useEffect, useRef, useState, createContext, ReactNode, useContext, RefObject } from 'react';
import * as fabric from 'fabric'; // Changed import syntax
import { Socket, io } from 'socket.io-client';
import { CanvasData, NewSlideData, Slide, SlideChangeData, WhiteBoardContextProps } from '@/types/whiteBoard.types';


const WhiteBoardContext = createContext<undefined | WhiteBoardContextProps>(undefined)


export const WhiteBoardProvider = ({ children }: { children: ReactNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentMode, setCurrentMode] = useState<string>('pencil');
    const [currentColor, setCurrentColor] = useState<string>('#000000');
    const [brushSize, setBrushSize] = useState<number>(5);

    // Slide management
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

    // Initialize canvas and socket connection
    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Fabric canvas
        const parent = canvasRef?.current?.parentElement;
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            width: parent?.clientWidth || 0, // Fallback to 0 if undefined
            height: parent?.clientHeight || 0,
            backgroundColor: '#ffffff'
        });
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = currentColor;
        fabricCanvas.freeDrawingBrush.width = brushSize;

        // Set initial brush settings
        if (fabricCanvas.freeDrawingBrush) {
            fabricCanvas.freeDrawingBrush.color = currentColor;
            fabricCanvas.freeDrawingBrush.width = brushSize;
        }

        setCanvas(fabricCanvas)

        // Initialize Socket.IO connection
        const socketConnection = io('http://localhost:3001');
        setSocket(socketConnection);

        // Initialize first slide
        setSlides([{ id: 0, content: JSON.stringify(fabricCanvas) }]);

        // Handle canvas resize on window resize
        const handleResize = () => {
            console.log('resinng')
            fabricCanvas.setDimensions({
                width: parent?.clientWidth,
                height: parent?.clientHeight
            });
        };
        const resizeObserver = new ResizeObserver((entries) => {
            if (!parent) return;
            const { width, height } = entries[0].contentRect;
            fabricCanvas.setDimensions({ width, height });
        });

        if (parent) {
            resizeObserver.observe(parent)
        }

        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            fabricCanvas.dispose();
            socketConnection.disconnect();
            window.removeEventListener('resize', handleResize);
            if (parent) {
                resizeObserver.unobserve(parent);
            }
            resizeObserver.disconnect();
        };
    }, []);

    // Set up socket event listeners
    useEffect(() => {
        if (!socket || !canvas) return;

        // Listen for drawing events from other users
        socket.on('canvas-data', (data: CanvasData) => {
            if (data.slideIndex === currentSlideIndex) {
                // Prevent triggering our own path events
                canvas.off('path:created');

                canvas.loadFromJSON(data.canvasData, canvas.renderAll.bind(canvas));

                // Re-bind the path created event
                setupCanvasEventListeners();

                // Update our local slide data
                updateSlideContent(data.canvasData);
            }
        });

        // Listen for slide creation
        socket.on('new-slide', (data: NewSlideData) => {
            setSlides(prevSlides => {
                // Check if we already have this slide
                if (!prevSlides.find(slide => slide.id === data.id)) {
                    return [...prevSlides, { id: data.id, content: data.content }];
                }
                return prevSlides;
            });
        });

        // Listen for slide changes
        socket.on('slide-change', (data: SlideChangeData) => {
            // Only change slides if it's a different user changing slides
            if (data.initiator !== socket.id) {
                navigateToSlide(data.slideIndex);
            }
        });

        // Set up initial canvas event listeners
        setupCanvasEventListeners();

        return () => {
            socket.off('canvas-data');
            socket.off('new-slide');
            socket.off('slide-change');
        };
    }, [socket, canvas, currentSlideIndex]);

    useEffect(()=>{
        toggleDrawingMode(currentMode)
    },[currentColor])

    

    const deleteSelected = (): void => {
        if (!canvas) return;
      
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject(); // Clear selection
          canvas.renderAll();
      
          const jsonData = JSON.stringify(canvas);
          updateSlideContent(jsonData);
          socket?.emit('canvas-data', {
            slideIndex: currentSlideIndex,
            canvasData: jsonData,
          });
        }
      };

    // Setup canvas event listeners
    const setupCanvasEventListeners = (): void => {
        if (!canvas) return;

        // Clear existing listeners
        canvas.off('path:created');
        canvas.off('object:modified');

        // Emit drawing events to other users
        canvas.on('path:created', () => {
            const jsonData = JSON.stringify(canvas);
            updateSlideContent(jsonData);
            socket?.emit('canvas-data', {
                slideIndex: currentSlideIndex,
                canvasData: jsonData
            });
        });

        // Object modified events (resize, rotation, etc.)
        canvas.on('object:modified', () => {
            const jsonData = JSON.stringify(canvas);
            updateSlideContent(jsonData);
            socket?.emit('canvas-data', {
                slideIndex: currentSlideIndex,
                canvasData: jsonData
            });
        });
    };

    // Update slide content
    const updateSlideContent = (content: string): void => {
        setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            newSlides[currentSlideIndex] = {
                ...newSlides[currentSlideIndex],
                content: content
            };
            return newSlides;
        });
    };

    // Create a new slide
    // const createNewSlide = (): void => {
    //     if (!canvas) return;

    //     // Create a blank canvas for new slide
    //     const blankCanvas = new fabric.Canvas(document.createElement('canvas'), {
    //         width: canvas.width,
    //         height: canvas.height,
    //         backgroundColor: '#ffffff'
    //     });


    //     const newSlideId = slides.length;
    //     const newSlideContent = JSON.stringify(blankCanvas);

    //     // Add new slide to state
    //     setSlides(prevSlides => [
    //         ...prevSlides,
    //         { id: newSlideId, content: newSlideContent }
    //     ]);

    //     // Notify other users about new slide
    //     socket?.emit('new-slide', {
    //         id: newSlideId,
    //         content: newSlideContent
    //     });

    //     // Navigate to the new slide
    //     navigateToSlide(newSlideId);

    //     // Clean up temp canvas
    //     blankCanvas.dispose();
    // };
    const createNewSlide = (): void => {
        if (!canvas) return;

        // Create a blank canvas for new slide
        const blankCanvas = new fabric.Canvas(document.createElement('canvas'), {
            isDrawingMode: true,
            width: canvas.width,
            height: canvas.height,
            backgroundColor: '#ffffff'
        });

        blankCanvas.renderAll();


        const newSlideId = slides.length;
        const newSlideContent = JSON.stringify(blankCanvas);

        // Add new slide to state
        setSlides(prevSlides => [
            ...prevSlides,
            { id: newSlideId, content: newSlideContent }
        ]);

        // Notify other users about new slide
        socket?.emit('new-slide', {
            id: newSlideId,
            content: newSlideContent
        });

        // Navigate to the new slide
        navigateToSlide(newSlideId);

        // Clean up temp canvas
        blankCanvas.dispose();
    };

   
    const navigateToSlide = (slideIndex: number): void => {
        if (slideIndex < 0 || slideIndex >= slides.length || !canvas) return;
      
        // Save current slide's content before switching
        if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
          const currentContent = JSON.stringify(canvas.toJSON()); // Use toJSON for full state
          console.log('Saving slide', currentSlideIndex, 'with content:', currentContent); // Debug
          updateSlideContent(currentContent);
        }
      
        // Clear the canvas before loading new content
        canvas.clear();
        canvas.backgroundColor = '#ffffff'; // Reset background
      
        // Load the target slide's content
        if (slides[slideIndex] && slides[slideIndex].content) {
          console.log('Loading slide', slideIndex, 'with content:', slides[slideIndex].content); // Debug
          canvas.loadFromJSON(slides[slideIndex].content, () => {
            canvas.backgroundColor = '#ffffff'; // Ensure background is set
            canvas.renderAll(); // Render immediately
            requestAnimationFrame(() => {
              canvas.renderAll(); // Extra render for safety
            });
          });
        } else {
          console.warn('No content found for slide', slideIndex); // Debug
        }
      
        // Update current slide index
        setCurrentSlideIndex(slideIndex);
      
        // Notify other users about slide change
        socket?.emit('slide-change', {
          slideIndex: slideIndex,
          initiator: socket.id,
        });
      };
    // Handle slide navigation
    const prevSlide = (): void => {
        navigateToSlide(currentSlideIndex - 1);
    };

    const nextSlide = (): void => {
        navigateToSlide(currentSlideIndex + 1);
    };

    // Handle color change
    const handleColorChange = (color: string): void => {
        setCurrentColor(color);
        if (canvas) {
            // Check if there's a selected object
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
              activeObject.set('fill', color); // Change the fill color of the selected object
              canvas.renderAll(); // Re-render the canvas to show the change
              const jsonData = JSON.stringify(canvas);
              updateSlideContent(jsonData);
              socket?.emit('canvas-data', {
                slideIndex: currentSlideIndex,
                canvasData: jsonData,
              });
              
            } else if (canvas.freeDrawingBrush) {
              // If no object is selected, update the pencil brush color
              canvas.freeDrawingBrush.color = color;
            }
          }
          
    };

    // Handle brush size change
    const handleBrushSizeChange = (size: number): void => {
        setBrushSize(size);
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = size;
        }
    }

    const toggleDrawingMode = (mode: string): void => {
        setCurrentMode(mode);
        if (!canvas) return;
      
        // Clear any existing mouse:down listeners to avoid duplicates
        canvas.off('mouse:down');
      
        switch (mode) {
          case 'pencil':
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = currentColor;
            canvas.freeDrawingBrush.width = brushSize;
            break;
          case 'rectangle':
            canvas.isDrawingMode = false;
            let rect: fabric.Rect | null = null;
            let startX: number, startY: number;
      
            canvas.on('mouse:down', (e) => {
              // Check if an object is already selected
              if (canvas.getActiveObject()) return;
      
              const pointer = canvas.getPointer(e.e);
              startX = pointer.x;
              startY = pointer.y;
              console.log(currentColor)
              rect = new fabric.Rect({
                left: startX,
                top: startY,
                width: 0,
                height: 0,
                fill: currentColor,
                selectable: true,
              });
              canvas.add(rect);
              canvas.renderAll();
            });
      
            canvas.on('mouse:move', (e) => {
              if (!rect) return;
              const pointer = canvas.getPointer(e.e);
              const width = pointer.x - startX;
              const height = pointer.y - startY;
      
              // Adjust position if dragging left/up to avoid negative dimensions
              rect.set({
                width: Math.abs(width),
                height: Math.abs(height),
                left: width < 0 ? startX + width : startX,
                top: height < 0 ? startY + height : startY,
              });
              canvas.renderAll();
            });
      
            canvas.on('mouse:up', () => {
              if (rect) {
                canvas.setActiveObject(rect); // Make it selectable
                const jsonData = JSON.stringify(canvas);
                updateSlideContent(jsonData);
                socket?.emit('canvas-data', {
                  slideIndex: currentSlideIndex,
                  canvasData: jsonData,
                });
                rect = null; // Reset to allow new rectangle after deselection
              }
            });
            break;
          case 'circle':
            canvas.isDrawingMode = false;
            let circle: fabric.Circle | null = null;
            let circleStartX: number, circleStartY: number;
      
            canvas.on('mouse:down', (e) => {
              if (canvas.getActiveObject()) return; // Prevent new shape if one is selected
              const pointer = canvas.getPointer(e.e);
              circleStartX = pointer.x;
              circleStartY = pointer.y;
      
              circle = new fabric.Circle({
                left: circleStartX,
                top: circleStartY,
                radius: 0,
                fill: currentColor,
                selectable: true,
              });
              canvas.add(circle);
              canvas.renderAll();
            });
      
            canvas.on('mouse:move', (e) => {
              if (!circle) return;
              const pointer = canvas.getPointer(e.e);
              const dx = pointer.x - circleStartX;
              const dy = pointer.y - circleStartY;
              const radius = Math.sqrt(dx * dx + dy * dy) / 2; // Radius based on drag distance
      
              circle.set({
                radius: radius,
                left: circleStartX - radius, // Center the circle
                top: circleStartY - radius,
              });
              canvas.renderAll();
            });
      
            canvas.on('mouse:up', () => {
              if (circle) {
                canvas.setActiveObject(circle);
                const jsonData = JSON.stringify(canvas);
                updateSlideContent(jsonData);
                socket?.emit('canvas-data', {
                  slideIndex: currentSlideIndex,
                  canvasData: jsonData,
                });
                circle = null;
              }
            });
          case 'select':
            canvas.isDrawingMode = false;
            break;
          default:
            canvas.isDrawingMode = true;
        }
      };

   
    const addShape = (type: string, x: number, y: number): void => {
        if (!canvas || canvas.isDrawingMode) return;
      
        let shape: fabric.Rect | fabric.Circle;
        switch (type) {
          case 'rectangle':
            shape = new fabric.Rect({
              left: x,
              top: y,
              fill: currentColor,
              width: 100,
              height: 100,
            });
            break;
          case 'circle':
            shape = new fabric.Circle({
              left: x,
              top: y,
              fill: currentColor,
              radius: 50,
            });
            break;
          default:
            return;
        }
      
        canvas.add(shape);
        canvas.setActiveObject(shape);
      
        const jsonData = JSON.stringify(canvas);
        updateSlideContent(jsonData);
        socket?.emit('canvas-data', {
          slideIndex: currentSlideIndex,
          canvasData: jsonData,
        });
      };

    // Clear current slide
    const clearCurrentSlide = (): void => {
        if (!canvas) return;

        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();

        const jsonData = JSON.stringify(canvas);
        updateSlideContent(jsonData);
        socket?.emit('canvas-data', {
            slideIndex: currentSlideIndex,
            canvasData: jsonData
        });
    };

    const value: WhiteBoardContextProps = {
        clearCurrentSlide,
        addShape,
        toggleDrawingMode,
        handleBrushSizeChange,
        handleColorChange,
        createNewSlide,
        nextSlide,
        prevSlide,
        navigateToSlide,
        deleteSelected,
        currentMode,
        currentColor,
        brushSize,
        canvas,
        canvasRef,
        currentSlideIndex,
        slides
    }


    return <WhiteBoardContext.Provider value={value}> {children}</WhiteBoardContext.Provider>

}
export const useWhiteBoard = () => {
    const context = useContext(WhiteBoardContext);
    if (!context) {
        throw new Error('useWhiteBoard must be used within a WhiteBoardProvider');
    }
    return context;
}
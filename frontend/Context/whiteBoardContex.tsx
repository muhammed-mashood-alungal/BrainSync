import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  ReactNode,
  useContext,
  RefObject,
} from "react";
import * as fabric from "fabric";
import {
  CanvasData,
  NewSlideData,
  Slide,
  WhiteBoardContextProps,
} from "@/types/whiteBoard.types";
import { useSocket } from "./socket.context";
import { useAuth } from "./auth.context";

const WhiteBoardContext = createContext<undefined | WhiteBoardContextProps>(
  undefined
);

export const WhiteBoardProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [currentMode, setCurrentMode] = useState<string>("pencil");
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState("");
  const [brushSize, setBrushSize] = useState<number>(5);
  const { socket } = useSocket();

  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!canvasRef.current) return;

    
    const parent = canvasRef?.current?.parentElement;
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: parent?.clientWidth || 0,
      height: parent?.clientHeight || 0,
    });
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = currentColor;
    fabricCanvas.freeDrawingBrush.width = brushSize;

    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = currentColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }

    setCanvas(fabricCanvas);

    socket?.emit("whiteboard-joins", { roomId });

    setSlides([{ id: 0, content: JSON.stringify(fabricCanvas.toJSON()) }]);

    const handleResize = () => {
      fabricCanvas.setDimensions({
        width: parent?.clientWidth,
        height: parent?.clientHeight,
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!parent) return;
      const { width, height } = entries[0].contentRect;
      fabricCanvas.setDimensions({ width, height });
    });

    if (parent) {
      resizeObserver.observe(parent);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      fabricCanvas.dispose();
      socket?.disconnect();
      window.removeEventListener("resize", handleResize);
      if (parent) {
        resizeObserver.unobserve(parent);
      }
      resizeObserver.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket || !canvas) return;

    socket.on("canvas-data", (data: CanvasData) => {
      if (!data || typeof data.slideIndex === "undefined" || !data.canvasData) {
        console.error("Invalid canvas-data format:", data);
        return;
      }

      if (data.slideIndex === currentSlideIndex) {
        try {
          canvas.off("path:created");
          const parsedData = JSON.parse(data.canvasData);

          canvas.loadFromJSON(parsedData, () => {
            canvas.renderAll();
            requestAnimationFrame(() => {
              canvas.renderAll();
            });
          });

          setupCanvasEventListeners();
          updateSlideContent(data.canvasData);
        } catch (error) {
          console.error("Error updating canvas:", error);
        }
      } else {
        setSlides((prevSlides) => {
          const newSlides = [...prevSlides];
          newSlides[data.slideIndex] = {
            ...newSlides[currentSlideIndex],
            content: data.canvasData,
          };
          return newSlides;
        });
      }
    });

    socket.on("new-slide", (data: NewSlideData) => {
      setSlides((prevSlides) => {
        if (!prevSlides.find((slide) => slide.id === data.id)) {
          return [...prevSlides, { id: data.id, content: data.content }];
        }
        return prevSlides;
      });
    });


    socket.on("board-locked", (lockedBy) => {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.skipTargetFind = true; 
      canvas.defaultCursor = "not-allowed";
      canvas.hoverCursor = "not-allowed";

      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false; 
      });
      setIsLocked(true);
      setLockedBy(lockedBy);
    });

    socket.on("board-unlocked", () => {
      canvas.isDrawingMode = true;
      canvas.selection = true;
      canvas.forEachObject((obj) => (obj.selectable = true));
      canvas.renderAll();
      setIsLocked(false);
      setLockedBy("");
    });

    setupCanvasEventListeners();

    return () => {
      socket.off("canvas-data");
      socket.off("new-slide");
      socket.off("slide-change");
      socket.off("board-locked");
      socket.off("board-unlocked");
    };
  }, [socket, canvas, currentSlideIndex]);

  useEffect(() => {
    toggleDrawingMode(currentMode);
  }, [currentColor]);

  const lockBoard = () => {
    setIsLocked(true);
    setLockedBy(user?.email as string);
    socket?.emit("board-locked", { roomId, lockedBy: user?.email as string });
  };

  const unlockBoard = () => {
    let usr = user?.email as string;
    if (usr != lockedBy) {
      return;
    }
    setIsLocked(false);
    setLockedBy("");
    socket?.emit("board-unlocked", { roomId });
  };

  const deleteSelected = (): void => {
    if (!canvas || isLocked) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();

      const jsonData = JSON.stringify(canvas.toJSON());
      updateSlideContent(jsonData);
      socket?.emit("canvas-data", {
        roomId: roomId,
        slideIndex: currentSlideIndex,
        canvasData: jsonData,
      });
    }
  };

  const setupCanvasEventListeners = (): void => {
    if (!canvas || (isLocked && lockedBy != user?.email)) return;

    canvas.off("path:created");
    canvas.off("object:modified");

    canvas.on("path:created", () => {
      if (isLocked && lockedBy != user?.email) return;
      const jsonData = JSON.stringify(canvas.toJSON());
      updateSlideContent(jsonData);
      socket?.emit("canvas-data", {
        roomId: roomId,
        slideIndex: currentSlideIndex,
        canvasData: jsonData,
      });
    });

    canvas.on("object:modified", () => {
      if (isLocked && lockedBy != user?.email) return;
      const jsonData = JSON.stringify(canvas.toJSON());
      updateSlideContent(jsonData);
      socket?.emit("canvas-data", {
        roomId: roomId,
        slideIndex: currentSlideIndex,
        canvasData: jsonData,
      });
    });
  };

  const updateSlideContent = (content: string): void => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[currentSlideIndex] = {
        ...newSlides[currentSlideIndex],
        content: content,
      };
      return newSlides;
    });
  };

  const createNewSlide = (): void => {
    if (!canvas || (isLocked && lockedBy != user?.email)) return;

    const blankCanvas = new fabric.Canvas(document.createElement("canvas"), {
      isDrawingMode: true,
      width: canvas.width,
      height: canvas.height,
      backgroundColor: "#ffffff",
    });

    blankCanvas.renderAll();

    const newSlideId = slides.length;
    const newSlideContent = JSON.stringify(blankCanvas);

    setSlides((prevSlides) => [
      ...prevSlides,
      { id: newSlideId, content: newSlideContent },
    ]);

    socket?.emit("new-slide", {
      roomId: roomId,
      id: newSlideId,
      content: newSlideContent,
      index: newSlideId,
    });

    navigateToSlide(newSlideId);

    blankCanvas.dispose();
  };

  const navigateToSlide = (slideIndex: number): void => {
    if (slideIndex < 0 || slideIndex >= slides.length || !canvas) return;

    if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
      const currentContent = JSON.stringify(canvas.toJSON());
      updateSlideContent(currentContent);
    }

    canvas.clear();
    canvas.backgroundColor = "#ffffff";

    if (slides[slideIndex] && slides[slideIndex].content) {
      canvas.loadFromJSON(slides[slideIndex].content, () => {
        canvas.backgroundColor = "#ffffff";
        canvas.renderAll();
        requestAnimationFrame(() => {
          canvas.renderAll();
        });
      });
    } else {
      console.warn("No content found for slide", slideIndex);
    }

    setCurrentSlideIndex(slideIndex);

    socket?.emit("slide-change", {
      roomId: roomId,
      slideIndex: slideIndex,
      initiator: socket.id,
      content: slides[slideIndex].content,
    });
  };

  const prevSlide = (): void => {
    navigateToSlide(currentSlideIndex - 1);
  };

  const nextSlide = (): void => {
    navigateToSlide(currentSlideIndex + 1);
  };

  const handleColorChange = (color: string): void => {
    setCurrentColor(color);
    if (isLocked) return;

    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("fill", color);
        canvas.renderAll();
        const jsonData = JSON.stringify(canvas.toJSON());
        updateSlideContent(jsonData);
        socket?.emit("canvas-data", {
          roomId: roomId,
          slideIndex: currentSlideIndex,
          canvasData: jsonData,
        });
      } else if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
      }
    }
  };

  
  const handleBrushSizeChange = (size: number): void => {
    setBrushSize(size);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  const toggleDrawingMode = (mode: string): void => {
    setCurrentMode(mode);
    if (!canvas || isLocked) return;

    canvas.off("mouse:down");

    switch (mode) {
      case "pencil":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = currentColor;
        canvas.freeDrawingBrush.width = brushSize;
        break;
      case "rectangle":
        canvas.isDrawingMode = false;
        let rect: fabric.Rect | null = null;
        let startX: number, startY: number;

        canvas.on("mouse:down", (e) => {
          if (canvas.getActiveObject()) return;

          const pointer = canvas.getPointer(e.e);
          startX = pointer.x;
          startY = pointer.y;
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

        canvas.on("mouse:move", (e) => {
          if (!rect) return;
          const pointer = canvas.getPointer(e.e);
          const width = pointer.x - startX;
          const height = pointer.y - startY;

         
          rect.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width < 0 ? startX + width : startX,
            top: height < 0 ? startY + height : startY,
          });
          canvas.renderAll();
        });

        canvas.on("mouse:up", () => {
          if (rect) {
            canvas.setActiveObject(rect);
            const jsonData = JSON.stringify(canvas.toJSON());
            updateSlideContent(jsonData);
            socket?.emit("canvas-data", {
              roomId: roomId,
              slideIndex: currentSlideIndex,
              canvasData: jsonData,
            });
            rect = null;
          }
        });
        break;
      case "circle":
        canvas.isDrawingMode = false;
        let circle: fabric.Circle | null = null;
        let circleStartX: number, circleStartY: number;

        canvas.on("mouse:down", (e) => {
          if (canvas.getActiveObject()) return;
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

        canvas.on("mouse:move", (e) => {
          if (!circle) return;
          const pointer = canvas.getPointer(e.e);
          const dx = pointer.x - circleStartX;
          const dy = pointer.y - circleStartY;
          const radius = Math.sqrt(dx * dx + dy * dy) / 2; 

          circle.set({
            radius: radius,
            left: circleStartX - radius,
            top: circleStartY - radius,
          });
          canvas.renderAll();
        });

        canvas.on("mouse:up", () => {
          if (circle) {
            canvas.setActiveObject(circle);
            const jsonData = JSON.stringify(canvas.toJSON());
            updateSlideContent(jsonData);
            socket?.emit("canvas-data", {
              roomId: roomId,
              slideIndex: currentSlideIndex,
              canvasData: jsonData,
            });
            circle = null;
          }
        });
      case "select":
        canvas.isDrawingMode = false;
        break;
      default:
        canvas.isDrawingMode = true;
    }
  };

  const addShape = (type: string, x: number, y: number): void => {
    if (!canvas || canvas.isDrawingMode || isLocked) return;
    let shape: fabric.Rect | fabric.Circle;
    switch (type) {
      case "rectangle":
        shape = new fabric.Rect({
          left: x,
          top: y,
          fill: currentColor,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
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

    const jsonData = JSON.stringify(canvas.toJSON());
    updateSlideContent(jsonData);
    socket?.emit("canvas-data", {
      roomId: roomId,
      slideIndex: currentSlideIndex,
      canvasData: jsonData,
    });
  };

  
  const clearCurrentSlide = (): void => {
    if (!canvas || isLocked) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();

    const jsonData = JSON.stringify(canvas.toJSON());
    updateSlideContent(jsonData);
    socket?.emit("canvas-data", {
      roomId: roomId,
      slideIndex: currentSlideIndex,
      canvasData: jsonData,
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
    lockBoard,
    unlockBoard,
    isLocked,
    currentMode,
    currentColor,
    brushSize,
    canvas,
    canvasRef,
    currentSlideIndex,
    slides,
  };

  return (
    <WhiteBoardContext.Provider value={value}>
      {" "}
      {children}
    </WhiteBoardContext.Provider>
  );
};
export const useWhiteBoard = () => {
  const context = useContext(WhiteBoardContext);
  if (!context) {
    throw new Error("useWhiteBoard must be used within a WhiteBoardProvider");
  }
  return context;
};

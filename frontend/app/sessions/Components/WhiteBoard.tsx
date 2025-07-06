"use client";

import { useWhiteBoard } from "@/context/whiteBoardContex";
import { Slide } from "@/types/whiteBoard.types";
import {
  faCircle,
  faPencil,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Lock, LockOpen } from "lucide-react";

const WhiteboardWithSlides: React.FC = () => {
  const {
    toggleDrawingMode,
    currentMode,
    handleColorChange,
    clearCurrentSlide,
    deleteSelected,
    currentColor,
    handleBrushSizeChange,
    brushSize,
    canvasRef,
    createNewSlide,
    currentSlideIndex,
    nextSlide,
    prevSlide,
    slides,
    navigateToSlide,
    isLocked,
    lockBoard,
    unlockBoard,
  } = useWhiteBoard();

  return (
    <div className="h-full w-full flex flex-col items-center   rounded-lg border border-cyan-500 p-2 gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 p-2 bg-gray-100 rounded-md absolute z-10 m-2 shadow-md">
        {/* Drawing tools */}

        <div className="mt-2">
          {isLocked ? (
            <Lock onClick={unlockBoard} color="black" />
          ) : (
            <LockOpen onClick={lockBoard} color="black" />
          )}
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 h-10  border border-gray-300 text-cyan-500 rounded-md cursor-pointer ${
              currentMode === "pencil"
                ? "bg-gray-200 border-gray-400"
                : "bg-white"
            }`}
            onClick={() => toggleDrawingMode("pencil")}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            className={`px-4 py-2  h-10 border border-gray-300  text-cyan-500 rounded-md cursor-pointer ${
              currentMode === "rectangle"
                ? "bg-gray-200 border-gray-400"
                : "bg-white"
            }`}
            onClick={() => {
              toggleDrawingMode("rectangle");
              if (currentMode === "rectangle") {
                // addShape('rectangle');
              }
            }}
          >
            <FontAwesomeIcon icon={faSquare} />
          </button>
          <button
            className={`px-4 py-2 h-10 border border-gray-300  text-cyan-500 rounded-md cursor-pointer ${
              currentMode === "circle"
                ? "bg-gray-200 border-gray-400"
                : "bg-white"
            }`}
            onClick={() => {
              toggleDrawingMode("circle");
              if (currentMode === "circle") {
                // addShape('circle');
              }
            }}
          >
            <FontAwesomeIcon icon={faCircle} />
          </button>
          <button
            className={`px-4 py-2 h-10 border border-gray-300 text-cyan-500 rounded-md cursor-pointer ${
              currentMode === "select"
                ? "bg-gray-200 border-gray-400"
                : "bg-white"
            }`}
            onClick={() => toggleDrawingMode("select")}
          >
            Select
          </button>
        </div>
        <div className="flex">
          {/* Color picker */}
          <div className="flex items-center">
            <input
              type="color"
              value={currentColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleColorChange(e.target.value)
              }
              className="h-7 w-7 cursor-pointer rounded-4xl  "
            />
          </div>

          {/* Brush size */}
          <div className="flex items-center">
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleBrushSizeChange(parseInt(e.target.value))
              }
              className="w-32 h-6"
            />
          </div>
        </div>

        {/* Clear button */}
        <button
          onClick={clearCurrentSlide}
          className="px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 h-10"
        >
          Clear Board
        </button>
        <button
          onClick={deleteSelected}
          className="px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 h-10"
        >
          Remove
        </button>

        <div className="flex  gap-4   rounded-md">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-4 py-2 h-10  border border-gray-700 text-gray-700 rounded-md ${
              currentSlideIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer bg-white"
            }`}
          >
            Previous Slide
          </button>
          <div className="flex items-center justify-center ">
            <span className="font-bold text-gray-800 md:text-sm text-center">
              Slide: <br />
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className={`px-4 py-2 border border-gray-700 text-gray-700  rounded-md ${
              currentSlideIndex === slides.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer bg-white"
            }`}
          >
            Next Slide
          </button>
          <button
            onClick={createNewSlide}
            className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            New Slide
          </button>
        </div>
      </div>

      {/* Slide controls */}

      {/* Canvas container */}
      <div className="flex-1 w-full overflow-hidden rounded-md border border-gray-300 bg-gray-100">
        <div className="h-full w-full relative bg-gray-100">
          <canvas
            ref={canvasRef}
            id="fabric-canvas"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Slide thumbnails */}
      <div className="w-full p-1  rounded-md overflow-x-auto">
        <div className="flex gap-2 ">
          {slides.map((slide: Slide, index: number) => (
            <div
              key={slide.id}
              className={`min-w-24 h-10 flex items-center justify-center border ${
                index === currentSlideIndex
                  ? "border-cyan-500 bg-gray-100 text-cyan-700 "
                  : "border-cyan-500  text-cyan-200"
              } rounded-md cursor-pointer relative z-10`}
              onClick={() => navigateToSlide(index)}
            >
              Slide {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardWithSlides;

import { RefObject } from "react";
import * as fabric from 'fabric'; 
export interface Slide {
    id: number;
    content: string;
}

export interface CanvasData {
    slideIndex: number;
    canvasData: string;
}

export interface SlideChangeData {
    slideIndex: number;
    initiator: string;
}

export interface NewSlideData {
    id: number;
    content: string;
}
export interface WhiteBoardContextProps {
    clearCurrentSlide: () => void,
    addShape: (type: string , x: number , y: number) => void,
    toggleDrawingMode: (mode: string) => void,
    handleBrushSizeChange: (size: number) => void,
    handleColorChange: (color: string) => void,
    createNewSlide: () => void,
    nextSlide: () => void,
    prevSlide: () => void,
    lockBoard : ()=>void,
    unlockBoard: ()=>void,
    isLocked:boolean,
    currentMode: string,
    currentColor: string,
    canvasRef:RefObject<HTMLCanvasElement | null>
    brushSize: number,
    canvas: fabric.Canvas | null,
    slides: Slide[],
    currentSlideIndex : number,
    navigateToSlide : (slideIndex : number)=>void
    deleteSelected : ()=>void

}

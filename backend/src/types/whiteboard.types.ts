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

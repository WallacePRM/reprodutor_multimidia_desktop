export type AnimationsProps = {
    
    className?: string;
    cssAnimation: string[];
    style?: {};
    ref?: any;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
    onClick?: React.ReactEventHandler;
    onMouseDown?: React.ReactEventHandler;
    onMouseUp?: React.ReactEventHandler;
    onMouseLeave?: React.ReactEventHandler;
    onMouseEnter?: React.ReactEventHandler;
    onContextMenu?: React.ReactEventHandler;
    children: React.ReactNode;
};

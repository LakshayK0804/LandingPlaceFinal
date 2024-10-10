import { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { MOVEMENT } from './models';
declare const _default: <T>({ data, debounce, listWidth, propsItemHeight, numColumns, shouldAnimOnRelease, onOrderChanged, onMovingStateChanged, propsOnLayout, propsOnContentSizeChange, propsOnScroll }: {
    data: T[];
    debounce?: number | undefined;
    listWidth: number | undefined;
    propsItemHeight?: number | undefined;
    numColumns: number | undefined;
    shouldAnimOnRelease: boolean;
    onOrderChanged: (orderedData: T[], from: number, to: number) => void;
    onMovingStateChanged?: (isMoving: boolean) => void;
    propsOnLayout?: (event: LayoutChangeEvent) => void;
    propsOnContentSizeChange?: (w: number, h: number) => void;
    propsOnScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) => {
    isLock: boolean;
    isDragging: boolean;
    count: number;
    animDirectionArray: MOVEMENT[];
    isEnableScroll: boolean;
    itemWidth: number;
    itemHeight: number;
    sectionWidth: number;
    sectionHeight: number;
    listRef: import("react").MutableRefObject<ScrollView>;
    listLayoutRef: import("react").MutableRefObject<LayoutRectangle>;
    listContentHeightRef: import("react").MutableRefObject<number>;
    listOffsetYRef: import("react").MutableRefObject<number>;
    onLayout: (event: LayoutChangeEvent) => void;
    onContentSizeChange: (w: number, h: number) => void;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    startAnim: () => void;
    endAnim: () => void;
    onStartDrag: (index: number) => void;
    updateDragToIndex: (index: number | undefined) => void;
    onEndDrag: (from: number, to: number) => void;
};
export default _default;
//# sourceMappingURL=useDraggableGridViewHooks.d.ts.map
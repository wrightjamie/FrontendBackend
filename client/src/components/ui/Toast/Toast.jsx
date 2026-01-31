import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import styles from './Toast.module.css';

/**
 * Toast: Individual notification component with swipe-to-dismiss.
 * 
 * Performance Note: We use CSS variables for offset and opacity to keep 
 * the style attribute clean and centralized. Transitions are toggled
 * based on the 'dragging' state for 1:1 responsive feedback.
 */
const Toast = ({ id, message, type }) => {
    const { removeToast } = useToast();
    const [startX, setStartX] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const toastRef = useRef(null);

    const SWIPE_THRESHOLD = 100;

    const handleStart = (e) => {
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setIsDragging(true);
    };

    const handleMove = (e) => {
        if (startX === null) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const currentOffset = clientX - startX;

        // We only allow swiping to the right for an intuitive feel
        if (currentOffset > 0) {
            setOffsetX(currentOffset);
            setOpacity(Math.max(0, 1 - currentOffset / 300));
        }
    };

    const handleEnd = () => {
        if (startX === null) return;

        if (offsetX > SWIPE_THRESHOLD) {
            removeToast(id);
        } else {
            // Reset position
            setOffsetX(0);
            setOpacity(1);
        }
        setStartX(null);
        setIsDragging(false);
    };

    useEffect(() => {
        if (startX === null) return;

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [startX, offsetX]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div
            ref={toastRef}
            className={styles.toast}
            data-type={type}
            data-dragging={isDragging}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{
                '--offset-x': `${offsetX}px`,
                '--toast-opacity': opacity
            }}
        >
            <div className={styles.iconWrapper}>
                {getIcon()}
            </div>
            <span className={styles.message}>{message}</span>
            <button
                className={styles.closeBtn}
                aria-label="Close notification"
                onClick={(e) => {
                    e.stopPropagation();
                    removeToast(id);
                }}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;

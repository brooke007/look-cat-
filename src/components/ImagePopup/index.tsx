import React, { useState, useEffect } from 'react';
import './styles.css';

interface ImagePopupProps {
  text: string;
  images: string[];
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ text, images, ...props }) => {
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowImage(false);
      }
    };
    
    if (showImage) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [showImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).className === 'close-button') {
      return;
    }
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click handler triggered');
    
    if (!images || images.length === 0) {
      setError('没有可用的图片');
      return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected image:', randomImage);
    
    setIsLoading(true);
    setShowImage(true);
    setPosition({
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 150
    });

    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully');
      setSelectedImage(randomImage);
      setError(null);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', randomImage);
      setError('图片加载失败');
      setIsLoading(false);
    };
    
    img.src = randomImage;
  };

  return (
    <div className={props.className}>
      <span 
        className="clickable-text"
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {text}
      </span>

      {showImage && (
        <div 
          className="popup-image-container"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <button 
            className="close-button"
            onClick={() => setShowImage(false)}
          >
            ×
          </button>
          {error && <div className="error-message">{error}</div>}
          {selectedImage && (
            <img 
              src={`${process.env.REACT_APP_PUBLIC_URL}/images/7.jpg`}
              alt="Popup" 
              className="popup-image"
              style={{ 
                maxWidth: props.maxWidth || 300, 
                maxHeight: props.maxHeight || 300
              }}
              onError={() => {
                setError('图片加载失败');
                setIsLoading(false);
              }}
            />
          )}
          {isLoading && <div className="loading">加载中...</div>}
        </div>
      )}
    </div>
  );
};

export default ImagePopup;
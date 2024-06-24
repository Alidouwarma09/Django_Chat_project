import React from 'react';
import { IoMdClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import './css/imageviewer.css'

const ImageViewer = ({ imageSrc, onClose, onSave }) => {
    return (
        <div className="image-viewer-overlay" onClick={onClose}>
            <div className="image-viewer-container" onClick={(e) => e.stopPropagation()}>
                <button className="image-viewer-close" onClick={onClose}>
                    <IoMdClose size={24} />
                </button>
                <img src={imageSrc} alt="Full Screen" className="image-viewer-image" />
                <button className="image-viewer-save" onClick={onSave}>
                    <MdSaveAlt size={24} />
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;

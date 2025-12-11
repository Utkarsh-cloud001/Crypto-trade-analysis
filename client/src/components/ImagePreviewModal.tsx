import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import ReactDOM from 'react-dom';

interface ImagePreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

const ImagePreviewModal = ({ isOpen, imageUrl, onClose }: ImagePreviewModalProps) => {
    if (!isOpen || !imageUrl) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-full text-white transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="relative max-w-6xl max-h-[90vh] w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imageUrl}
                        alt="Trade Screenshot"
                        className="w-full h-full object-contain rounded-xl shadow-2xl"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default ImagePreviewModal;

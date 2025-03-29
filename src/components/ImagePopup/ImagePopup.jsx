import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import close_icon from '../../assets/images/close_icon.svg';
import placeholder_image from '../../assets/images/user_profile_round.svg';
import './ImagePopup.scss';

const ImagePopup = ({ image, header }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const hideModal = () => setIsImageModalOpen(false);
    const showModal = () => setIsImageModalOpen(true);

    return (
        <div className='image-popup-wrapper'>
            <img
                src={image || placeholder_image}
                onError={(e) => (e.target.src = placeholder_image)}
                onClick={(e) => {
                    e.stopPropagation()
                    showModal()
                }}
                alt="popup-img"

                className='profile-img'
            />

            <AnimatePresence>
                {isImageModalOpen && (
                    <>
                        <motion.div
                            className="image-backdrop"
                            onClick={(e) => {
                                e.stopPropagation()
                                hideModal()
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        <motion.div
                            className="image-wrapper"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <div className='header-section'>
                                <div className='header'>{header}</div>
                                <img
                                    className='close-icon'
                                    src={close_icon}
                                    alt="close-icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        hideModal()
                                    }}
                                />
                            </div>

                            <motion.img
                                className='zoom-img'
                                src={image || placeholder_image}
                                onError={(e) => (e.target.src = placeholder_image)}
                                alt="popup-img"
                                whileHover={{ scale: 1.05 }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImagePopup;

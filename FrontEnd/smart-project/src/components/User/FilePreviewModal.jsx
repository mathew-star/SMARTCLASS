import React from 'react';
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#172231',
    color: 'white',
    borderRadius: '10px',
    padding: '20px',
    width: '80%',
    height: '80%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const FilePreviewModal = ({ isOpen, onClose, file }) => {
  if (!file) return null;

  const isImage = file.file.match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="File Preview"
    >
      <div className="flex justify-end">
        <MdClose className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex justify-center items-center h-full">
        {isImage ? (
          <img src={file.file} alt="Preview" className="max-h-full max-w-full" />
        ) : (
          <iframe
            src={file.file}
            title="File Preview"
            className="w-full h-full"
          ></iframe>
        )}
      </div>
    </Modal>
  );
};

export default FilePreviewModal;

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
  const forceDownload = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="File Preview"
    >
      <div className="flex justify-between items-center">
        <MdClose className="cursor-pointer" onClick={onClose} />
        {isImage&&(
          <button
          onClick={() => forceDownload(file.file, file.file.split('/').pop())}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >Download </button>
        )}
      </div>
      <div className="flex justify-center items-center h-full">
        {isImage ? (
          <img src={file.file} alt="Preview" className="max-h-full max-w-full" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4">Preview not available. Click the button below to download the file.</p>
            <a
              href={file.file}
              target='_blank'
              download
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FilePreviewModal;

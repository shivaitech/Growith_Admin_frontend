import Icon from './Icon';

export default function Modal({ title, sub, onClose, children }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target.className.includes('modal-overlay')) onClose(); }}
    >
      <div className="modal animate-in">
        <button className="modal-close" onClick={onClose}>
          <Icon n="x" size={13} />
        </button>
        <div className="modal-title">{title}</div>
        {sub && <div className="modal-sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}

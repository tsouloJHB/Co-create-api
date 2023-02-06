
import './modal.css';


const Modal = ({ open, onClose, projectData, user}) =>{
    if (!open) return null;
   
  
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        
       
        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <p>{user && user.name}</p>
            <p>{projectData && projectData.projectName}</p>

            <p>{projectData && projectData.desc}</p>
          </div>
          <div className='btnContainer'>
        
          </div>
        </div>
      </div>
    </div>
    )
}

export default Modal;
import './removeModal.css'

export function RemoveModal({setIsRemovable, removeFunction, type}){
    function remove(){
        removeFunction()
        setIsRemovable(false)
    }
    function closeRemoveModal(e){
        if(e.target.className === 'modal-remove-close-container'){
            setIsRemovable(false)
        }
    }
    return (
        <div className="modal-remove-close-container" onClick={(e)=>closeRemoveModal(e)}>
            <div className="modal-remove-content-container">
                <h2>Вы действительно хотите удалить эту {type === 'card' ? 'карточку' :  type === 'workspace' ? 'рабочую область' : 'метку'}?</h2>
                <input value={"Отменить"} onClick={()=>setIsRemovable(false)} type="button"/>
                <input value={"Подтвердить"} onClick={()=>remove()} type="button"/>
            </div>
        </div>
    )
}
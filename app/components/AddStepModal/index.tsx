import {useState, useEffect, MouseEvent, useRef} from "react";

import { AddBtn } from "../AddBtn"
import Neo4j from "~/consumer/neo4j";
import { useNavigate } from "@remix-run/react";

export const AddStepModal = ({trail, onOutsideClick, active = false}: {trail: string|undefined, onOutsideClick: (event:MouseEvent)=>void, active:boolean}) => {
  const [toggle, setToggle] = useState('');
  //setToggle(active? 'active': '');

  const idRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  useEffect(()=>{
    setToggle(active ? 'active': '');
  },[active]);

  const handleAddStep = async (event:MouseEvent) => {
    event.preventDefault();
    if(trail && idRef.current){
      const result = await Neo4j.saveStep(trail, {id: idRef.current.value, title: titleRef.current!.value, content: contentRef.current!.value});
      console.log(result);
      if(!result)
        window.alert('Passo não foi salvo no banco.')
      else
        navigate(0);

    }
  }
  
  //cleans the fields and closes the modal.
  const handleCancel = (event:MouseEvent) => {
    event.preventDefault();
    if(idRef.current){
      idRef.current.value = '';
      titleRef.current!.value = '';
      contentRef.current!.value = '';
    }
    onOutsideClick(event);
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <section onClick={onOutsideClick} className={"add-step-bg "+toggle}>
      <form className="w-[680px] bg-white p-12 flex flex-col gap-10  rounded-3xl font-semibold">
        <h1 className="text-2xl font-semibold text-black">Adicionar passo</h1>
        <div className="flex flex-col">
          <label className="font-semibold text-sm text-[#4F4B5C] pl-1 pb-1" htmlFor="id">id</label>
          <input ref={idRef} className="modal-input"  type="text" name="id" id="id" />
          <label className="font-semibold text-sm text-[#4F4B5C] pl-1 pb-1" htmlFor="title">Título</label>
          <input ref={titleRef}className="modal-input" type="text" name="title" id="title" />

          <label className="font-semibold text-sm text-[#4F4B5C] pl-1 pb-1" htmlFor="title">Conteúdo</label>
          <textarea ref={contentRef} className="modal-input resize-none" rows={4} name="title" id="title" />
        </div>
        <div className="flex justify-end gap-6">
          <AddBtn callback={handleCancel} light={true}>Cancelar</AddBtn>
          <AddBtn callback={handleAddStep}>Criar passo</AddBtn>
        </div>
      </form>
    </section>
  )
}
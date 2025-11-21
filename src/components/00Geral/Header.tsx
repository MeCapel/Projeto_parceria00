import { useState } from "react";
import { Link } from "react-router";
import { Modal } from "react-bootstrap";
// import Notifications from "./Notifications";
import AccountSettings from "../01LoginRelated/AccountSettings";
import { GearFill, PersonCircle, Sliders2, ArrowUpRightCircleFill } from "react-bootstrap-icons";

// const notificationsList = [{id: 1, imgUrl: '/vite.svg', title: 'Username#1', subtitle: 2, description: 'Descrição'},
//                            {id: 2, imgUrl: '/vite.svg', title: 'Projeto#1', subtitle: 5, description: 'Descrição'},
//                            {id: 3, imgUrl: '/vite.svg', title: 'Username#2', subtitle: 3, description: 'Descrição'},
//                            {id: 4, imgUrl: '/vite.svg', title: 'Username#3', subtitle: 14, description: 'Descrição'},
//                            {id: 5, imgUrl: '/vite.svg', title: 'Projeto#2', subtitle: 20, description: 'Descrição'},
// ]

interface HeaderProps {
  sidebarWidth: number;
  hidden?: boolean;
}

export default function Header({ sidebarWidth, hidden = false }: HeaderProps) {
  const [openComponent, setOpenComponent] = useState<string | null>(null);

  if (hidden) return null;

  return (
    <header
      style={{ position: "fixed", top: 0, left: `${sidebarWidth}px`, right: 0 , zIndex: 2 }}
      className="showOrHide navbar navbar-light bg-white text-custom-black px-3 p-0 px-md-5 border-bottom border-secondary-subtle"
    >
      <Link to={"/home"}>
        <img height={30} src="/fromBrand/baldan-principal.png" alt="Logotipo da marca" />
      </Link>

      <div className="d-flex align-items-center py-2 gap-1 ms-auto">
        {/* <Notifications
          notificationsList={notificationsList}
          isOpen={openComponent === "notifications"}
          onOpen={() => setOpenComponent("notifications")}
          onClose={() => setOpenComponent(null)}
        /> */}

        {<Settings />}

        <AccountSettings
          isOpen={openComponent === "account"}
          onOpen={() => setOpenComponent("account")}
          onClose={() => setOpenComponent(null)}
        />
        
      </div>
    </header>
  );
}

function Settings()
{
  const [ show, setShow ] = useState<boolean>(false);

  return(
      <>
        <button className="d-flex align-items-center justify-content-center btn-custom"
                onClick={() => setShow(true)}>
          <GearFill size={25}/>
        </button>

        {show && (
          <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-custom" centered className='p-0'>
            {/* <Modal.Header closeButton className="m-3 border-0"></Modal.Header> */}
            <Modal.Body className="d-flex p-0">
              <div className="bg-body-tertiary p-4 rounded-start-3">
                <div className="d-flex flex-column gap-2 align-items-start">

                  <p className="my-2 text-custom-black fw-bold">Geral</p>

                  <button type="button" className="d-flex gap-3 align-items-center btn-custom py-1 btn-custom-link w-100">
                    <PersonCircle size={25}/>
                    <p className="mb-0 text-custom-black">Conta</p>
                  </button>

                  <button type="button" className="d-flex gap-3 align-items-center btn-custom py-1 btn-custom-link w-100">
                    <Sliders2 size={25}/>
                    <p className="mb-0 text-custom-black">Preferencias</p>
                  </button>

                  <button type="button" className="d-flex gap-3 align-items-center btn-custom py-1 btn-custom-link w-100">
                    <PersonCircle size={25}/>
                    <p className="mb-0 text-custom-black">Conta</p>
                  </button>

                </div>
              </div>

              <div className="w-100 p-5 d-flex flex-column gap-3">

                {/* {<Account/>} */}
                {<Invite />}

              </div>
            </Modal.Body>
          </Modal>
        )}
      </>
  )
}

// function Account()
// {
//   return(
//     <>
//       <div className="">
//       <h4 className="text-custom-black fw-bold">Configurações da conta</h4>
//         <hr/>
//       </div>

//       <div className="d-flex gap-4 align-items-center">
//         <div className="rounded-circle bg-custom-red00 d-flex align-items-center justify-content-center"
//               style={{ height: "90px", width: "90px" }}>
//           <img src="/vite.svg" alt="" className="img-fluid" />
//         </div>
//         <div className="d-flex flex-column gap-2">
//           <p className="text-custom-black fs-5 mb-0">Nome do usuário: </p>
//           <input type="text" placeholder="Seu username vai aqui" className="p-2 rounded-2 border bg-body-tertiary"
//                   style={{ outline: "none"}}/>
//         </div>
//       </div>

//       <div className="d-flex flex-column gap-4 align-items-center my-4">
//           <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex flex-column gap-2">
//               <p className="mb-0 fs-5 text-custom-black fw-semibold">Email</p>
//               <p className="mb-0 text-custom-black">emaildapessoa@gmail.com</p>
//             </div>
//             <button className="btn-custom btn-custom-outline-secondary d-flex align-items-center">
//               Mudar o Email
//             </button>
//           </div>

//           <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex flex-column gap-2">
//               <p className="mb-0 fs-5 text-custom-black fw-semibold">Senha</p>
//               <p className="mb-0 text-custom-black">Mude a sua senha atual</p>
//             </div>
//             <button className="btn-custom btn-custom-outline-secondary d-flex align-items-center">
//               Mudar o senha
//             </button>
//           </div>
//       </div>
//     </>
//   )
// }

function Invite()
{

  return(
    <>
      <div className="">
        <h4 className="text-custom-black fw-bold mb-0">Colaboradores e times</h4>
        <hr />
      </div>


        <form className="d-flex flex-column gap-2 w-100">

          <div className="d-flex align-items-center justify-content-between my-2 ">
            <h3 className="fs-5 mb-0 text-custom-black fw-semibold">Adicionar usuários</h3>
            
            <button className="btn-custom btn-custom-outline-secondary d-flex gap-3 align-items-center">
              <p className="mb-0">Gerenciar</p>
              <ArrowUpRightCircleFill size={25}/>
            </button>
          </div>

          <input type="text" placeholder="Nome.." className="p-2 rounded-2 border bg-body-tertiary w-100"/>
          <input type="text" placeholder="Email.." className="p-2 rounded-2 border bg-body-tertiary w-100"/>

          <button className="my-3 btn-custom btn-custom-success">
            Criar
          </button>
        </form>

        <div className="d-flex align-items-center justify-content-center w-100">
          
        </div>
    </>
  )
}
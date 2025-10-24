import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig/config';
import { useNavigate } from 'react-router';

export default function ResetPassword()
{
    const [ email, setEmail ] = useState("");

    const navigate = useNavigate();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) 
        {
            alert("Preencha o campo de email!");
            return 
        }

        await sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Email sent");
                navigate("/login");
            })
            .catch ((err) => {
                console.error(err);
            })
    }

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}>
            <form className="container bg-light p-5 d-flex flex-column rounded-3 gap-4" style={{ maxWidth: '30rem' }} onSubmit={handleForgotPassword}>
                <div className="">
                    <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Criar nova senha</p>
                    <p className="fs-5 mb-0 text-center text-link-custom" onClick={() => navigate("/login")}
                        style={{ cursor: 'pointer'}}>
                        Voltar
                    </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-5">Email</label>
                    <input type="text" name="" id="emailInput" placeholder="conta@gmail.com" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <button className="btn-custom btn-custom-success fs-5 mt-4" type='submit'>
                    <p className='mb-0 text-custom-white'>Salvar</p>
                </button>

            </form>
        </div>
    )
}
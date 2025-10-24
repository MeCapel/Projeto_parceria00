import React, { useState, useEffect } from 'react'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebaseConfig/config';
import { useNavigate, useSearchParams } from 'react-router';

export default function ConfirmResetPassword()
{
    const [ searchParams ] = useSearchParams();

    const [ email, setEmail ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ isValid, setIsValid ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const oobCode = searchParams.get("oobCode");

    const navigate = useNavigate();

    useEffect(() => {
        if (!oobCode)
        {
            alert("Código inválido!");
            navigate("/login");
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then((email) => {
                setEmail(email);
                setIsValid(true);
            })
            .catch(() => {
                alert("Link inválido ou expirado!");
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, [oobCode, navigate]);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword.trim() || newPassword.length < 6) 
        {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try 
        {
            await confirmPasswordReset(auth, oobCode!, newPassword);
            alert("Senha redefinida com sucesso!");
            navigate("/login");
        }
        catch (err: any)
        {
            console.error(err);
            alert("Erro ao redefinir a nova senha. Tente novamente.");
        }
    };

    if (loading) return <p>Verificando o link...</p>;
    if (!isValid) return <p>Link inválido ou expirado.</p>;

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}>
            <form className="bg-light p-5 d-flex flex-column rounded-3 gap-4" style={{ maxWidth: '30rem' }} onSubmit={handleForgotPassword}>
                <div className="">
                    <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Redefinir senha</p>
                    <p className="fs-5 mb-0 fw-bold text-custom-black text-center"><strong>{email}</strong></p>
                    <p className="fs-5 mb-0 text-center text-link-custom" onClick={() => navigate("/login")}
                        style={{ cursor: 'pointer'}}>
                        Voltar
                    </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-5">Nova senha</label>
                    <input type="password" name="" id="emailInput" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setNewPassword(e.target.value)} required/>
                </div>

                <button className="btn-custom btn-custom-success fs-5 mt-4" type='submit'>
                    <p className='mb-0 text-custom-white'>Salvar nova senha</p>
                </button>

            </form>
        </div>
    )
}
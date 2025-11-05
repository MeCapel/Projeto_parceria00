import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { signIn } from '../services/authService'
import { Microsoft } from 'react-bootstrap-icons'

export default function LoginForm()
{
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!email || !password)
        {
            alert("Preencha os campos e email e senha!");
            return;
        }

        setLoading(true);

        try
        {
            await signIn(email, password);
            navigate('/home');
        }
        catch (error: any)
        {
            alert(error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}>
            <form className="container bg-light p-5 d-flex flex-column rounded-3 gap-4" style={{ maxWidth: '30rem' }} onSubmit={handleLogin}>
                <div className="">
                    <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Entre na sua conta</p>
                    <p className="fs-5 mb-0 text-center text-link-custom" onClick={() => navigate("/signup")}
                        style={{ cursor: 'pointer'}}>
                        Crie uma conta
                    </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-5">Email</label>
                    <input type="text" name="" id="emailInput" placeholder="conta@gmail.com" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-end justify-content-between" style={{ cursor: 'pointer' }}>
                        <label htmlFor="passwordInput" className="fs-5">Senha</label>
                        <p className="fs-5 mb-0 text-link-custom" onClick={() => navigate("/resetPassword")}>Esqueçeu a senha?</p>
                    </div>
                    <input type="password" name="" id="passwordInput" className="py-2 px-3 fs-5 rounded-2" required
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button className="btn-custom btn-custom-success fs-5 mt-4" type='submit' disabled={loading}>
                    <p className='mb-0 text-custom-white'>{loading ? "Entrando..." : "Entrar"}</p>
                </button>

                <div className="d-flex align-items-center justify-content-center gap-4">
                    <hr style={{ width: '10%'}} />
                    <p className="fs-4 mb-0">Ou entre com</p>
                    <hr style={{ width: '10%'}} />
                </div>

                <div className="d-flex flex-column">
                    <button className="btn-custom btn-custom-outline-black fs-5 d-flex gap-3 align-items-center justify-content-center">
                        <Microsoft />
                        Microsoft
                    </button>

                </div>

            </form>
        </div>
    )
}
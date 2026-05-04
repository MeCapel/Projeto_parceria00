// ===== GERAL IMPORTS =====
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { signIn } from '../../services/auth.service'
import { AuthContext } from '../../context/AuthContext';

// ===== MAIN COMPONENT =====
// ----- Conponente responsável por formulário de login / entrar numa conta já cadastrada ----- 
export default function LoginForm()
{
    const { user, checkAuth } = useContext(AuthContext); 
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home', { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Preencha os campos e email e senha!");
            return;
        }

        setLoading(true);

        try {
            // 1. Faz o login e cria o cookie no backend
            await signIn(email, password);
            
            // 2. Agora sim! Avisa o Contexto para ler o cookie e buscar o usuário
            await checkAuth(); 
            
            // O useEffect lá em cima vai detectar o 'user' e fazer o navigate
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <div 
            className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}
        >

            <form 
                className="container bg-light p-5 d-flex flex-column rounded-3 gap-4" 
                style={{ maxWidth: '30rem' }} 
                onSubmit={handleLogin}
            >
                <div className="">
                    <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Entre na sua conta</p>

                    <p className="fs-5 mb-0 text-center text-link-custom" 
                        onClick={() => navigate("/signup")}
                        style={{ cursor: 'pointer'}}
                    >
                        Crie uma conta
                    </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="email" className="fs-5">Email</label>
                    <input
                        id="email" 
                        name="email" 
                        type="text" 
                        placeholder="conta@gmail.com" 
                        className="py-2 px-3 fs-5 rounded-2" 
                        style={{ border: '1px solid var(--gray00)'}} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                

                <div className="d-flex flex-column gap-3">
                    <div 
                        className="d-flex align-items-end justify-content-between" 
                        style={{ cursor: 'pointer' }}
                    >
                        <label htmlFor="password" className="fs-5">Senha</label>
                        <p 
                            className="fs-5 mb-0 text-link-custom" 
                            onClick={() => navigate("/resetPassword")}
                        >
                            Esqueceu a senha?
                        </p>
                    </div>
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="Insira a sua senha"
                        className="py-2 px-3 fs-5 rounded-2" 
                        style={{ border: '1px solid var(--gray00)'}} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <button 
                    className="btn-custom btn-custom-outline-black fs-5 mt-4" 
                    disabled={loading}
                    type='submit' 
                >
                    <p className='mb-0'>{loading ? "Entrando..." : "Entrar"}</p>
                </button>

            </form>
        </div>
    )
}
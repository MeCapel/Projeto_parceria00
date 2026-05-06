// ===== GERAL IMPORTS =====
import React, { useState } from "react"
import { useNavigate } from "react-router"
import { inviteUser } from "../../services/auth.service";

// ===== MAIN COMPONENT =====
// ----- Componente responsável pelo formulário de registro dos usuários / criação de conta -----
export default function SignInForm()
{
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ role, setRole ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleCreateAccount = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!email || !role || !username)
        {
            alert("Preencha os campos e email e senha!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email))
        {
            alert("Poer favor, insira um email válido.");
            setLoading(false);
            return;
        }

        setLoading(true);

        try 
        {
            const data = {
                username: username.trim(),
                email: email.trim(),
                role: role,
            }

            await inviteUser(data);
            alert("User created successfully!");
            navigate("/home");
        }
        catch (error: unknown)
        {
            const err = error as { code?: string, message?: string };
            switch (err.code) {
                case "auth/email-already-in-use":
                    alert("Este email já está em uso.");
                    break;
                case "auth/invalid-email":
                    alert("O formato do email é inválido.");
                    break;
                default:
                    alert("Ocorreu um erro ao criar a conta: " + (err.message || "Erro desconhecido"));
            }
        }
        finally
        {
            setLoading(false)
        }
    }

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}>
            <form className="container bg-light p-5 d-flex flex-column rounded-3 gap-4" style={{ maxWidth: '30rem' }} onSubmit={handleCreateAccount}>
                <div className="">
                        <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Adicionar conta</p>
                        <p className="fs-5 mb-0 text-center text-link-custom" onClick={() => navigate("/login")}
                            style={{ cursor: 'pointer'}}>
                            Entrar na sua conta
                        </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="username" className="fs-5">Nome</label>
                    <input type="text" name="" id="username" className="py-2 px-3 fs-5 rounded-2"  placeholder="Seu nome"
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setUsername(e.target.value)} required/>
                </div>

                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-5">Email</label>
                    <input type="text" name="" id="emailInput" placeholder="conta@gmail.com" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                

                <div className="d-flex flex-column gap-3">
                    <label htmlFor="role" className="fs-5">Pápel</label>
                    <input type="text" name="" id="role" className="py-2 px-3 fs-5 rounded-2" required placeholder="Insira o papel do usuário novo"
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setRole(e.target.value)}/>
                </div>

                <button className="btn-custom btn-custom-outline-black fs-5 mt-4" type="submit" disabled={loading}>
                    <p className='mb-0'>{loading ? "Criando..." : "Criar"}</p>
                </button>

            </form>
        </div>
    )
}
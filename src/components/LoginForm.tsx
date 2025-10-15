import { Microsoft } from 'react-bootstrap-icons'
import { Link } from 'react-router'

// interface LoginFormProps {
//     passwordLength: number;
//     ableNumbers: boolean;
//     ableUppercase: boolean;
//     ableLowercase: boolean;
//     ableSymbols: boolean;
// }

// export default function LoginForm({ passwordLength, ableNumbers, ableUppercase, ableLowercase, ableSymbols } : LoginFormProps)
export default function LoginForm()
{
    return(
        <div className="bg-custom-red01 container-fluid vh-100 d-flex align-items-center justify-content-center flex-column">
            <div className="container bg-light p-5 d-flex flex-column rounded-4 gap-4" style={{ maxWidth: '35rem' }}>
                <p className="fs-1 mb-0 fw-bold text-custom-black">Entre na sua conta</p>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-4">Email</label>
                    <input type="text" name="" id="emailInput" placeholder="conta@gmail.com" className="py-2 px-3 fs-5 rounded-2" style={{ border: '1px solid var(--gray00)'}} />
                </div>
                

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-end justify-content-between" style={{ cursor: 'pointer' }}>
                        <label htmlFor="passwordInput" className="fs-4">Senha</label>
                        <p className="fs-5 mb-0 text-custom-red">Esqueçeu a senha?</p>
                    </div>
                    <input type="password" name="" id="passwordInput" className="py-2 px-3 fs-5 rounded-2" style={{ border: '1px solid var(--gray00)'}} />
                </div>

                <button className="btn-custom btn-custom-success fs-3 mt-4" >
                    <Link to='/' className='text-decoration-none'>
                        <p className='mb-0 text-custom-white'>Entrar</p>
                    </Link>
                </button>

                <div className="d-flex align-items-center justify-content-center gap-4">
                    <hr style={{ width: '25%'}} />
                    <p className="fs-4 mb-0">Ou entre com</p>
                    <hr style={{ width: '25%'}} />
                </div>

                <div className="d-flex flex-column">
                    <button className="btn-custom btn-custom-outline-black fs-3 d-flex gap-3 align-items-center justify-content-center">
                        <Microsoft />
                        Microsoft
                    </button>

                </div>

            </div>
        </div>
    )
}
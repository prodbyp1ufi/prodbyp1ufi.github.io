import { useState } from "react"
import AuthAction from "../../actions/authAction"
import {
    onAuthStateChanged
} from "firebase/auth"
import {auth} from '../../firebase-config'
import './login.css'
import lockImage from '../../resources/Lock.svg'
export default function Login({setUser}){
    const [registrationDisplayName, setRegistrationDisplayName] = useState('')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [authorization, setAuthorization] = useState(true)
    const [registration, setRegistration] = useState(false)
    const [resent, setResent] = useState(false)
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    async function loginUser(){
        if(loginEmail !== '' && loginPassword !== ''){
            await AuthAction.login(loginEmail,loginPassword)
        }
    }
    async function userRegistration(){
        const passwordConfim = document.getElementById('password-confim')
        if(passwordConfim.value === loginPassword){
            if(loginEmail !== '' && loginPassword !== '' && registrationDisplayName !== ''){
                await AuthAction.register(loginEmail,loginPassword, registrationDisplayName)
            }
        }
    }
    async function userResentPassword(){
        if(loginEmail !== ''){
            await AuthAction.resetPassword(loginEmail)
            setLoginPassword('')
            setRegistrationDisplayName('')
            setResent(false)
            setRegistration(false)
            setAuthorization(true)
        }
    }
    function lookPassword(){
        const password = document.getElementById('auth-password')
        password.type = 'text'
    }
    function hidePassword(){
        const password = document.getElementById('auth-password')
        password.type = 'password'
    }
    function changePageOnRegistration(e){
        e.preventDefault()
        setLoginEmail('')
        setLoginPassword('')
        setRegistrationDisplayName('')
        setAuthorization(false)
        setResent(false)
        setRegistration(true)
    }
    function changePageOnAuthorization(e){
        e.preventDefault()
        setLoginEmail('')
        setLoginPassword('')
        setRegistrationDisplayName('')
        setResent(false)
        setRegistration(false)
        setAuthorization(true)
    }
    function changePageOnReset(e){
        e.preventDefault()
        setLoginEmail('')
        setLoginPassword('')
        setRegistrationDisplayName('')
        setRegistration(false)
        setAuthorization(false)
        setResent(true)
    }
    return (
        authorization ? <div className="wrapper">
            <div className="autorization-container _container">
                <div className="body__autorization">
                    <div className="autorization__title">
                        <h2>Авторизация</h2>
                    </div>
                <div className="autorization__form">
                    <div className="autorization__form-email">
                        <h2 className="form__subtitle">
                            Email
                        </h2>
                        <input onChange={(e)=>setLoginEmail(e.target.value)} id="auth-email" type="text" className="form-email__input" placeholder="cooper@example.com"/>
                    </div>
                    <h2 className="form__subtitle">
                        Пароль
                    </h2>
                    <div className="autorization__form-password">
                        <input onChange={(e)=>setLoginPassword(e.target.value)} id="auth-password" type="password" className="form-password__input" placeholder="········"/>
                        <span className="password__input-icon" onMouseLeave={()=>hidePassword()} onMouseEnter={()=>{lookPassword()}}>
                        </span>
                    </div>
                    <div className="autorization__form-remeber">
                        <a href="#" onClick={(e)=>{changePageOnReset(e)}} className="form__remeber-link">Забыли пароль?</a>
                    </div>
                    <div className="autorization__form-log">
                        <input id="auth-enter" tabIndex="4" type="button" value="Войти" onClick={()=>{loginUser()}} />
                    </div>
                    <a href="#" onClick={(e)=>{changePageOnReset(e)}} className="form__remeber-link-phone">Забыли пароль?</a>
                </div>
                <div className="autorization__footer">
                    <h2>Ещё нет аккаунта? <a href="#" onClick={(e)=>changePageOnRegistration(e)}>Зарегистрироваться</a></h2>
                    </div>
                </div>
            </div>
        </div> : 
        registration ?  <div className="wrapper">
            <div className="registration-container _container">
            <div className="body__registration">
                <div className="registration__title">
                    <h2>Региcтрация</h2>
                </div>
                <div className="registration__form">
                    <div className="registration__form-fio">
                        <h2 className="form__subtitle">
                        Отображаемое имя
                        </h2>
                        <input onChange={(e)=>{setRegistrationDisplayName(e.target.value)}} id="FIO" type="text" className="form-fio__input" placeholder="Regina Cooper"/>
                    </div>
                    <div className="registration__form-email">
                        <h2 className="form__subtitle">
                        Email
                        </h2>
                        <input onChange={(e)=>setLoginEmail(e.target.value)} id="email" type="text" className="form-email__input" placeholder="cooper@example.com"/>
                    </div>
                    <h2 className="form__subtitle">
                        Пароль
                    </h2>
                    <div className="registration__form-password">
                        <input onChange={(e)=>setLoginPassword(e.target.value)} id="password" type="password" className="form-password__input" placeholder="········"/>
                    </div>
                    <h2 className="form__subtitle">
                        Подтверждение пароля
                    </h2>
                    <div className="registration__form-password-confirm">
                        <input id="password-confim" type="password" className="form-password__input-confirm" placeholder="········"/>
                    </div>
                    <div className="registration__form-log">
                        <input id="registration-button" type="button" onClick={()=>{userRegistration()}} value="Зарегистрироваться"/>
                    </div>
                </div>
                <div className="registration__footer">
                    <h2>Уже есть аккаунт?<a href="#" onClick={(e)=>{changePageOnAuthorization(e)}}>Войти</a></h2>
                </div>
            </div>
            </div>
        </div>: 
        <div className="wrapper">
        <div className="recovery-container _container">
            <div className="body__recovery">
            <div className="recovery__img">
                <img src={lockImage} alt="" srcSet=""/>
            </div>
            <div className="recovery__form">
                <div className="recovery__title">
                    <h2>Восстановление  пароля</h2>
                </div>
                <h2 className="form__subtitle">
                    Email
                </h2>
                <div className="recovery__form-email">
                    <input onChange={(e)=>setLoginEmail(e.target.value)} id="email-recovery" type="text" className="form-email__input" placeholder="cooper@example.com"/>
                </div>
                <div className="recovery__form-log">
                    <input id="button-recovery" type="button" onClick={()=>{userResentPassword()}} value="Восстановить пароль"/>
                </div>
            </div>
            <div className="recovery__footer">
                <h2>Обратно к<a href="#" onClick={(e)=>changePageOnAuthorization(e)}>Авторизации</a></h2>
            </div>
            </div>
        </div>
    </div>
    ) 
}

{/* <div classNameName="Login">
            <div>
                register
                <input placeholder="login" onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
                <input placeholder="password" onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
                <input value="register" type="button" onClick={()=>{AuthAction.register(registerEmail,registerPassword)}}/>
            </div>
            <div>
                login
                <input placeholder="login" onChange={(e)=>{setLoginEmail(e.target.value)}}/>
                <input placeholder="password" onChange={(e)=>{setLoginPassword(e.target.value)}}/>
                <input value="login" type="button" onClick={()=>{AuthAction.login(loginEmail,loginPassword)}}/>
            </div>
        </div> */}
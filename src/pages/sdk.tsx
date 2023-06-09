import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { Button } from "@dauth/dauth-provider";
import ReactJson from 'react-json-view'
import { FC, useState } from "react";
import { IOtpConfirmReturn, TSign_mode } from "@dauth/core/dist/types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import GoogleLoginCom from "../components/GoogleLogin";
import { useNavigate } from "react-router-dom";
import { dauth } from "../utils";


const SDK: FC = () => {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [smsOtp, setSmsOtp] = useState('')
    const [emailOtp, setEmailOtp] = useState('')
    const [mode, setMode] = useState<TSign_mode>('jwt')
    const [res, setRes] = useState<IOtpConfirmReturn>()
    const authEmailOtp = async () => {
        try {
            await dauth.service.sendOtp({
                account: email,
                account_type: 'email',
                request_id: 'test'
            })
        } catch (error) {
            console.log(error)
        }
    }
    const authSMSOtp = async () => {
        try {
            await dauth.service.sendOtp({
                account: phone,
                account_type: 'sms',
                request_id: 'test'
            })
        } catch (error) {
            console.log(error)
        }
    }
    const authOtpConfirm = async () => {
        try {
            const res = await dauth.service.authOptConfirm({
                code: emailOtp,
                request_id: 'test',
                mode: mode,
                auth_type: 'email'
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const authSMSOtpConfirm = async () => {
        try {
            const res = await dauth.service.authOptConfirm({
                code: smsOtp,
                request_id: 'test',
                mode,
                auth_type: 'sms'
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }

    const authGoogleOAuth = async (token: string) => {
        try {
            const res = await dauth.service.authOauth({
                token,
                request_id: 'test',
                auth_type: 'google',
                mode
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }

    const authAppleOAuth = async (response: any) => {
        const code = response.code
        try {
            const res = await dauth.service.authOauth({
                token: code,
                request_id: 'test',
                auth_type: 'apple',
                mode
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="App">
            <h2 className="text-xl pb-4">@DAuth/core example</h2>
            <div className="flex w-full">
                <div>
                    <div className=" bg-fuchsia-400 p-4 my-4">
                        <div>
                            Global setting
                        </div>

                        <div>
                            Sign mode: (jwt | proof) <input className=" py-2 border-2 w-56 rounded-sm	" value={mode} onChange={(e) => { setMode(e.target.value) }} type='text' />
                        </div>
                    </div>
                    <div className=" bg-red-50 p-4">
                        <div className="text-xl">
                            Email otp example
                        </div>
                        <div className="flex justify-between items-center"> <span className="w-16 inline-block">email:</span>
                            <input className=" py-2 border-2 w-56 rounded-sm	" value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" />
                            <Button onClick={authEmailOtp} className="w-40 ml-10">
                                get otp
                            </Button></div>
                        <br />
                        <div className="flex justify-between items-center">
                            <span className="w-16 inline-block">otp: </span>
                            <input className=" py-2 border-2 w-56	" value={emailOtp} onChange={(e) => { setEmailOtp(e.target.value) }} type="text" />

                            <Button onClick={authOtpConfirm} className="w-40 ml-10">
                                confirm otp
                            </Button>
                        </div>

                    </div>
                    <div className=" bg-red-50 p-4 mt-10">
                        <div className="text-xl">
                            SMS otp example
                        </div>
                        <div className="flex justify-between items-center"> <span className="w-16 inline-block">Phone:</span>
                            <input className=" py-2 border-2 w-56 rounded-sm	" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" />
                            <Button onClick={authSMSOtp} className="w-40 ml-10">
                                get otp
                            </Button></div>
                        <br />
                        <div className="flex justify-between items-center">
                            <span className="w-16 inline-block">otp: </span>
                            <input className=" py-2 border-2 w-56	" value={smsOtp} onChange={(e) => { setSmsOtp(e.target.value) }} type="text" />

                            <Button onClick={authSMSOtpConfirm} className="w-40 ml-10">
                                confirm otp
                            </Button>
                        </div>

                    </div>
                    <div className=" bg-red-50 p-4  mt-10">
                        <div className="text-xl py-4">
                            Google oauth example
                        </div>
                        <GoogleOAuthProvider clientId="821654150370-q5hjra4s693p61l3giv7halqf42h37o1.apps.googleusercontent.com">
                            <GoogleLoginCom onLoginSuccess={authGoogleOAuth}></GoogleLoginCom>
                        </GoogleOAuthProvider>
                    </div>
                    <div className=" bg-red-50 p-4  mt-10">
                        <div className="text-xl py-4">
                            Apple signin  example
                        </div>
                        <AppleLogin
                            callback={authAppleOAuth}
                            clientId="com.duath.network.oauth"
                            scope="email"
                            responseMode="query"
                            responseType="code"

                            redirectURI="https://demo-api.dauth.network/" />
                    </div>
                </div>
                <div className="p-10 w-3/5">
                    {res && <ReactJson displayDataTypes={false} quotesOnKeys={false} name={null} collapseStringsAfterLength={128} indentWidth={2} src={res!} />}
                </div>
            </div>
        </div>
    );

}

export default SDK;


import { SigninForm } from "@/components/auth/signin-form"

const Login = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SigninForm />
            </div>
        </div>
    );
}

export default Login;

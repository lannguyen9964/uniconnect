import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

const signInSchema = z.object({
    username: z.string().min(3, "Username not found"),
    password: z.string().min(6, "Invalid password"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SigninForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { signIn } = useAuthStore();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema)
    });

    const onSubmit = async (data: SignInFormData) => {
        // Call backend API to sign in the user
        const { username, password } = data;
        const signedIn = await signIn(username, password);

        // stay on the form when the credentials were rejected
        if (signedIn) {
            navigate("/");
        }


    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* Logo and heading */}
                            <div className="flex flex-col items-center text-center gap-2">

                                <h1 className="text-2xl font-bold">Welcome back!</h1>
                                <p className="text-muted-foreground text-balance">
                                    We're so excited to see you again!
                                </p>
                            </div>


                        </div>

                        {/* username */}
                        <div className="flex flex-col gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="block text-sm">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="error-message">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="block text-sm">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="error-message">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit button */}
                        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                            Sign In
                        </Button>

                        <div className="text-center mt-4 text-sm">
                            Need an account? {" "}
                            <a href="/register" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>

                        <div className="px-6 text-center text-balance *:[a]:hover:text-primary *:[a]:underline">
                            <a href="#">Terms of Service</a>{" "}
                            and <a href="#">Privacy Policy</a>.
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block overflow-hidden">
                        <img
                            src="/logo.svg"
                            alt="Image"
                            className="h-full w-full absolute top-1/2 -translate-y-1/2 object-cover)"
                        />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

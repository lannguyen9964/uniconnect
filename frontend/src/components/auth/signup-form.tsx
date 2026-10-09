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

const signUpSchema = z.object({
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();


  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { firstname, lastname, username, email, password } = data;
    await signUp(username, password, email, firstname, lastname);
    navigate("/login");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Logo and heading */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="Logo" />
                </a>

                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Join our community today and connect with your classmates!
                </p>
              </div>

              {/*First name and last name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    First name
                  </Label>
                  <Input
                    id="firstname"
                    type="text"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="error-message">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Last name
                  </Label>
                  <Input
                    id="lastname"
                    type="text"
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="error-message">
                      {errors.lastname.message}
                    </p>
                  )}
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

              {/* Email field */}
              <div className="flex flex-col gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="error-message">
                      {errors.email.message}
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Create Account
              </Button>

              <div className="text-center text-sm">
                Already have an account? {" "}
                <a href="/login" className="underline underline-offset-4">
                  Log in
                </a>
              </div>

              <div className="px-6 text-center text-balance *:[a]:hover:text-primary *:[a]:underline">
                By registering, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
              </div>

            </div>


          </form>

        </CardContent>
      </Card>
    </div >
  )
}

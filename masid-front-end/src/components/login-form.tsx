import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/useLogin";

type LoginProps = {
  href?: string;
  title?: string;
  des?: string;
};

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Password should be minimum of 8" }),
});

export function LoginForm({ href, title, des }: LoginProps) {
  const { login } = useLogin();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // console.log(captchaToken)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }
    login(values.email, values.password, captchaToken);
  }
  return (
    <Form {...form}>
      <div className="py-5">
        <h1 className="text-gray-900 font-semibold text-lg">{title ? title : "Login"}</h1>
        <p className="text-gray-700 text-md">{des ? des : "Login to your account"}</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-900">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-900">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ReCAPTCHA 
        sitekey="6Ldpk7ArAAAAAEWjwcTREcHRH4u12ByICBHD-s3Q"
        onChange={(token) => setCaptchaToken(token)}/>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <p className="text-gray-900 text-md text-center">
          Don't have an account?{" "}
          <a className="text-blue-700" href={href ? href : "/auth/buyer/register"}>
            Register
          </a>
        </p>
      </form>
    </Form>
  );
}

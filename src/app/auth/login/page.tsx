"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

//  kimleangsama, kimleangsama

const FormSchema = z.object({
  username: z.string({
    message: "Input must be a string",
  }).min(8, {
    message: "Username must be at least 8 characters long.",
  }),
  password: z.string({
    message: "Input must be a string",
  }).min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "superadmin",
      password: "superadmin@_@",
    },
  })

  const {
    user,
    login,
    isLoading,
  } = useAuth({
    requiredAuth: false,
  });

  if (user) {
    redirect('/dashboard');
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    login(data.username, data.password).then((res: any) => {
      if (res?.success) {
        toast.success("Successfully logged in")
      }
    })
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    .catch((error: any) => {
      toast.error("" + error)
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                              <a
                                href="#"
                                className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                              >
                                Forgot your password?
                              </a>
                            </div>
                            <FormControl>
                              <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Login
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href={"/auth/signup"} className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

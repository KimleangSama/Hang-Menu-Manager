"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SailboatIcon } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const roles = [
    {
        id: "manager",
        label: "Manager",
    },
    {
        id: "chef",
        label: "Chef",
    },
    {
        id: "waiter",
        label: "Waiter",
    },
    {
        id: "cashier",
        label: "Cashier",
    },
    {
        id: "delivery",
        label: "Delivery",
    },
    {
        id: "driver",
        label: "Driver",
    },
] as const

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
    roles: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

export default function SignUpPage() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            roles: ["manager", "chef"],
        },
    })
    const {
        signup,
        isLoading,
    } = useAuth({
        requiredAuth: false,
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        signup(data.username, data.password, data.roles).then((res: any) => {
            if (res?.success) {
                toast.success("Account created successfully")
                setTimeout(() => {
                    toast.dismiss()
                    redirect("/auth/login")
                }, 1500)
            } else {
                toast.error("" + res?.error)
            }
        }).catch((error: any) => {
            toast.error("" + error)
        })
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex roles-center gap-2 font-medium">
                        <div className="flex h-6 w-6 roles-center justify-center rounded-md bg-primary text-primary-foreground">
                            <SailboatIcon className="h-4 w-4" />
                        </div>
                        Hang.
                    </a>
                </div>

                <div className="flex flex-1 roles-center justify-center">
                    <div className="w-full max-w-xs">
                        <Form {...form}>
                            <form className={cn("flex flex-col gap-6")} onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col roles-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Create a new account</h1>
                                    <p className="text-balance text-sm text-muted-foreground">
                                        Enter your details below to get started
                                    </p>
                                </div>
                                <div className="grid gap-6">
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
                                                    <FormLabel>Password</FormLabel>
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
                                    <FormField
                                        control={form.control}
                                        name="roles"
                                        render={() => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel className="text-base">Roles</FormLabel>
                                                </div>
                                                {roles.map((role) => (
                                                    <FormField
                                                        key={role.id}
                                                        control={form.control}
                                                        name="roles"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={role.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(role.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, role.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== role.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {role.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div >

            {/* Right Side (Illustration / Image) */}
            < div
                className="relative hidden bg-muted lg:block bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(/images/undraw_ordinary-day_ak4e.svg)`,
                    backgroundSize: "80%",
                }
                }
            />
        </div >
    )
}
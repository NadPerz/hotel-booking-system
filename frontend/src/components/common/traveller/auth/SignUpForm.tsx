import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignUpFormProps {
    onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
    return (
        <>
            <form>
                <div className="grid gap-4 transition-all duration-500">
                    <div className="grid gap-3 transition-all duration-500">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" type="text" placeholder="Enter your full name" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Create a password" />
                    </div>
                    <div className="grid gap-3 transition-all duration-500">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" />
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Sign Up</Button>
                </DialogFooter>
            </form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={onSwitchToSignIn}
                >
                    Sign in here
                </Button>
            </div>
        </>
    )
}

export default SignUpForm
